import * as express from 'express';
import * as mongoose from 'mongoose';

import { Gene } from '../../app/models';

mongoose.set('debug', true);

const router = express.Router();
var database = { url: '' };

import { Genes } from '../../app/schemas/gene';

// Set the rdatabase
if (express().get('env') === 'development') {
    database.url = 'mongodb://localhost:27017/walloftargets'
} else {
    database.url = 'mongodb://wotadmin:2w3o5t8@ec2-34-237-52-244.compute-1.amazonaws.com:27017/walloftargets'
}

// Connect to mongoDB database, local or remotely
mongoose.connect(database.url);
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* GET genes listing. */
router.get('/', function (req, res) {
    res.send({ title: "Genes API Entry Point" });
});


// Preprocess the data when the server goes up

// Get the genes collection size
var genesMap: Map<string, any> = new Map<string, any>();
var genesById: Gene[];
var genesByScore: Gene[];
var totalRecords = 0;

// Group and sort by id
Genes.aggregate(
    [
        {
            $group: {
                _id: '$hgnc_symbol',
                AveExpr : { $first: '$AveExpr' },
                ensembl_gene_id : { $first: '$ensembl_gene_id' },
                logFC : { $first: '$logFC' },
                CI_L : { $first: '$CI_L' },
                CI_R : { $first: '$CI_R' },
                adj_P_Val : { $first: '$adj_P_Val' },
                neg_log10_adj_P_Val : { $first: '$neg_log10_adj_P_Val' },
                tissue_study_pretty : { $first: '$tissue_study_pretty' },
                comparison_model_sex_pretty : { $first: '$comparison_model_sex_pretty' }
            }
        },
        {
            $sort: {
                '_id': 1
            }
        },
        // Last two stages of the pipe to change from _id to hgnc_symbol
        {
            $addFields: { hgnc_symbol: "$_id" }
        },
        {
            $project: { _id: 0 }
        }
    ]
).then(genes => {
    genes.forEach((g: Gene) => {
        genesMap[g.hgnc_symbol] = g;
    });
    genesById = genes;
    totalRecords = genes.length;
});

// Group and sort by score
Genes.aggregate(
    [
        {
            $group: {
                _id: '$hgnc_symbol',
                AveExpr : { $first: '$AveExpr' },
                ensembl_gene_id : { $first: '$ensembl_gene_id' },
                logFC : { $first: '$logFC' },
                CI_L : { $first: '$CI_L' },
                CI_R : { $first: '$CI_R' },
                adj_P_Val : { $first: '$adj_P_Val' },
                neg_log10_adj_P_Val : { $first: '$neg_log10_adj_P_Val' },
                tissue_study_pretty : { $first: '$tissue_study_pretty' },
                comparison_model_sex_pretty : { $first: '$comparison_model_sex_pretty' }
            }
        },
        {
            $sort: {
                'AveExpr': 1
            }
        },
        // Last two stages of the pipe to change from _id to hgnc_symbol
        {
            $addFields: { hgnc_symbol: "$_id" }
        },
        {
            $project: { _id: 0 }
        }
    ]
).then(genes => {
    genes.forEach((g: Gene) => {
        genesById[g.hgnc_symbol] = g;
    });
    genesByScore = genes;
    totalRecords = genes.length;
});

// Routes to get genes information
router.get('/genes', function (req, res) {
    console.log("Get all genes");

    // Use mongoose to get all genes in the database
    let genes = ((req.query.sortField === 'AveExpr') ? genesByScore : genesById);

    // Use mongoose to get one page of genes
    res.json({ items: genes, totalRecords: totalRecords });
});

// Use mongoose to get one page of genes
router.get('/genes/page', (req, res) => {
    console.log('genes page');
    console.log(req.query);

    // Convert the strings
    let skip = (+req.query.first) ? +req.query.first : 0;
    let limit = (+req.query.rows) ? +req.query.rows : 10;

    // Get one array or the other depending on the list column we want to sort by
    let genes: Gene[] = [];

    ((req.query.sortField === 'AveExpr') ? genesByScore : genesById).forEach(g => {
        // If we typed into the search above the list
        if (req.query.globalFilter !== 'null') {
            if (g.hgnc_symbol.includes(req.query.globalFilter.trim().toUpperCase()))  {
                // Do not use a shallow copy here
                genes.push(JSON.parse(JSON.stringify(g)));
            }
        } else {
            // Do not use a shallow copy here
            genes.push(JSON.parse(JSON.stringify(g)));
        }
    });
    // Updates the global length based on the filter
    totalRecords = genes.length;

    // If we want sort in the reverse order, this is done in-place
    let sortOrder = (+req.query.sortOrder) ? +req.query.sortOrder : 1;
    if (sortOrder === -1) genes.reverse();

    // Send the final genes page
    res.json({ items: genes.slice(skip, skip + limit), totalRecords: totalRecords });
});

// Get a gene by id, currently hgnc_symbol
router.get('/genes/:id', function (req, res) {
    console.log('genes that match an id');
    console.log(req.query);
    // Return an empty array in case no id was passed or no params
    if (!req.params || !req.params.id) res.json({ items: []});

    // Get one array or the other depending on the list column we want to sort by
    let genes: Gene[] = [];

    // Filter the map using a for loop. For arrays it is Twice as fast as a native filter
    // https://jsperf.com/array-filter-performance
    console.log(req.params.id);
    console.log(genesById['VGF']);

    genesById.forEach(g => {
        if (g.hgnc_symbol.includes(req.params.id.trim().toUpperCase())) {
            // Do not use a shallow copy here
            console.log('passed');
            console.log(JSON.parse(JSON.stringify(g)));
            genes.push(JSON.parse(JSON.stringify(g)));
        }
    });
    console.log(genes);

    res.json({ items: genes });
});

// Get a gene by id, currently hgnc_symbol
router.get('/gene/:id', function (req, res) {
    // Return an empty array in case no id was passed or no params
    if (!req.params || !req.params.id) res.json({ items: []});

    res.json({ items: genesMap[req.params.id] });
});

export = router;
