import { DecimalPipe } from '@angular/common';
import { Gene, GeneInfo, Proteomics } from '../../app/models';
import { Genes, GenesInfo, GenesLinks, TeamsInfo, GenesProteomics } from '../../app/schemas';

import * as express from 'express';
import * as mongoose from 'mongoose';
import * as Grid from 'gridfs';
import * as awsParamStore from 'aws-param-store';
import * as crossfilter from 'crossfilter2';

const router = express.Router();
const database = { url: '' };
const env = (process.env.mode || process.env.NODE_ENV || process.env.ENV || 'development');

// Uncomment when in need of versbose debugging
// if (env === 'development') {
//     mongoose.set('debug', true);
// }

// Set the database url
if (process.env.MONGODB_HOST && process.env.MONGODB_PORT && process.env.APP_ENV) {
    const results = awsParamStore.getParametersSync(
        [
            '/agora-' + process.env.APP_ENV + '/MongodbUsername',
            '/agora-' + process.env.APP_ENV + '/MongodbPassword'
        ], { region: 'us-east-1' }
    );

    database.url = 'mongodb://' + results.Parameters[1]['Value'] + ':'
        + results.Parameters[0]['Value']
        + '@' + process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT + '/agora'
        + '?authSource=admin';
} else {
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
    let allGenes: Gene[] = [];
    const genesADDMF: Gene[] = [];
    const genesADDAODMF: Gene[] = [];
    const genesADDSF: Gene[] = [];
    const genesADDSM: Gene[] = [];
    let geneProteomics: Proteomics[] = [];
    let totalRecords = 0;
    const allTissues: string[] = [];
    const allModels: string[] = [];
    const decimalPipe: DecimalPipe = new DecimalPipe('en-US');

    // Crossfilter instance
    const chartInfos: Map<string, any> = new Map<string, any>();
    const pChartInfos: Map<string, any> = new Map<string, any>();
    // To be used by the DecimalPipe from Angular. This means
    // a minimum of 1 digit will be shown before decimal point,
    // at least, but not more than, 2 digits after decimal point
    const significantDigits: string = '1.2-2';
    // This is a second configuration used because the adjusted
    // p-val goes up to 4 significant digits. It is used to compare
    // the log fold change with adjusted p-val for chart rendering
    // methods
    const compSignificantDigits: string = '1.2-4';

    // Group by id and sort by hgnc_symbol
    Genes.aggregate(
        [
            {
                $sort: {
                    hgnc_symbol: 1,
                    model: 1,
                    tissue: 1
                }
            },
            {
                $group: {
                    _id: '$_id',
                    hgnc_symbol: { $first: '$hgnc_symbol' },
                    ensembl_gene_id: { $first: '$ensembl_gene_id' },
                    logfc: { $first: '$logfc' },
                    fc: { $first: '$fc' },
                    ci_l: { $first: '$ci_l' },
                    ci_r: { $first: '$ci_r' },
                    adj_p_val: { $first: '$adj_p_val' },
                    tissue: { $first: '$tissue' },
                    study: { $first: '$study' },
                    model: { $first: '$model' }
                }
            }
        ]
    ).allowDiskUse(true).exec().then(async (genes) => {
        // All the genes, ordered by hgnc_symbol
        allGenes = genes.slice();

        await allGenes.forEach((g) => {
            // Separate the columns we need
            g.logfc = getSignificantValue(+g.logfc, true);
            g.fc = getSignificantValue(+g.fc, true);
            g.adj_p_val = getSignificantValue(+g.adj_p_val, true);
            g.hgnc_symbol = g.hgnc_symbol;
            g.model = g.model;
            g.study = g.study;
            g.tissue = g.tissue;

            if (allTissues.indexOf(g['tissue']) === -1) {
                allTissues.push(g['tissue']);
            }
            if (allModels.indexOf(g['model']) === -1) {
                allModels.push(g['model']);
            }

            switch (g.model) {
                case 'AD Diagnosis (males and females)':
                    genesADDMF.push(g);
                    break;
                case 'AD Diagnosis x AOD (males and females)':
                    genesADDAODMF.push(g);
                    break;
                case 'AD Diagnosis x Sex (females only)':
                    genesADDSF.push(g);
                    break;
                case 'AD Diagnosis x Sex (males only)':
                    genesADDSM.push(g);
                    break;
                default:
                    break;
            }
        });
        await allTissues.sort();
        await allModels.sort();

        //////////////////////////////////////////////////////////////////////////////////////////
    });

    GenesInfo.find({ nominations: { $gt: 0 } })
        .sort({ hgnc_symbol: 1, tissue: 1, model: 1 })
        .exec(async (err, genes: GeneInfo[], next) => {
        if (err) {
            next(err);
        } else {
            tableGenesById = genes.slice();
            // Table genes ordered by nominations
            tableGenesByNom = await genes.slice().sort((a, b) => {
                return (a.nominations > b.nominations) ? 1 :
                    ((b.nominations > a.nominations) ? -1 : 0);
            });

            totalRecords = tableGenesById.length;
        }
    });

    GenesProteomics.find({}).lean().exec(async (err, genes: Proteomics[], next) => {
        if (err) {
            next(err);
        } else {
            if (genes.length) {
                geneProteomics = genes.slice();
                await geneProteomics.forEach((g) => {
                    // Separate the columns we need
                    g.uniqid = g.uniqid;
                    g.uniprotid = g.uniprotid;
                    g.log2fc = (g.log2fc) ? +g.log2fc : 0;
                    g.hgnc_symbol = g.hgnc_symbol;
                    g.pval = (g.pval) ? +g.pval : 0;
                    g.tissue = g.tissue;
                });
            }
        }
    });

    /* GET genes listing. */
    router.get('/', (req, res) => {
        res.send({ title: 'Genes API Entry Point' });
    });

    router.get('/refreshp', async (req, res) => {
        const results = {};
        const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
        const id = req.query.id;

        loadChartData(filter).then(async (status) => {
            let indx: any = null;
            indx = await crossfilter(geneProteomics.slice());

            // Crossfilter variables
            const dimensions = {
                spDim: null,
                bpDim: null
            };
            const groups = {
                spGroup: null,
                bpGroup: null
            };

            // Load all dimensions and groups
            const genePTissues: string[] = [];
            await GenesProteomics.find({
                $and: [
                    {
                        hgnc_symbol: id
                    },
                    {
                        log2fc: { $ne: null }
                    }
                ]
            }).lean().exec(async (err, genes: Proteomics[], next) => {
                if (err) {
                    next(err);
                } else {
                    if (genes.length) {
                        genes.forEach((p: Proteomics) => {
                            genePTissues.push(p.tissue);
                        });

                        dimensions.spDim = await indx.dimension((d) => {
                            const tissueIndex = genePTissues.indexOf(d.tissue);
                            return (d.hgnc_symbol === id && tissueIndex > -1 && d.log2fc) ?
                                d.uniprotid : null;
                        });
                        dimensions.bpDim = await indx.dimension((d) => d.tissue);

                        groups.spGroup = await dimensions.spDim.group();
                        groups.bpGroup = await dimensions.bpDim.group().reduce(
                            function(p, v) {
                                // Retrieve the data value, if not Infinity or null add it.
                                if (v.log2fc !== Infinity && v.log2fc !== null) {
                                    p.push(v.log2fc);
                                }
                                return p;
                            },
                            function(p, v) {
                                // Retrieve the data value, if not Infinity or null remove it.
                                if (v.log2fc !== Infinity && v.log2fc !== null) {
                                    p.splice(p.indexOf(v.log2fc), 1);
                                }
                                return p;
                            },
                            function() {
                                return [];
                            }
                        );

                        if (Object.keys(groups).length > 0) {
                            const rPromise = new Promise((resolve, reject) => {
                                Object.keys(dimensions).forEach(async (dimension) => {
                                    const groupName = dimension.substring(0, 2) + 'Group';
                                    if (dimension !== 'bpDim') {
                                        results[groupName] = {
                                            values: rmEmptyBinsDefault(groups[groupName]).all(),
                                            top: groups[groupName].top(1)[0].value
                                        };
                                    } else {
                                        results[groupName] = {
                                            values: groups[groupName].all(),
                                            top: groups[groupName].top(1)[0].value
                                        };
                                    }
                                });

                                resolve(results);
                            });
                            rPromise.then((r: any) => {
                                if (r) {
                                    indx = null;

                                    res.send(r);
                                }
                            });
                        }
                    }
                }
            });
        });
    });

    router.get('/refresh', async (req, res, next) => {
        const results = {};
        const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
        const id = req.query.id;

        loadChartData(filter).then(async (status) => {
            let indx: any = null;

            switch (filter) {
                case 'AD Diagnosis (males and females)':
                    indx = await crossfilter(genesADDMF.slice());
                    break;
                case 'AD Diagnosis x AOD (males and females)':
                    indx = await crossfilter(genesADDAODMF.slice());
                    break;
                case 'AD Diagnosis x Sex (females only)':
                    indx = await crossfilter(genesADDSF.slice());
                    break;
                case 'AD Diagnosis x Sex (males only)':
                    indx = await crossfilter(genesADDSM.slice());
                    break;
                default:
                    indx = await crossfilter(allGenes.slice());
                    break;
            }

            // Crossfilter variables
            const dimensions = {
                smDim: null,
                bpDim: null,
                fpDim: null
            };
            const groups = {
                smGroup: null,
                bpGroup: null,
                fpGroup: null
            };

            // Load all dimensions and groups
            dimensions.smDim = await indx.dimension((d) => d.model);
            dimensions.bpDim = await indx.dimension((d) => d.tissue);
            dimensions.fpDim = await getDimension(getChartInfo('forest-plot'), indx);

            groups.smGroup = await dimensions.smDim.group();
            groups.bpGroup = await dimensions.bpDim.group().reduce(
                function(p, v) {
                    // Retrieve the data value, if not Infinity or null add it.
                    const dv = Math.log2(v.fc);
                    if (dv !== Infinity && dv !== null) {
                        p.push(dv);
                    }
                    return p;
                },
                function(p, v) {
                    // Retrieve the data value, if not Infinity or null remove it.
                    const dv = Math.log2(v.fc);
                    if (dv !== Infinity && dv !== null) {
                        p.splice(p.indexOf(dv), 1);
                    }
                    return p;
                },
                function() {
                    return [];
                }
            );
            groups.fpGroup = await getGroup(getChartInfo('forest-plot'));

            if (Object.keys(groups).length > 0) {
                const rPromise = new Promise((resolve, reject) => {
                    Object.keys(dimensions).forEach(async (dimension) => {
                        const groupName = dimension.substring(0, 2) + 'Group';
                        if (dimension !== 'fpDim') {
                            results[groupName] = {
                                values: groups[groupName].all(),
                                top: (groupName === 'fpGroup') ?
                                    null :
                                    groups[groupName].top(1)[0].value
                            };
                        } else {
                            const newGroup = await rmEmptyBinsFP(groups.fpGroup, (filter) ?
                                filter :
                                'AD Diagnosis (males and females)', id);
                            results[groupName] = {
                                values: newGroup.all()
                            };
                        }
                    });

                    resolve(results);
                });
                rPromise.then((r: any) => {
                    if (r) {
                        indx = null;

                        res.send(r);
                    }
                });
            }
        });
    });

    // Routes to get genes information
    router.get('/genes', async (req, res, next) => {
        // Adding this condition because UglifyJS can't handle ES2015, only needed for the server
        if (env === 'development') {
            console.log('Get all chart genes and current gene entries');
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

            // Find all the Genes with the current id
            await Genes.find(queryObj).sort({ hgnc_symbol: 1, tissue: 1, model: 1 })
                .exec(async (err, genes) => {
                if (err) {
                    next(err);
                } else {
                    if (!genes.length) {
                        res.json({items: genes});
                    } else {
                        const geneEntries = genes.slice();
                        const geneTissues = [];
                        const geneModels = [];

                        let minFC: number = +Infinity;
                        let maxFC: number = -Infinity;
                        let minLogFC: number = +Infinity;
                        let maxLogFC: number = -Infinity;
                        let maxAdjPValue: number = -Infinity;
                        let minAdjPValue: number = Infinity;
                        geneTissues.length = 0;
                        geneModels.length = 0;
                        await genes.forEach((g) => {
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
                            if (g.tissue && geneTissues.indexOf(g.tissue) === -1) {
                                geneTissues.push(g.tissue);
                            }
                            if (g.model && geneModels.indexOf(g.model) === -1) {
                                geneModels.push(g.model);
                            }
                        });
                        await geneTissues.sort();
                        await geneModels.sort();

                        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                        res.setHeader('Pragma', 'no-cache');
                        res.setHeader('Expires', 0);
                        await res.json({
                            geneEntries,
                            minFC: (Math.abs(maxFC) > Math.abs(minFC)) ? -maxFC : minFC,
                            maxFC,
                            minLogFC: (Math.abs(maxLogFC) > Math.abs(minLogFC)) ?
                                -maxLogFC : minLogFC,
                            maxLogFC,
                            minAdjPValue,
                            maxAdjPValue,
                            geneModels,
                            geneTissues,
                            geneProteomics
                        });
                    }
                }
            });
        }
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
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', 0);
        res.json({ items: genes.slice(skip, skip + limit), totalRecords });
    });

    // Use mongoose to get all pages for the table
    router.get('/genes/table', (req, res) => {
        // Adding this condition because UglifyJS can't handle ES2015, only needed for the server
        if (env === 'development') {
            console.log('Get a page of genes');
            console.log(req.query);
        }

        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', 0);
        res.json({ items: tableGenesById, totalRecords: tableGenesById.length });
    });

    // Get all gene infos that match an id, using the hgnc_symbol or ensembl id
    router.get('/gene/infos/:id', (req, res, next) => {
        // Adding this condition because UglifyJS can't handle ES2015, only needed for the server
        if (env === 'development') {
            console.log('Get the genes that match an id');
            console.log(req.params.id);
        }

        const fieldName = (req.params.id.startsWith('ENSG')) ? 'ensembl_gene_id' : 'hgnc_symbol';
        const isEnsembl = (req.params.id.startsWith('ENSG')) ? true : false;
        const queryObj = { $or: [
            {
                [fieldName]: { $regex: req.params.id.trim(), $options: 'i' }
            },
            {
                alias: new RegExp('^' + req.params.id.trim() + '$', 'i')
            }
        ]};

        // Return an empty array in case no id was passed or no params
        if (!req.params || !req.params.id) {
            res.status(404).send('Not found');
        } else {
            GenesInfo.find(queryObj).exec(
                (err, geneInfos) => {
                    if (err) {
                        next(err);
                    } else {
                        if (geneInfos.length === 0) {
                            res.json({ items: [], isEnsembl });
                        } else {
                            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                            res.setHeader('Pragma', 'no-cache');
                            res.setHeader('Expires', 0);
                            res.json({ items: geneInfos, isEnsembl });
                        }
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
        if (!req.query || !req.query.ids) {
            res.json({ items: [] });
        } else {
            const ids = req.query.ids.split(',');

            GenesInfo.find({ ensembl_gene_id: { $in: ids } }).exec(
                (err, geneInfos) => {
                    if (err) {
                        next(err);
                    } else {
                        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                        res.setHeader('Pragma', 'no-cache');
                        res.setHeader('Expires', 0);
                        res.json({ items: geneInfos });
                    }
                });
        }
    });

    // Get a gene by id, can be hgnc_symbol or ensembl_gene_id
    router.get('/gene', async (req, res, next) => {
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
            res.status(404).send('Not found');
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
            await Genes.findOne(queryObj).exec(async (err, gene) => {
                if (err) {
                    next(err);
                } else {
                    const item = gene;

                    await GenesInfo.findOne({ [fieldName]: req.query.id }).exec(
                        async (errB, info) => {
                        if (errB) {
                            next(errB);
                        } else {
                            // Adding this condition because UglifyJS can't handle ES2015,
                            // only needed for the server
                            if (env === 'development') {
                                console.log('The gene info and item');
                                console.log(info);
                                console.log(item);
                            }

                            res.setHeader(
                                'Cache-Control', 'no-cache, no-store, must-revalidate'
                            );
                            res.setHeader('Pragma', 'no-cache');
                            res.setHeader('Expires', 0);
                            await res.json({
                                info,
                                item
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
            GenesLinks.find({ geneA_ensembl_gene_id: req.params.id }).exec(async (err, links) => {
                const arrA = await links.slice().map((slink) => {
                    return slink.toJSON()['geneB_ensembl_gene_id'];
                });

                GenesLinks.find({ geneB_ensembl_gene_id: req.params.id }, async (errB, linkB) => {
                    const arrB = await linkB.slice().map((slink) => {
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
                                res.setHeader(
                                    'Cache-Control', 'no-cache, no-store, must-revalidate'
                                );
                                res.setHeader('Pragma', 'no-cache');
                                res.setHeader('Expires', 0);
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

            TeamsInfo.find({ team: { $in: arr } }).exec((err, teams) => {
                if (err) {
                    next(err);
                } else {
                    teams.sort((a, b) => {
                        const aTeamFull: string = (a.team_full) ? a.team_full.toLowerCase() : '';
                        const bTeamFull: string = (b.team_full) ? b.team_full.toLowerCase() : '';
                        return aTeamFull.toLowerCase() < bTeamFull.toLowerCase() ? -1 : 1;
                    });

                    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                    res.setHeader('Pragma', 'no-cache');
                    res.setHeader('Expires', 0);
                    res.json(teams);
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
                teams.sort((a, b) => {
                    const aProgram: string = (a.program) ? a.program.toLowerCase() : '';
                    const aTeamFull: string = (a.team_full) ? a.team_full.toLowerCase() : '';
                    const bProgram: string = (b.program) ? b.program.toLowerCase() : '';
                    const bTeamFull: string = (b.team_full) ? b.team_full.toLowerCase() : '';
                    return aProgram.toLowerCase() + aTeamFull.toLowerCase() <
                        bProgram.toLowerCase() + bTeamFull.toLowerCase() ? -1 : 1;
                });

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
                if (hasFile) {
                    if (env === 'development') {
                        console.log('The team file exists jpg');
                        console.log(name);
                        console.log(hasFile);
                    }
                    const stream = gfs.createReadStream(name);
                    stream.pipe(res);
                } else {
                    if (env === 'development') {
                        console.log('The team file isnt jpg');
                    }
                    const NAMEJPEG = req.query.name.toLowerCase().replace(/[- ]/g, '_') + '.jpeg';
                    gfs.exist({ filename: NAMEJPEG }, (err2, hasFile2) => {
                        if (hasFile2) {
                            if (env === 'development') {
                                console.log('The team file exists jpeg');
                                console.log(NAMEJPEG);
                                console.log(hasFile);
                            }
                            const stream = gfs.createReadStream(NAMEJPEG);
                            stream.pipe(res);
                        } else {
                            if (env === 'development') {
                                console.log('The team file isnt jpeg');
                            }
                            const namePNG = req.query.name
                            .toLowerCase().replace(/[- ]/g, '_') + '.png';
                            gfs.exist({ filename: namePNG }, (err3, hasFile3) => {
                                if (hasFile3) {
                                    if (env === 'development') {
                                        console.log('The team file exists png');
                                        console.log(namePNG);
                                        console.log(hasFile);
                                    }
                                    const stream = gfs.createReadStream(namePNG);
                                    stream.pipe(res);
                                } else {
                                    if (env === 'development') {
                                        console.log('The team file isnt png');
                                    }
                                    res.status(204).send('Could not find member!');
                                }
                            });
                        }
                    });
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
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', 0);
            res.json({ items: allTissues });
        }
    });

    // Get all the gene tissues
    router.get('/tissues/gene', async (req, res, next) => {
        // Adding this condition because UglifyJS can't handle ES2015, only needed for the server
        if (env === 'development') {
            console.log('Get gene tissues with an id');
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

            // Find all the Genes with the current id
            await Genes.find(queryObj).sort({ hgnc_symbol: 1, tissue: 1, model: 1 })
                .exec(async (err, genes) => {
                if (err) {
                    next(err);
                } else {
                    if (!genes.length) {
                        res.status(404).send('No genes found!');
                    } else {
                        const geneTissues = await genes.slice().map((gene) => {
                            return gene.tissue;
                        });
                        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                        res.setHeader('Pragma', 'no-cache');
                        res.setHeader('Expires', 0);
                        res.json({ items: geneTissues });
                    }
                }
            });
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
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', 0);
            res.json({ items: allModels });
        }
    });

    // Get all the models
    router.get('/models/gene', async (req, res, next) => {
        // Adding this condition because UglifyJS can't handle ES2015, only needed for the server
        if (env === 'development') {
            console.log('Get gene tissues with an id');
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

            // Find all the Genes with the current id
            await Genes.find(queryObj).sort({ hgnc_symbol: 1, tissue: 1, model: 1 })
                .exec(async (err, genes) => {
                if (err) {
                    next(err);
                } else {
                    if (!genes.length) {
                        res.status(404).send('No genes found!');
                    } else {
                        const geneModels = await genes.slice().map((gene) => {
                            return gene.model;
                        });
                        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                        res.setHeader('Pragma', 'no-cache');
                        res.setHeader('Expires', 0);
                        res.json({ items: geneModels });
                    }
                }
            });
        }
    });

    // Get all genes using an id
    router.get('/genes/same', async (req, res, next) => {
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
            await Genes.find(queryObj).exec(async (err, genes) => {
                if (err) {
                    next(err);
                } else {
                    // Adding this condition because UglifyJS can't handle ES2015,
                    // only needed for the server
                    if (env === 'development') {
                        console.log('The genes with id');
                        console.log(genes);
                    }

                    res.setHeader(
                        'Cache-Control', 'no-cache, no-store, must-revalidate'
                    );
                    res.setHeader('Pragma', 'no-cache');
                    res.setHeader('Expires', 0);
                    await res.json({
                        geneEntries: genes
                    });
                }
            });
        }
    });

    function getSignificantDigits(compare?: boolean): string {
        return ((compare) ? compSignificantDigits : significantDigits) || '1.2-2';
    }

    function getSignificantValue(value: number, compare?: boolean): number {
        return +decimalPipe.transform(value, getSignificantDigits(compare));
    }

    function addChartInfo(label: string, chartObj: any, type: string = 'RNA') {
        let localChartInfos: Map<string, any> = null;
        if (type === 'RNA') {
            localChartInfos = chartInfos;
        } else if (type === 'Proteomics') {
            localChartInfos = pChartInfos;
        }

        if (chartInfos) {
            if (label && !localChartInfos.has(label)) { localChartInfos.set(label, chartObj); }
        }
    }

    function getChartInfo(label: string): any {
        return chartInfos.get(label);
    }

    function loadChartData(model: string): Promise<any> {
        return new Promise((resolve, reject) => {
            addChartInfo(
                'volcano-plot',
                {
                    dimension: ['logfc', 'adj_p_val', 'hgnc_symbol'],
                    group: 'self',
                    type: 'scatter-plot',
                    title: 'Volcano Plot',
                    xAxisLabel: 'Log Fold Change',
                    yAxisLabel: '-log10(Adjusted p-value)',
                    x: ['logfc'],
                    y: ['adj_p_val']
                }
            );
            addChartInfo(
                'forest-plot',
                {
                    dimension: ['tissue'],
                    group: 'self',
                    type: 'forest-plot',
                    title: 'Log fold forest plot',
                    filter: 'default',
                    attr: 'logfc'
                }
            );
            addChartInfo(
                'select-model',
                {
                    dimension: ['model'],
                    group: 'self',
                    type: 'select-menu',
                    title: '',
                    filter: 'default'
                }
            );
            addChartInfo(
                'select-protein',
                {
                    dimension: ['uniprotid'],
                    group: 'self',
                    type: 'select-menu',
                    title: '',
                    filter: 'default'
                },
                'Proteomics'
            );

            resolve(true);
        });
    }

    // Charts crossfilter handling part
    function getDimension(info: any, ndx: any): crossfilter.Dimension<any, any> {
        const dimValue = info.dimension;

        const dim = ndx.dimension((d) => {
            switch (info.type) {
                case 'forest-plot':
                    // The key returned
                    return [d[dimValue[0]], d.hgnc_symbol, d.model];
                case 'scatter-plot':
                    const x = Number.isNaN(+d[dimValue[0]]) ? 0 : +d[dimValue[0]];
                    const y = Number.isNaN(+d[dimValue[1]]) ? 0 : +d[dimValue[1]];

                    return [x, y, d[dimValue[2]]];
                case 'box-plot':
                    return 1;
                case 'select-menu':
                    return d[dimValue[0]];
                default:
                    return [
                        Number.isNaN(+d[dimValue[0]]) ? 0 : +d[dimValue[0]],
                        Number.isNaN(+d[dimValue[1]]) ? 0 : +d[dimValue[1]]
                    ];
            }
        });

        info.dim = dim;
        return info.dim;
    }

    function getGroup(info: any, auxDim?: any): crossfilter.Group<any, any, any> {
        let group = (auxDim) ? auxDim.group() : info.dim.group();

        // If we want to reduce based on certain parameters
        if (info.attr || info.format) {
            group.reduce(
                // callback for when data is added to the current filter results
                reduceAdd(
                    info.attr,
                    (info.format) ? info.format : null,
                    (info.constraints) ? info.constraints : null
                ),
                reduceRemove(
                    info.attr,
                    (info.format) ? info.format : null,
                    (info.constraints) ? info.constraints : null
                ),
                (info.format) ? reduceInitial : reduceInit
            );
        }

        if (info.filter) {
            group = rmEmptyBinsDefault(group);
        }
        info.g = group;
        return info.g;
    }

    // Reduce functions for constraint charts
    function reduceAdd(attr: string, format?: string, constraints?: any[]) {
        return (p, v) => {
            let val = +v[attr];

            if (format && format === 'array') {
                if (val !== 0 && constraints[0].name === v[constraints[0].attr]) {
                    val = (attr === 'fc') ? Math.log2(val) : Math.log10(val);
                    if (!Number.isNaN(val)) { p.push(val); }
                }
                return p;
            } else {
                p[attr] += val;
            }
            ++p.count;
            return p;
        };
    }

    function reduceRemove(attr: string, format?: string, constraints?: any[]) {
        return (p, v) => {
            let val = +v[attr];

            if (format && format === 'array') {
                if (val !== 0 && constraints[0].name === v[constraints[0].attr]) {
                    val = (attr === 'fc') ? Math.log2(val) : Math.log10(val);
                    if (!Number.isNaN(val)) { p.splice(p.indexOf(val), 1); }
                }
                return p;
            } else {
                p[attr] -= val;
            }
            --p.count;
            return p;
        };
    }

    function reduceInit(): any {
        return {count: 0, sum: 0, logfc: 0, fc: 0, adj_p_val: 0};
    }

    // Box-plot uses a different function name in dc.js
    function reduceInitial(): any[] {
        return [];
    }

    const rmEmptyBinsDefault = (sourceGroup): any => {
        return {
            all: () => {
                return sourceGroup.all().filter(function(d) {
                    // Add your filter condition here
                    return d.key !== null && d.key !== '';
                });
            }
        };
    };

    const rmEmptyBinsFP = async (sourceGroup: any, filter: any, id: string) => {
        return {
            all: () => {
                return sourceGroup.all().filter(function(d) {
                    // Add your filter condition here
                    return d.key[2] === filter && d.key[1] === id && d.value.logfc !== 0;
                });
            }
        };
    };
});

export default router;
