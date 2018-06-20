import { Gene, GeneLink } from '../../app/models';
import { Genes } from '../../app/schemas/gene';
import { GenesLinks } from '../../app/schemas/geneLink';
import * as express from 'express';
import * as mongoose from 'mongoose';

mongoose.set('debug', true);

const router = express.Router();
const database = { url: '' };
const env = process.env.NODE_ENV || 'development';

// Set the database url
if (process.env.Docker) {
    // Service name here, not the localhost
    database.url = 'mongodb://mongodb/walloftargets';
} else {
    database.url = 'mongodb://localhost/walloftargets';
}

// Connect to mongoDB database, local or remotely
mongoose.connect(database.url);
// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* GET genes listing. */
router.get('/', (req, res) => {
    res.send({ title: 'Genes API Entry Point' });
});

// Preprocess the data when the server goes up

// Get the genes collection size
let genesById: Gene[] = [];
let genesByScore: Gene[] = [];
let geneEntries: Gene[] = [];
let allGenes: Gene[] = [];
let totalRecords = 0;
const allTissues: string[] = [];
const allModels: string[] = [];

// Group by id and sort by hgnc_symbol
Genes.aggregate(
    [
        {
            $match: {
                $or: [
                    {
                        $or: [
                            {
                                logfc: {
                                    $lte: -0.5
                                }
                            },
                            {
                                logfc: {
                                    $gte: 0.5
                                }
                            }
                        ]
                    }
                ],
            }
        },
        {
            $group: {
                _id: '$_id',
                hgnc_symbol: { $first: '$hgnc_symbol' },
                ensembl_gene_id : { $first: '$ensembl_gene_id' },
                logfc : { $first: '$logfc' },
                ci_l : { $first: '$ci_l' },
                ci_r : { $first: '$ci_r' },
                adj_p_val : { $first: '$adj_p_val' },
                tissue : { $first: '$tissue' },
                study : { $first: '$study' },
                model : { $first: '$model' }
            }
        },
        {
            $sort: {
                hgnc_symbol: 1
            }
        }
    ]
).allowDiskUse(true).exec().then((genes) => {
    // All the genes, ordered by hgnc_symbol
    allGenes = genes.slice();
    // Unique genes, ordered by hgnc_symbol
    const seen = {};
    genesById = genes.slice().filter((g) => {
        if (allTissues.indexOf(g['tissue']) === -1) {
            allTissues.push(g['tissue']);
        }
        if (allModels.indexOf(g['model']) === -1) {
            allModels.push(g['model']);
        }
        if (seen[g['hgnc_symbol']]) { return; }
        seen[g['hgnc_symbol']] = true;
        return g['hgnc_symbol'];
    });
    // Unique genes, ordered by score
    genesByScore = genesById.slice().sort((a, b) => {
        return (a.logfc > b.logfc) ? 1 : ((b.logfc > a.logfc) ? -1 : 0);
    });

    totalRecords = genesById.length;
});

// Routes to get genes information
router.get('/genes', (req, res, next) => {
    // Adding this condition because UglifyJS can't handle ES2015, only needed for the server
    if (env === 'development') {
        console.log('Get all genes');
    }

    const resObj = {
        items: [],
        geneEntries: []
    };
    const chartGenes = allGenes.slice();
    if (geneEntries) {
        resObj.geneEntries = geneEntries;
        geneEntries.forEach((ge) => {
            // If the current entry does not exist in the all genes array
            if (!allGenes.some((g) => {
                return (g.hgnc_symbol === ge.hgnc_symbol) &&
                       (g.tissue === ge.tissue) &&
                       (g.model === ge.model);
            })) {
                chartGenes.push(ge);
            }
        });
    }
    resObj.items = chartGenes;

    // Use mongoose to get one page of genes
    res.json(resObj);
});

// Use mongoose to get one page of genes
router.get('/genes/page', (req, res, next) => {
    // Adding this condition because UglifyJS can't handle ES2015, only needed for the server
    if (env === 'development') {
        console.log('Get a page of genes');
        console.log(req.query);
    }

    // Convert the strings
    const skip = (+req.query.first) ? +req.query.first : 0;
    const limit = (+req.query.rows) ? +req.query.rows : 10;

    // Get one array or the other depending on the list column we want to sort by
    let genes: Gene[] = [];

    if (req.query.globalFilter !== 'null' && req.query.globalFilter) {
        ((req.query.sortField === 'logfc') ? genesByScore : genesById).forEach((g) => {
            // If we typed into the search above the list
            if (g.hgnc_symbol.includes(req.query.globalFilter.trim().toUpperCase()))  {
                // Do not use a shallow copy here
                genes.push(JSON.parse(JSON.stringify(g)));
            }
        });
    } else {
        genes = ((req.query.sortField === 'logfc') ? genesByScore : genesById).slice();
    }
    // Updates the global length based on the filter
    totalRecords = genes.length;

    // If we want sort in the reverse order, this is done in-place
    const sortOrder = (+req.query.sortOrder) ? +req.query.sortOrder : 1;
    if (sortOrder === -1) { genes.reverse(); }

    // Send the final genes page
    res.json({ items: genes.slice(skip, skip + limit), totalRecords });
});

// Get all genes that match an id, currently hgnc_symbol
router.get('/genes/:id', (req, res, next) => {
    // Adding this condition because UglifyJS can't handle ES2015, only needed for the server
    if (env === 'development') {
        console.log('Get the genes that match an id');
        console.log(req.params.id);
    }

    // Return an empty array in case no id was passed or no params
    if (!req.params || !req.params.id) { res.json({ items: []}); }

    // Get one array or the other depending on the list column we want to sort by
    const genes: Gene[] = [];
    // Filter the map using a for loop. For arrays it is Twice as fast as a native filter
    // https://jsperf.com/array-filter-performance
    genesById.forEach((g) => {
        if (g.hgnc_symbol.includes(req.params.id.trim().toUpperCase())) {
            // Do not use a shallow copy here
            genes.push(JSON.parse(JSON.stringify(g)));
        }
    });

    res.json({ items: genes });
});

// Get a gene by id, currently hgnc_symbol
router.get('/gene/:id', (req, res, next) => {
    // Adding this condition because UglifyJS can't handle ES2015, only needed for the server
    if (env === 'development') {
        console.log('Get a gene with an id');
        console.log(req.params.id);
    }

    // Return an empty array in case no id was passed or no params
    if (!req.params || !req.params.id) {
        // Adding this condition because UglifyJS can't handle ES2015, only needed for the server
        if (env === 'development') {
            console.log('no id');
        }
        res.json({ item: null });
    }

    // Find all the Genes with the current id
    Genes.find({ hgnc_symbol: req.params.id}).exec((err, genes) => {
        if (err) {
            next(err);
        } else {
            geneEntries = genes.slice();
            let minLogFC: number = +Infinity;
            let maxLogFC: number = -Infinity;
            let maxAdjPValue: number = -Infinity;
            let minAdjPValue: number = Infinity;
            genes.forEach((g) => {
                if (+g.logfc > maxLogFC) { maxLogFC = (+g.logfc); }
                if (+g.logfc < minLogFC) { minLogFC = (+g.logfc); }
                const adjPVal: number = +g.adj_p_val;
                if (+g.adj_p_val) {
                    if (adjPVal > maxAdjPValue) {
                        maxAdjPValue = adjPVal;
                    }
                    if (adjPVal < minAdjPValue) {
                        minAdjPValue = (adjPVal) < 1e-20 ? 1e-20 : adjPVal;
                    }
                }
            });

            res.json({
                item: genes[0],
                minLogFC: (Math.abs(maxLogFC) > Math.abs(minLogFC)) ? -maxLogFC : minLogFC,
                maxLogFC,
                minAdjPValue,
                maxAdjPValue
            });
        }
    });
});

// Get a gene list by id
router.get('/genelist/:id', (req, res, next) => {
    // Adding this condition because UglifyJS can't handle ES2015, only needed for the server
    if (env === 'development') {
        console.log('Get a gene list with an id');
        console.log(req.params.id);
    }

    // Return an empty array in case no id was passed or no params
    if (!req.params || !req.params.id) { res.json({ items: [] }); }
    GenesLinks.find({geneA_ensembl_gene_id: req.params.id}).exec((err, links) => {
        const arr = links.slice().map((slink) => {
            return slink.toJSON()['geneB_ensembl_gene_id'];
        });
        GenesLinks.find({ geneA_ensembl_gene_id: { $in: arr } })
            .where('geneB_ensembl_gene_id')
            .in(arr)
            .exec((errB, linksC) => {
                if (err) {
                next(err);
            } else {
                    const flinks = [...links, ...linksC];
                    res.json({ items: flinks });
            }
        });
    });
});

// Get all the tissues
router.get('/tissues', (req, res, next) => {
    // Adding this condition because UglifyJS can't handle ES2015, only needed for the server
    if (env === 'development') {
        console.log('Get all tissues');
    }

    // Return an empty array in case we don't have tissues
    if (!allTissues.length) { res.json({ items: null }); }

    res.json({ items: allTissues });
});

// Get all the models
router.get('/models', (req, res, next) => {
    // Adding this condition because UglifyJS can't handle ES2015, only needed for the server
    if (env === 'development') {
        console.log('Get all models');
    }

    // Return an empty array in case we don't have models
    if (!allModels.length) { res.json({ items: null }); }

    res.json({ items: allModels });
});

export default router;
