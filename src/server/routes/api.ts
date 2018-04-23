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
var genesById: Gene[] = [];
var genesByScore: Gene[] = [];
var allGenes: Gene[] = [];
var totalRecords = 0;

// Group by id and sort by hgnc_symbol
Genes.aggregate(
    [
        {
            $group: {
                _id: '$_id',
                hgnc_symbol: { $first: '$hgnc_symbol' },
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
                'hgnc_symbol': 1
            }
        }
    ]
).allowDiskUse(true).exec().then(genes => {
    // All the genes, ordered by hgnc_symbol
    allGenes = genes.slice();
    // Unique genes, ordered by hgnc_symbol
    let seen = {}
    genesById = genes.slice().filter((g) => {
        if (seen[g['hgnc_symbol']]) return;
        seen[g['hgnc_symbol']] = true;
        return g['hgnc_symbol'];
    });
    // Unique genes, ordered by score
    genesByScore = genesById.slice().sort((a, b) => { return (a.AveExpr > b.AveExpr) ? 1 : ((b.AveExpr > a.AveExpr) ? -1 : 0); });

    totalRecords = genesById.length;
});

// Routes to get genes information
router.get('/genes', function (req, res, next) {
    console.log('Get all genes');

    // Use mongoose to get one page of genes
    res.json({ items: allGenes });
});

// Use mongoose to get one page of genes
router.get('/genes/page', (req, res, next) => {
    console.log('Get a page of genes');
    console.log(req.query);

    // Convert the strings
    let skip = (+req.query.first) ? +req.query.first : 0;
    let limit = (+req.query.rows) ? +req.query.rows : 10;

    // Get one array or the other depending on the list column we want to sort by
    let genes: Gene[] = [];

    if (req.query.globalFilter !== 'null' && req.query.globalFilter) {
        ((req.query.sortField === 'AveExpr') ? genesByScore : genesById).forEach(g => {
            // If we typed into the search above the list
            if (g.hgnc_symbol.includes(req.query.globalFilter.trim().toUpperCase()))  {
                // Do not use a shallow copy here
                genes.push(JSON.parse(JSON.stringify(g)));
            }
        });
    } else {
        genes = ((req.query.sortField === 'AveExpr') ? genesByScore : genesById).slice();
    }
    // Updates the global length based on the filter
    totalRecords = genes.length;

    // If we want sort in the reverse order, this is done in-place
    let sortOrder = (+req.query.sortOrder) ? +req.query.sortOrder : 1;
    if (sortOrder === -1) genes.reverse();

    // Send the final genes page
    res.json({ items: genes.slice(skip, skip + limit), totalRecords: totalRecords });
});

// Get a gene by id, currently hgnc_symbol
router.get('/genes/:id', function (req, res, next) {
    console.log('Get the genes that match an id');
    console.log(req.params.id);
    // Return an empty array in case no id was passed or no params
    if (!req.params || !req.params.id) res.json({ items: []});

    // Get one array or the other depending on the list column we want to sort by
    let genes: Gene[] = [];

    // Filter the map using a for loop. For arrays it is Twice as fast as a native filter
    // https://jsperf.com/array-filter-performance
    genesById.forEach(g => {
        if (g.hgnc_symbol.includes(req.params.id.trim().toUpperCase())) {
            // Do not use a shallow copy here
            console.log('passed');
            console.log(JSON.parse(JSON.stringify(g)));
            genes.push(JSON.parse(JSON.stringify(g)));
        }
    });

    res.json({ items: genes });
});

// Get a gene by id, currently hgnc_symbol
router.get('/gene/:id', function (req, res, next) {
    console.log('Get a gene with an id');
    console.log(req.params.id);
    // Return an empty array in case no id was passed or no params
    if (!req.params || !req.params.id) res.json({ items: []});

    Genes.findById(req.params.id).exec((err, gene) => {
        if (err) {
            next(err);
        } else {
            res.json({ item: gene });
        }
    });
});

export = router;
