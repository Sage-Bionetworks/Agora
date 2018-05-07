import * as express from 'express';
import * as mongoose from 'mongoose';

import { Gene, GeneLink } from '../../app/models';

mongoose.set('debug', true);

const router = express.Router();
const database = { url: '' };

import { Genes } from '../../app/schemas/gene';
import { GenesLinks } from '../../app/schemas/geneLink';

// Set the rdatabase
console.log('env', express().get('env'));
if (express().get('env') === 'development') {
    database.url = 'mongodb://localhost:27017/walloftargets';
} else {
    database.url =
        'mongodb://wotadmin:2w3o5t8@ec2-34-237-52-244.compute-1.amazonaws.com:27017/walloftargets';
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
                    },
                    {
                        neg_log10_adj_p_val: {
                            $gte: 10
                        }
                    }
                ],
            }
        },
        {
            $group: {
                _id: '$_id',
                hgnc_symbol: { $first: '$hgnc_symbol' },
                aveexpr : { $first: '$aveexpr' },
                ensembl_gene_id : { $first: '$ensembl_gene_id' },
                logfc : { $first: '$logfc' },
                ci_l : { $first: '$ci_l' },
                ci_r : { $first: '$ci_r' },
                adj_p_val : { $first: '$adj_p_val' },
                neg_log10_adj_p_val : { $first: '$neg_log10_adj_p_val' },
                tissue_study_pretty : { $first: '$tissue_study_pretty' },
                comparison_model_sex_pretty : { $first: '$comparison_model_sex_pretty' }
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
        if (seen[g['hgnc_symbol']]) { return; }
        seen[g['hgnc_symbol']] = true;
        return g['hgnc_symbol'];
    });
    // Unique genes, ordered by score
    genesByScore = genesById.slice().sort((a, b) => {
        return (a.aveexpr > b.aveexpr) ? 1 : ((b.aveexpr > a.aveexpr) ? -1 : 0);
    });

    totalRecords = genesById.length;
});

// Routes to get genes information
router.get('/genes', (req, res, next) => {
    console.log('Get all genes');

    const chartGenes = allGenes.slice();
    if (geneEntries) {
        geneEntries.forEach((ge) => {
            // If the current entry does not exist in the all genes array
            if (!allGenes.some((g) => {
                return (g.hgnc_symbol === ge.hgnc_symbol) &&
                       (g.tissue_study_pretty === ge.tissue_study_pretty) &&
                       (g.comparison_model_sex === ge.comparison_model_sex);
            })) {
                chartGenes.push(ge);
            }
        });
    }

    // Use mongoose to get one page of genes
    res.json({ items: chartGenes });
});

// Use mongoose to get one page of genes
router.get('/genes/page', (req, res, next) => {
    console.log('Get a page of genes');
    console.log(req.query);

    // Convert the strings
    const skip = (+req.query.first) ? +req.query.first : 0;
    const limit = (+req.query.rows) ? +req.query.rows : 10;

    // Get one array or the other depending on the list column we want to sort by
    let genes: Gene[] = [];

    if (req.query.globalFilter !== 'null' && req.query.globalFilter) {
        ((req.query.sortField === 'aveexpr') ? genesByScore : genesById).forEach((g) => {
            // If we typed into the search above the list
            if (g.hgnc_symbol.includes(req.query.globalFilter.trim().toUpperCase()))  {
                // Do not use a shallow copy here
                genes.push(JSON.parse(JSON.stringify(g)));
            }
        });
    } else {
        genes = ((req.query.sortField === 'aveexpr') ? genesByScore : genesById).slice();
    }
    // Updates the global length based on the filter
    totalRecords = genes.length;

    // If we want sort in the reverse order, this is done in-place
    const sortOrder = (+req.query.sortOrder) ? +req.query.sortOrder : 1;
    if (sortOrder === -1) { genes.reverse(); }

    // Send the final genes page
    res.json({ items: genes.slice(skip, skip + limit), totalRecords });
});

// Get a gene by id, currently hgnc_symbol
router.get('/genes/:id', (req, res, next) => {
    console.log('Get the genes that match an id');
    console.log(req.params.id);
    // Return an empty array in case no id was passed or no params
    if (!req.params || !req.params.id) { res.json({ items: []}); }

    // Get one array or the other depending on the list column we want to sort by
    const genes: Gene[] = [];

    // Filter the map using a for loop. For arrays it is Twice as fast as a native filter
    // https://jsperf.com/array-filter-performance
    genesById.forEach((g) => {
        console.log(g);
        if (g.hgnc_symbol.includes(req.params.id.trim().toUpperCase())) {
            // Do not use a shallow copy here
            genes.push(JSON.parse(JSON.stringify(g)));
        }
    });

    res.json({ items: genes });
});

// Get a gene by id, currently hgnc_symbol
// Get a gene by id, currently hgnc_symbol
router.get('/gene/:id', (req, res, next) => {
    console.log('Get a gene with an id');
    console.log(req.params.id);
    // Return an empty array in case no id was passed or no params
    if (!req.params || !req.params.id) {
        console.log('no id');
        res.json({ item: null });
    }

    Genes.find({ hgnc_symbol: req.params.id }).exec((err, genes) => {
        if (err) {
            console.log(err);
            next(err);
        } else {
            console.log('loaded', genes);
            geneEntries = genes.slice();
            let minLogFC = +Infinity;
            let maxLogFC = -Infinity;
            let maxNegLogPValue = -Infinity;
            genes.forEach((g) => {
                if (+g.logfc > maxLogFC) { maxLogFC = (+g.logfc); }
                if (+g.logfc < minLogFC) { minLogFC = (+g.logfc); }
                if (+g.neg_log10_adj_p_val > maxNegLogPValue) {
                    maxNegLogPValue = (+g.neg_log10_adj_p_val);
                }
            });
            res.json({
                item: genes[0],
                minLogFC: (Math.abs(maxLogFC) > Math.abs(minLogFC)) ? -maxLogFC : minLogFC,
                maxLogFC,
                maxNegLogPValue
            });
        }
    });
});

// Get a gene list by id
router.get('/genelist/:id', function(req, res, next) {
    console.log('Get a gene list with an id');
    console.log(req.params.id);
    // Return an empty array in case no id was passed or no params
    if (!req.params || !req.params.id) { res.json({ items: [] }); }
    GenesLinks.find({geneA_ensembl_gene_id: req.params.id}).exec((err, links) => {
        const arr = links.map((slink) => {
            return slink.toJSON()['geneB_ensembl_gene_id'];
        });
        GenesLinks.find({ geneA_ensembl_gene_id: { $in: arr } })
            .where('geneB_ensembl_gene_id')
            .in(arr)
            .exec((errB, linksC) => {
                if (err) {
                console.log(err);
                next(err);
            } else {
                    const flinks = [...links, ...linksC];
                    res.json({ items: flinks });
            }
        });
    });
});
export default router;
