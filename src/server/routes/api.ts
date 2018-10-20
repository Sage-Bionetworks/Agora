import { Gene, GeneInfo } from '../../app/models';
import { Genes, GenesInfo, GenesLinks, TeamsInfo } from '../../app/schemas';

import * as express from 'express';
import * as mongoose from 'mongoose';
import * as Grid from 'gridfs';
import * as awsParamStore from 'aws-param-store';

const router = express.Router();
const database = { url: '' };
const env = (process.env.mode || process.env.NODE_ENV || process.env.ENV || 'development');

if (env === 'development') {
    mongoose.set('debug', true);
}

// Set the database url
if (process.env.MONGODB_HOST && process.env.MONGODB_PORT) {
    const results = awsParamStore.getParametersSync(
        [
            '/agora-develop/MongodbUsername', '/agora-develop/MongodbPassword'
        ], { region: 'us-east-1' }
    );

    database.url = 'mongodb://' + results.Parameters[0] + ':' + results.Parameters[1]
        + '@' + process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT + '/agora'
        + '?authSource=admin';
} else {
    // Fallback to the service for now
    // Service name here, not the localhost
    database.url = 'mongodb://localhost:27017/agora';
}

mongoose.connect(database.url, { useNewUrlParser: true });

// Get the default connection
const connection = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Get our grid file system instance
Grid.mongo = mongoose.mongo;

connection.once('open', () => {
    const gfs = Grid(connection.db);

    // Preprocess the data when the server goes up

    // Get the genes collection size
    let tableGenesById: GeneInfo[] = [];
    let tableGenesByNom: GeneInfo[] = [];
    let geneEntries: Gene[] = [];
    let allGenes: Gene[] = [];
    let totalRecords = 0;
    const allTissues: string[] = [];
    const allModels: string[] = [];
    let geneTissues: string[] = [];
    let geneModels: string[] = [];

    // Group by id and sort by hgnc_symbol
    Genes.aggregate(
        [
            {
                $group: {
                    _id: '$_id',
                    hgnc_symbol: { $first: '$hgnc_symbol' },
                    ensembl_gene_id : { $first: '$ensembl_gene_id' },
                    logfc : { $first: '$logfc' },
                    fc : { $first: '$fc' },
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
        genes.slice().filter((g) => {
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
    });

    GenesInfo.find({ nominations: { $gt: 0 } })
        .sort({ hgnc_symbol: 1 }).exec((err, genes, next) => {
        if (err) {
            next(err);
        } else {
            tableGenesById = genes.slice();
            // Table genes ordered by nominations
            tableGenesByNom = genes.slice().sort((a, b) => {
                return (a.nominations > b.nominations) ? 1 :
                    ((b.nominations > a.nominations) ? -1 : 0);
            });

            totalRecords = tableGenesById.length;
        }
    });

    /* GET genes listing. */
    router.get('/', (req, res) => {
        res.send({ title: 'Genes API Entry Point' });
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
    router.get('/genes/page', (req, res) => {
        // Adding this condition because UglifyJS can't handle ES2015, only needed for the server
        if (env === 'development') {
            console.log('Get a page of genes');
            console.log(req.query);
        }

        // Convert the strings
        const skip = (+req.query.first) ? +req.query.first : 0;
        const limit = (+req.query.rows) ? +req.query.rows : 10;

        // Get one array or the other depending on the list column we want to sort by
        let genes: GeneInfo[] = [];

        if (req.query.globalFilter !== 'null' && req.query.globalFilter) {
            ((req.query.sortField === 'nominations') ? tableGenesByNom : tableGenesById).forEach(
                (g) => {
                // If we typed into the search above the list
                if (g.hgnc_symbol.includes(req.query.globalFilter.trim().toUpperCase()))  {
                    // Do not use a shallow copy here
                    genes.push(JSON.parse(JSON.stringify(g)));
                }
            });
        } else {
            genes = ((req.query.sortField === 'nominations') ? tableGenesByNom :
                tableGenesById).slice();
        }
        // Updates the global length based on the filter
        totalRecords = genes.length;

        // If we want sort in the reverse order, this is done in-place
        const sortOrder = (+req.query.sortOrder) ? +req.query.sortOrder : 1;
        if (sortOrder === -1) { genes.reverse(); }

        // Send the final genes page
        res.json({ items: genes.slice(skip, skip + limit), totalRecords });
    });

    // Use mongoose to get all pages for the table
    router.get('/genes/table', (req, res) => {
        // Adding this condition because UglifyJS can't handle ES2015, only needed for the server
        if (env === 'development') {
            console.log('Get a page of genes');
            console.log(req.query);
        }

        res.json({ items: tableGenesById, totalRecords: tableGenesById.length });
    });

    // Get all gene infos that match an id, currently hgnc_symbol
    router.get('/gene/infos/:id', (req, res, next) => {
        // Adding this condition because UglifyJS can't handle ES2015, only needed for the server
        if (env === 'development') {
            console.log('Get the genes that match an id');
            console.log(req.params.id);
        }

        // Return an empty array in case no id was passed or no params
        if (!req.params || !req.params.id) { res.json({ items: []}); } else {
            GenesInfo.find({ hgnc_symbol: { $regex: req.params.id.trim(), $options: 'i' } }).exec(
                (err, geneInfos) => {
                    if (err) {
                        next(err);
                    } else {
                        res.json({ items: geneInfos });
                    }
                });
        }
    });

    // Get all genes infos that match an array of ids, currently hgnc_symbol
    router.get('/mgenes/infos', (req, res, next) => {
        // Adding this condition because UglifyJS can't handle ES2015, only needed for the server
        if (env === 'development') {
            console.log('Get the genes that match multiple ids');
        }

        // Return an empty array in case no id was passed or no params
        if (!req.query || !req.query.ids) { res.json({ items: [] });
        } else {
            const ids = req.query.ids.split(',');

            GenesInfo.find({ ensembl_gene_id: { $in: ids } }).exec(
                (err, geneInfos) => {
                    if (err) {
                        next(err);
                    } else {
                        res.json({ items: geneInfos });
                    }
                });
        }
    });

    // Get a gene by id, can be hgnc_symbol or ensembl_gene_id
    router.get('/gene', (req, res, next) => {
        // Adding this condition because UglifyJS can't handle ES2015, only needed for the server
        if (env === 'development') {
            console.log('Get a gene with an id');
            console.log(req.query.id);
        }

        // Return an empty array in case no id was passed or no params
        if (!req.params || !Object.keys(req.query).length) {
            if (env === 'development') {
                console.log('no id');
            }
            res.json({ item: null });
        } else {
            const fieldName = (req.query.id.startsWith('ENSG')) ? 'ensembl_gene_id' : 'hgnc_symbol';
            const queryObj = { [fieldName]: req.query.id };

            if (req.query.tissue) {
                queryObj['tissue'] = req.query.tissue;
            }
            if (req.query.model) {
                queryObj['model'] = req.query.model;
            }

            // Find all the Genes with the current id
            Genes.find(queryObj).exec((err, genes) => {
                if (err) {
                    next(err);
                } else {
                    geneEntries = genes.slice();
                    let minFC: number = +Infinity;
                    let maxFC: number = -Infinity;
                    let minLogFC: number = +Infinity;
                    let maxLogFC: number = -Infinity;
                    let maxAdjPValue: number = -Infinity;
                    let minAdjPValue: number = Infinity;
                    geneTissues = [];
                    geneModels = [];
                    genes.forEach((g) => {
                        if (+g.fc > maxFC) { maxFC = (+g.fc); }
                        if (+g.fc < minFC) { minFC = (+g.fc); }
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
                        if (geneTissues.indexOf(g.tissue) === -1) {
                            geneTissues.push(g.tissue);
                        }
                        if (geneModels.indexOf(g.model) === -1) {
                            geneModels.push(g.model);
                        }
                    });

                    GenesInfo.findOne({ [fieldName]: req.query.id }).exec((errB, info) => {
                        if (errB) {
                            next(errB);
                        } else {
                        // Adding this condition because UglifyJS can't handle ES2015, only needed
                            // for the server
                            if (env === 'development') {
                                console.log('The gene info and item');
                                console.log(info);
                                console.log(geneEntries[0]);
                            }

                            res.json({
                                info,
                                item: geneEntries[0],
                                minFC: (Math.abs(maxFC) > Math.abs(minFC)) ? -maxFC : minFC,
                                maxFC,
                                minLogFC: (Math.abs(maxLogFC) > Math.abs(minLogFC)) ?
                                    -maxLogFC : minLogFC,
                                maxLogFC,
                                minAdjPValue,
                                maxAdjPValue
                            });
                        }
                    });
                }
            });
        }
    });

    // Get a gene list by id
    router.get('/genelist/:id', (req, res, next) => {
        // Adding this condition because UglifyJS can't handle ES2015, only needed for the server
        if (env === 'development') {
            console.log('Get a gene list with an id');
            console.log(req.params.id);
        }

        // Return an empty array in case no id was passed or no params
        if (!req.params || !req.params.id) { res.json({ items: [] }); } else {
            GenesLinks.find({ geneA_ensembl_gene_id: req.params.id }).exec((err, links) => {
                const arrA = links.slice().map((slink) => {
                    return slink.toJSON()['geneB_ensembl_gene_id'];
                });

                GenesLinks.find({ geneB_ensembl_gene_id: req.params.id }, (errB, linkB) => {
                    const arrB = linkB.slice().map((slink) => {
                        return slink.toJSON()['geneA_ensembl_gene_id'];
                    });
                    const arr = [...arrA, ...arrB];
                    GenesLinks.find({ geneA_ensembl_gene_id: { $in: arr } })
                        .where('geneB_ensembl_gene_id')
                        .in(arr)
                        .exec((errC, linksC) => {
                            if (errC) {
                                next(errC);
                            } else {
                                const flinks = [...links, ...linkB, ...linksC];
                                res.json({ items: flinks });
                            }
                        });
                });
            });
        }
    });

    // Get a team by team field
    router.get('/teams', (req, res, next) => {
        // Adding this condition because UglifyJS can't handle ES2015, only needed for the server
        if (env === 'development') {
            console.log('Get a team from a nominated gene');
            console.log(req.query);
        }

        // Return an empty array in case no id was passed or no params
        if (!req.params || !Object.keys(req.query).length) { res.json({ items: [] }); } else {
            const arr = req.query.teams.split(', ');

            TeamsInfo.find({ team: { $in: arr } }).exec((err, team) => {
                if (err) {
                    next(err);
                } else {
                    res.json({ items: team });
                }
            });
        }
    });

    // Get all team infos
    router.get('/teams/all', (req, res, next) => {
        // Adding this condition because UglifyJS can't handle ES2015, only needed for the server
        if (env === 'development') {
            console.log('Get all team infos');
        }

        TeamsInfo.find().exec((err, teams) => {
            if (err) {
                next(err);
            } else {
                res.json(teams);
            }
        });
    });

    router.get('/team/image', async (req, res, next) => {
        // Adding this condition because UglifyJS can't handle ES2015, only needed for the server
        if (env === 'development') {
            console.log('Get a team member image');
            console.log(req.query);
        }

        // Return an empty array in case no id was passed or no params
        if (!req.params || !Object.keys(req.query).length) { res.json({ item: null }); } else {
            const name = req.query.name.toLowerCase().replace(/[- ]/g, '_') + '.jpg';
            gfs.exist({ filename: name }, (err, hasFile) => {
                if (env === 'development') {
                    console.log('The team file exists');
                    console.log(hasFile);
                }
                if (hasFile) {
                    const stream = gfs.createReadStream(name);
                    stream.pipe(res);
                } else {
                    res.status(204).send('Could not find member!');
                }
            });
        }
    });

    // Get all the tissues
    router.get('/tissues', (req, res, next) => {
        // Adding this condition because UglifyJS can't handle ES2015, only needed for the server
        if (env === 'development') {
            console.log('Get all tissues');
            console.log(allTissues);
        }

        // Return an empty array in case we don't have tissues
        if (!allTissues.length) { res.json({ items: [] }); } else {
            res.json({ items: allTissues });
        }
    });

    // Get all the gene tissues
    router.get('/tissues/gene', (req, res, next) => {
        // Adding this condition because UglifyJS can't handle ES2015, only needed for the server
        if (env === 'development') {
            console.log('Get gene tissues');
            console.log(geneTissues);
        }

        // Return an empty array in case we don't have tissues
        if (!geneTissues.length) { res.json({ items: [] }); } else {
            res.json({ items: geneTissues });
        }
    });

    // Get all the models
    router.get('/models', (req, res, next) => {
        // Adding this condition because UglifyJS can't handle ES2015, only needed for the server
        if (env === 'development') {
            console.log('Get all models');
            console.log(allModels);
        }

        // Return an empty array in case we don't have models
        if (!allModels.length) { res.json({ items: [] }); } else {
            res.json({ items: allModels });
        }
    });

    // Get all the models
    router.get('/models/gene', (req, res, next) => {
        // Adding this condition because UglifyJS can't handle ES2015, only needed for the server
        if (env === 'development') {
            console.log('Get gene models');
            console.log(geneModels);
        }

        // Return an empty array in case we don't have models
        if (!geneModels.length) { res.json({ items: [] }); } else {
            res.json({ items: geneModels });
        }
    });
});

export default router;
