import {
    Gene,
    GeneInfo,
    Proteomics,
    NeuropathCorr,
    GeneExpValidation,
    GeneScoreDistribution,
    GeneOverallScores, TeamInfo,
} from '../../app/models';
import {
    Genes,
    GenesInfo,
    GenesLinks,
    TeamsInfo,
    GenesProteomics,
    GenesMetabolomics,
    NeuropathCorrs,
    GenesExperimentalValidation,
    GenesScoreDistribution,
    GenesOverallScores,
    RnaDistribution
} from '../../app/schemas';

import * as express from 'express';
import * as mongoose from 'mongoose';
import * as Grid from 'gridfs';
import * as awsParamStore from 'aws-param-store';
import * as crossfilter from 'crossfilter2';
// required when verbose debugging is enabled
import * as util from 'util';

const router = express.Router();
const database = { url: '' };
const env = (process.env.mode || process.env.NODE_ENV || process.env.ENV || 'development');

// Uncomment when in need of verbose debugging
/* mongoose.set('debug', function(coll, method, query, doc) {
    console.log(
        '\n\n',
        ' => Query executed: ',
        '\ncollection => ' + coll,
        '\nmethod => ' + method,
        '\ndata => ' + util.inspect(query),
        '\n',
        doc && ('doc => ' + util.inspect(doc)), '\n');
}); */

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

connection.once('open', async () => {
    const gfs = Grid(connection.db);

    // Preprocess the data when the server goes up

    // Get the genes collection size
    let tableGenesById: GeneInfo[] = [];
    let allGenes: Gene[] = [];
    let allGeneInfo: GeneInfo[] = [];
    let allTeams: TeamInfo[] = [];
    const genesADDMF: Gene[] = [];
    const genesADDAODMF: Gene[] = [];
    const genesADDSF: Gene[] = [];
    const genesADDSM: Gene[] = [];
    let geneProteomics: Proteomics[] = [];
    let genesNeuroCorr: NeuropathCorr[] = [];
    let genesExpValidation: GeneExpValidation[] = [];
    let geneScoreDistribution: GeneScoreDistribution[] = [];
    let genesOverallScores: GeneOverallScores[] = [];
    let comparisonGenes: {} = {};
    let totalRecords = 0;

    // Crossfilter instance
    const chartInfos: Map<string, any> = new Map<string, any>();
    const pChartInfos: Map<string, any> = new Map<string, any>();

    // Select fields for Nominated Targets table db queries
    const tableGenesByIdFields = [
        'hgnc_symbol',
        'ensembl_gene_id',
        'nominations',
        'nominatedtarget.initial_nomination',
        'nominatedtarget.team',
        'nominatedtarget.study',
        'nominatedtarget.input_data',
        'nominatedtarget.validation_study_details',
        'druggability.pharos_class',
        'druggability.sm_druggability_bucket',
        'druggability.classification',
        'druggability.safety_bucket',
        'druggability.safety_bucket_definition',
        'druggability.abability_bucket',
        'druggability.abability_bucket_definition'
    ].join(' ');

    // Select fields for Similar Genes table db queries
    const tableSimilarGenesFields = [
        'hgnc_symbol',
        'ensembl_gene_id',
        'nominations',
        'medianexpression',
        'isIGAP',
        'haseqtl',
        'isAnyRNAChangedInADBrain',
        'isAnyProteinChangedInADBrain',
        'rna_brain_change_studied',
        'protein_brain_change_studied',
        'druggability.pharos_class',
        'druggability.sm_druggability_bucket',
        'druggability.classification',
        'druggability.safety_bucket',
        'druggability.safety_bucket_definition',
        'druggability.abability_bucket',
        'druggability.abability_bucket_definition'
    ].join(' ');

    // initialize data caches

    await GenesInfo.find().lean().exec(async (err, data: GeneInfo[], next) => {
        if (err) {
            next(err);
        } else {
            allGeneInfo = data;
        }
    });

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
        const geneInfos = new Map(allGeneInfo.map(g => [g.ensembl_gene_id, g]));
        const _comparisonGenes = {};

        await allGenes.forEach((g) => {
            const geneInfo = geneInfos.get(g.ensembl_gene_id);
            // Separate the columns we need
            g.logfc = getSignificantFigures(+g.logfc);
            g.fc = getSignificantFigures(+g.fc);
            g.adj_p_val = getSignificantFigures(+g.adj_p_val);

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

            if (!_comparisonGenes.hasOwnProperty(g.model)) {
                _comparisonGenes[g.model] = {};
            }

            if (!_comparisonGenes[g.model].hasOwnProperty(g.ensembl_gene_id)) {
                const comparisonGene = {
                    ensembl_gene_id         : g.ensembl_gene_id,
                    hgnc_symbol             : g.hgnc_symbol,
                    search_string           : '',
                    nominations             : 0,
                    teams                   : [],
                    studies                 : [],
                    input_datas             : [],
                    year_first_nominated    : null,
                    tissues                 : []
                };

                if (geneInfo) {
                    comparisonGene.hgnc_symbol = geneInfo.hgnc_symbol;
                    comparisonGene.search_string = comparisonGene.hgnc_symbol + ' ' + comparisonGene.ensembl_gene_id;
                    comparisonGene.nominations = geneInfo.nominations || 0;

                    if (geneInfo.nominatedtarget && geneInfo.nominatedtarget.length > 0) {
                        for (const nominated of geneInfo.nominatedtarget) {

                            if (nominated.team) {
                                comparisonGene.teams.push(nominated.team);
                            }

                            if (nominated.study) {
                                nominated.study.split(', ').forEach(study => {
                                    comparisonGene.studies.push(study);
                                });
                            }

                            if (nominated.input_data) {
                                nominated.input_data.split(', ').forEach(inputData => {
                                    comparisonGene.input_datas.push(inputData);
                                });
                            }

                            if (nominated.initial_nomination) {
                                if (
                                    !comparisonGene.year_first_nominated
                                    || nominated.initial_nomination < comparisonGene.year_first_nominated
                                ) {
                                    comparisonGene.year_first_nominated = nominated.initial_nomination;
                                }
                            }
                        }
                    }

                    if (geneInfo.medianexpression) {
                        for (const medianExp of geneInfo.medianexpression) {
                            const tissue = comparisonGene.tissues.find(t => t.name === medianExp.tissue);
                            if (tissue) {
                                    tissue.medianexpression = {
                                    medianlogcpm: medianExp.medianlogcpm,
                                    minimumlogcpm: medianExp.minimumlogcpm,
                                    maximumlogcpm: medianExp.maximumlogcpm
                                };
                            }
                        }
                    }
                }

                _comparisonGenes[g.model][g.ensembl_gene_id] = comparisonGene;
            }

            _comparisonGenes[g.model][g.ensembl_gene_id].tissues.push({
                name        : g.tissue,
                logfc       : g.logfc,
                adj_p_val   : g.adj_p_val,
                ci_l        : g.ci_l,
                ci_r        : g.ci_r,
            });
        });

        for (const index in _comparisonGenes) {
            if (_comparisonGenes.hasOwnProperty(index)) {
                _comparisonGenes[index] = Object.values(_comparisonGenes[index]);
            }
        }

        comparisonGenes = _comparisonGenes;
    });

    GenesInfo.find({ nominations: { $gt: 0 } }).lean()
        .select(tableGenesByIdFields)
        .sort({ nominations: -1, hgnc_symbol: 1 })
        .exec(async (err, genes: GeneInfo[], next) => {
        if (err) {
            next(err);
        } else {
            tableGenesById = genes.slice();
            totalRecords = tableGenesById.length;
        }
    });

    GenesProteomics.find({}).lean().exec(async (err, genes: Proteomics[], next) => {
        if (err) {
            next(err);
        } else {
            geneProteomics = genes.slice();
            await geneProteomics.forEach((g: Proteomics) => {
                g.log2_fc = (g.log2_fc) ? +g.log2_fc : 0;
                g.pval = (g.pval) ? +g.pval : 0;
                g.cor_pval = (g.cor_pval) ? +g.cor_pval : 0;
            });
        }
    });

    NeuropathCorrs.find().lean()
        .exec(async (err, genes: NeuropathCorr[], next) => {
            if (err) {
                next(err);
            } else {
                genesNeuroCorr = genes.slice();
            }
        }
    );

    GenesExperimentalValidation.find().lean()
        .exec(async (err, genes: GeneExpValidation[], next) => {
            if (err) {
                next(err);
            } else {
                genesExpValidation = genes.slice();
            }
        });

    GenesScoreDistribution.find().lean()
        .exec(async (err, genes: GeneScoreDistribution[], next) => {
            if (err) {
                next(err);
            } else {
                geneScoreDistribution = genes.slice();
            }
        });

    GenesOverallScores.find().lean()
        .exec(async (err, genes: GeneOverallScores[], next) => {
            if (err) {
                next(err);
            } else {
                genesOverallScores = genes.slice();
            }
        });

    TeamsInfo.find().lean()
        .exec(async (err, teams: TeamInfo[], next) => {
            if (err) {
                next(err);
            } else {
                allTeams = teams.slice();
            }
            allTeams.sort((a, b) => {
                const aProgram: string = (a.program) ? a.program.toLowerCase() : '';
                const aTeamFull: string = (a.team_full) ? a.team_full.toLowerCase() : '';
                const bProgram: string = (b.program) ? b.program.toLowerCase() : '';
                const bTeamFull: string = (b.team_full) ? b.team_full.toLowerCase() : '';
                return aProgram.toLowerCase() + aTeamFull.toLowerCase() <
                bProgram.toLowerCase() + bTeamFull.toLowerCase() ? -1 : 1;
            });
        });

    /* GET genes listing. */
    router.get('/', (req, res) => {
        res.send({ title: 'Genes API Entry Point' });
    });

    router.get('/refreshp', async (req, res, next) => {
        const results = {};
        const id = req.query.id;
        let filter = '';

        const fPromise = new Promise(async (resolve, reject) => {
            if (req.query.filter) {
                filter = JSON.parse(req.query.filter);
                resolve(true);
            } else {
                await GenesProteomics.findOne({ $and: [
                    {
                        ensembl_gene_id: id
                    },
                    {
                        uniprotid: { $ne: null }
                    }
                ]}).lean().sort('uniprotid')
                    .exec((err, gene: Proteomics) => {
                    if (err) {
                        res.send({error: 'Empty Proteomics array', items: []});
                    } else {
                        if (gene) {
                            filter = gene.uniprotid;
                            resolve(true);
                        } else {
                            res.send({error: 'Empty Proteomics array', items: []});
                        }
                    }
                });
            }
        });
        fPromise.then((filterStatus) => {
            registerCharts().then(async (status) => {
                let indx: any = null;
                const localGeneProteomics = geneProteomics.slice().filter((p: Proteomics) => {
                    return p.log2_fc && p.uniprotid === filter;
                });

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
                let genePTissues: string[] = [];
                const idGenesProteomics = localGeneProteomics.filter((p: Proteomics) => {
                    return p.ensembl_gene_id === id && p.log2_fc && p.uniprotid === filter;
                });

                if (idGenesProteomics.length) {
                    // All tissues for one uniprotid
                    idGenesProteomics.forEach((p: Proteomics) => {
                        genePTissues.push(p.tissue);
                    });
                    // Only unique tissues
                    genePTissues = genePTissues.filter((value, index, self) => {
                        return self.indexOf(value) === index;
                    });

                    // Only genes with the unique tissues
                    indx = await crossfilter(geneProteomics.slice().filter((p: Proteomics) => {
                        return genePTissues.indexOf(p.tissue) > -1;
                    }));

                    if (!indx) {
                        res.send({error: 'Empty Crossfilter'});
                    }

                    dimensions.spDim = await indx.dimension((d) => {
                        return (d.ensembl_gene_id === id) ? d.uniprotid : null;
                    });

                    // Filter is the uniprotid
                    dimensions.bpDim = await indx.dimension((d) => {
                        return (genePTissues.indexOf(d.tissue) > -1) ? d.tissue : null;
                    });

                    groups.spGroup = await dimensions.spDim.group();
                    groups.bpGroup = await dimensions.bpDim.group().reduce(
                        function(p, v) {
                            // Retrieve the data value, if not Infinity or null add it.
                            if (v.log2_fc !== Infinity && v.log2_fc) {
                                p.push(v.log2_fc);
                            }
                            return p;
                        },
                        function(p, v) {
                            // Retrieve the data value, if not Infinity or null remove it.
                            if (v.log2_fc !== Infinity && v.log2_fc) {
                                p.splice(p.indexOf(v.log2_fc), 1);
                            }
                            return p;
                        },
                        function() {
                            return [];
                        }
                    );

                    if (Object.keys(groups).length > 0) {
                        const rPromise = new Promise((resolve, reject) => {
                            Object.keys(dimensions).forEach((dimension) => {
                                const groupName = dimension.substring(0, 2) + 'Group';
                                if (dimension !== 'bpDim') {
                                    results[groupName] = {
                                        values: rmEmptyBinsDefault(groups[groupName]).all().
                                            filter(
                                                (obj, pos, arr) => {
                                                    return arr.map((mapObj) => mapObj['key']).
                                                        indexOf(obj['key']) === pos;
                                                }
                                            ),
                                        top: groups[groupName].top(1)[0]?.value
                                    };
                                } else {
                                    results[groupName] = {
                                        values: groups[groupName].all(),
                                        top: groups[groupName].top(1)[0]?.value
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
                } else {
                    res.send({error: 'Empty Proteomics array', items: geneProteomics});
                }
            });
        });
    });

    router.get('/refresh', async (req, res, next) => {
        const results = {};
        const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
        const id = req.query.id;

        registerCharts().then(async (status) => {
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
                    // Retrieve the data value, if not Infinity or null add it
                    if (v.logfc !== Infinity && v.logfc !== null) {
                        p.push(v.logfc);
                    }
                    return p;
                },
                function(p, v) {
                    // Retrieve the data value, if not Infinity or null remove it
                    if (v.logfc !== Infinity && v.logfc !== null) {
                        p.splice(p.indexOf(v.logfc), 1);
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
                    Object.keys(dimensions).forEach((dimension) => {
                        const groupName = dimension.substring(0, 2) + 'Group';
                        if (dimension !== 'fpDim') {
                            results[groupName] = {
                                values: groups[groupName].all(),
                                top: (groupName === 'fpGroup') ?
                                    null :
                                    groups[groupName].top(1)[0]?.value
                            };
                        } else {
                            const newGroup = rmEmptyBinsFP(
                                groups.fpGroup,
                                (filter) ? filter : 'AD Diagnosis (males and females)',
                                id
                            );
                            results[groupName] = {
                                values: newGroup.all()
                            };
                        }
                    });

                    results['cpGroup'] = getGeneCorrelationData(id);
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
        // Return an empty array in case no id was passed or no params
        if (!req.params || !Object.keys(req.query).length) {
            res.json({ item: null });
        } else {
            // Find all the Genes with the current id
            await Genes
                .find({ ensembl_gene_id: req.query.id }).lean()
                .sort({ hgnc_symbol: 1, tissue: 1, model: 1 })
                .exec(async (err, genes) => {
                if (err) {
                    next(err);
                    } else {
                        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                        res.setHeader('Pragma', 'no-cache');
                        res.setHeader('Expires', 0);
                        await res.json({
                            genes,
                            geneProteomics: geneProteomics.filter(p =>
                                p.ensembl_gene_id === req.query.id
                            )
                        });
                    }
            });
        }
    });

    // Get the cached list of genes for comparison tool
    router.get('/genes/comparison', async (req, res, next) => {
        const model = req.query.model || 'AD Diagnosis (males and females)';
        let genes = [];

        if (comparisonGenes.hasOwnProperty(model)) {
            genes = comparisonGenes[model];
        }

        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', 0);
        res.json({ items: genes });
    });

    // Get the cached list of nominated targets to populate the table
    router.get('/genes/table', (req, res) => {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', 0);
        res.json({ items: tableGenesById, totalRecords });
    });

    // Get all gene infos that match an id, using the hgnc_symbol or ensembl id
    router.get('/gene/infos/:id', (req, res, next) => {
        const fieldName = (req.params.id.startsWith('ENSG')) ? 'ensembl_gene_id' : 'hgnc_symbol';
        const isEnsembl = req.params.id.startsWith('ENSG');
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
            GenesInfo.find(queryObj).lean().exec(
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

    router.get('/gene/infos', (req, res, next) => {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', 0);
        res.json({ items: allGeneInfo });
    });

    // Query for all genesInfos that match an array of ENSG - used to populate the Similar Genes table
    router.get('/mgenes/infos', (req, res, next) => {
        // Return an empty array in case no id was passed or no params
        if (!req.query || !req.query.ids) {
            res.json({ items: [] });
        } else {
            const ids = req.query.ids.split(',');

            GenesInfo.find({ ensembl_gene_id: { $in: ids } }).lean()
                .sort({ hgnc_symbol: 1 }).select(tableSimilarGenesFields).exec(
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
        // Return an empty array in case no id was passed or no params
        if (!req.params || !Object.keys(req.query).length) {
            res.status(404).send('Not found');
        } else {
            const queryObj = { ensembl_gene_id: req.query.id };
            const overallScores = genesOverallScores.filter(g => g.ENSG === req.query.id)[0] || [];

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

                    await GenesInfo.findOne({ ensembl_gene_id: req.query.id }).exec(
                        async (errB, info) => {
                        if (errB) {
                            next(errB);
                        } else {
                            const validation = genesExpValidation.filter(g => g.ensembl_gene_id === req.query.id);
                            const expValidation = validation.length ? validation : undefined;

                            if (item) {
                                item.hgnc_symbol = info.hgnc_symbol || '';
                            }

                            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                            res.setHeader('Pragma', 'no-cache');
                            res.setHeader('Expires', 0);
                            await res.json({
                                info,
                                item,
                                expValidation,
                                overallScores,
                            });
                        }
                    });
                }
            });
        }
    });

    // Get the list of genes related to the gene specified by id; used for the gene-network (hairball)
    router.get('/genelist/:id', (req, res, next) => {
        // Return an empty array in case no id was passed or no params
        if (!req.params || !req.params.id) {
            res.json({items: []});
        } else {

            // identify all genes directly related to the gene of interest via network records
            GenesLinks.find({geneA_ensembl_gene_id: req.params.id}).lean()
                .exec(async (err, links) => {
                    const arrA = links.slice().map((slink) => {
                        return slink.geneB_ensembl_gene_id;
                    });

                    // identify all genes related to the related genes identified above
                    GenesLinks.find({geneB_ensembl_gene_id: req.params.id}, async (errB, linkB) => {
                        const arrB = linkB.slice().map((slink) => {
                            return slink.toJSON()['geneA_ensembl_gene_id'];
                        });
                        const arr = [...arrA, ...arrB];

                        // identify all genes related to the related genes identified above
                        await GenesLinks.find({geneA_ensembl_gene_id: {$in: arr}}).lean()
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
                                    res.json({items: flinks});
                                }
                            });
                    });
                });
        }
    });

    // Get gene scores distribution
    router.get('/genescores', (req, res, next) => {
        const noData = [];
        if (!geneScoreDistribution.length) {  // if DB has error
            console.log('geneScoreDistribution: Mongo DB return document length ', geneScoreDistribution.length);
            return res.json(noData);
        } else {
            return res.json(geneScoreDistribution[0]);
        }
    });

    // Get teams by team (short name) field
    router.get('/teams', (req, res, next) => {
        // Return an empty array in case no id was passed or no params
        if (!req.params || !Object.keys(req.query).length) {
            res.json({items: []});
        } else {
            const arr = req.query.teams.split(',');
            const teams = allTeams.filter(t => arr.includes(t.team));

            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', 0);
            res.json(teams);
        }
    });

    // Get all team infos
    router.get('/teams/all', (req, res, next) => {
        const noData = [];
        if (!allTeams.length) {
            console.log('getAllTeams: Teams cache is empty');
            return noData;
        }

        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', 0);
        res.json(allTeams);
    });

    router.get('/team/image', async (req, res, next) => {
        // Return an empty array in case no id was passed or no params
        if (!req.params || !Object.keys(req.query).length) {
            res.json({ item: null });
        } else {
            const name = req.query.name.toLowerCase().replace(/[- ]/g, '_') + '.jpg';
            gfs.exist({ filename: name }, (err, hasFile) => {
                if (hasFile) {
                    const stream = gfs.createReadStream(name);
                    stream.pipe(res);
                } else {
                    const NAMEJPEG = req.query.name.toLowerCase().replace(/[- ]/g, '_') + '.jpeg';
                    gfs.exist({ filename: NAMEJPEG }, (err2, hasFile2) => {
                        if (hasFile2) {
                            const stream = gfs.createReadStream(NAMEJPEG);
                            stream.pipe(res);
                        } else {
                            const namePNG = req.query.name
                            .toLowerCase().replace(/[- ]/g, '_') + '.png';
                            gfs.exist({ filename: namePNG }, (err3, hasFile3) => {
                                if (hasFile3) {
                                    const stream = gfs.createReadStream(namePNG);
                                    stream.pipe(res);
                                } else {
                                    res.status(204).send('Could not find member!');
                                }
                            });
                        }
                    });
                }
            });
        }
    });

    router.get('/metabolomics', async (req, res, next) => {
        // Return an empty array in case no id was passed or no params
        if (!req.params || !Object.keys(req.query).length) {
            res.json({ item: null });
        } else {
            // Find all the Genes with the current id
            await GenesMetabolomics.findOne({ ensembl_gene_id: req.query.id }).lean().exec(async (err, gene) => {
                if (err) {
                    next(err);
                } else {
                    res.setHeader(
                        'Cache-Control', 'no-cache, no-store, must-revalidate'
                    );
                    res.setHeader('Pragma', 'no-cache');
                    res.setHeader('Expires', 0);
                    await res.json({
                        geneMetabolomics: gene
                    });
                }
            });
        }
    });

    function getSignificantFigures(n: number, sig: number = 2) {
        let sign = 1;
        if (n === 0) {
            return 0;
        }
        if (n < 0) {
            n *= -1;
            sign = -1;
        }

        const mult = Math.pow(10, sig - Math.floor(Math.log(n) / Math.LN10) - 1);
        return (Math.round(n * mult) / mult) * sign;
    }

    function addChartInfo(label: string, chartObj: any, type: string = 'RNA') {
        let localChartInfos: Map<string, any> = null;
        if (type === 'RNA') {
            localChartInfos = chartInfos;
        } else if (type === 'Proteomics') {
            localChartInfos = pChartInfos;
        }

        if (chartInfos) {
            if (label && localChartInfos && !localChartInfos.has(label)) { localChartInfos.set(label, chartObj); }
        }
    }

    function getChartInfo(label: string): any {
        return chartInfos.get(label);
    }

    function registerCharts(): Promise<any> {
        return new Promise((resolve, reject) => {
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

        info.dim = ndx.dimension((d) => {
            switch (info.type) {
                case 'forest-plot':
                    // The key returned
                    return [d[dimValue[0]], d.ensembl_gene_id, d.model];
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

    const rmEmptyBinsFP = (sourceGroup: any, filter: any, id: string) => {
        return {
            all: () => {
                return sourceGroup.all().filter(function(d) {
                    // Add your filter condition here
                    return d.key[2] === filter && d.key[1] === id && d.value.logfc !== 0;
                });
            }
        };
    };

    const getGeneCorrelationData = (ensemblGeneId: string) => {
        const noData = [];
        if (!genesNeuroCorr.length) {  // if DB has error
            console.log('getGeneCorrelationData: Mongo DB return document length ', genesNeuroCorr.length);
            return noData;
        }

        if (ensemblGeneId) {
            return genesNeuroCorr.filter(obj => obj['ensg'] === ensemblGeneId);
        } else {
            console.log('getGeneCorrelationData: missing ensemblGeneId.');
        }
        return noData;
    };

    router.get('/evidence', async (req, res, next) => {
        if (!req.params || !Object.keys(req.query).length) {
            res.json({ item: null });
        } else {
            // Find all the Genes with the current id
            await Genes.find({ensembl_gene_id: req.query.id}).lean().sort({ hgnc_symbol: 1, tissue: 1, model: 1 })
                .exec(async (err, genes) => {
                if (err) {
                    next(err);
                } else {
                    if (!genes.length) {
                        res.json({items: []});
                    } else {
                        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                        res.setHeader('Pragma', 'no-cache');
                        res.setHeader('Expires', 0);
                        res.json({
                            rnaDifferentialExpression: genes,
                            rnaCorrelation: getGeneCorrelationData(req.query.id)
                        });
                    }
                }
            });
        }
    });

    router.get('/rnadistribution', async (req, res, next) => {
        await RnaDistribution.find({}).lean().exec(async (err, data) => {
            if (err) {
                next(err);
            } else {
                if (!data.length) {
                    res.json(data);
                } else {
                    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                    res.setHeader('Pragma', 'no-cache');
                    res.setHeader('Expires', 0);
                    await res.json(data);
                }
            }
        });
    });

});

export default router;
