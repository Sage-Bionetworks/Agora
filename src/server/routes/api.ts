import * as express from 'express';
import * as mongoose from 'mongoose';

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
var genesById = [];
var genesByScore = [];
var totalRecords = 0;

// Group and sort by id
Genes.aggregate(
    [
        {
            $group: {
                _id: '$hgnc_symbol', AveExpr : { $first: '$AveExpr' }
            }
        },
        {
            $sort: {
                '_id': 1
            }
        }
    ]
).then(genes => {
    genesById = genes;
    totalRecords = genesById.length;
});

// Group and sort by score
Genes.aggregate(
    [
        {
            $group: {
                _id: '$hgnc_symbol', AveExpr : { $first: '$AveExpr' }
            }
        },
        {
            $sort: {
                'AveExpr': 1
            }
        }
    ]
).then(genes => {
    genesByScore = genes;
    totalRecords = genesById.length;
});

// Get


router.get('/genes', function (req, res) {
    console.log("Get all genes");

    // Use mongoose to get all genes in the database
    let genes = ((req.query.sortField === 'AveExpr') ? genesByScore : genesById).map(a =>{
        return {
            hgnc_symbol: a._id,
            AveExpr: a.AveExpr
        }
    });

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
    let genes = (req.query.sortField === 'AveExpr') ? genesByScore : genesById;
    // The mongodb query has the first property as _id, so the hgnc_symbol will be _id
    if (req.query.globalFilter !== 'null') {
        genes = genes.filter(g => {
            return g._id.includes(req.query.globalFilter.toUpperCase());
        })
        // Updates the length based on the filter
        totalRecords = genes.length;
    } else {
        // Resets the length
        totalRecords = genes.length;
    }
    // Make a deep copy so we don't mutate the original arrays
    genes = genes.map(a =>{
        return {
            hgnc_symbol: a._id,
            AveExpr: a.AveExpr
        }
    });
    let sortOrder = (+req.query.sortOrder) ? +req.query.sortOrder : 1;

    // If we want sort in the reverse order, this is in-place
    if (sortOrder === -1) genes.reverse();

    // Send the final genes page
    res.json({ items: genes.slice(skip, skip + limit), totalRecords: totalRecords });
});

// Get a gene by id, currently hgnc_symbol
router.get('/gene/:id', function (req, res) {
    let match = [];

    // Return an empty array in case no id was passed or no params
    if (!req.params || !req.params.id) res.json({ items: []});

    // Filter the ids array using a for loop. Twice as fast as a native filter
    // https://jsperf.com/array-filter-performance
    genesById.forEach(g => {
        if (g._id.includes(req.params.id.toUpperCase())) {
            match.push({
                hgnc_symbol: g._id,
                AveExpr: g.AveExpr
            })
        };
    })

    res.json({ items: match });
});

export = router;