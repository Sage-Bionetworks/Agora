const express = require('express');
const router = express.Router();
const AWS = require("aws-sdk");

// Set the region
if (express().get('env') === 'development') {
    AWS.config.update({
        region: 'us-east-1',
        endpoint: 'http://localhost:8000'
    });
} else {
    AWS.config.update({
        region: 'us-east-2',
        accessKeyId: 'AKIAJV2BS5SVBTBT47QQ',
        secretAccessKey: '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'
    });
}

var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

var tableParams = {
    Limit: 10
};

var params = {
    TableName: "genes",
    ProjectionExpression: "#ensembl_gene_id, #hgnc_symbol",
    ExpressionAttributeNames: {
        "#ensembl_gene_id": "ensembl_gene_id",
        "#hgnc_symbol": "hgnc_symbol"
    }
};

/* GET genes listing. */
router.get('/', function (req, res) {
    res.send({ title: "Genes API Entry Point" });
});

router.get('/tables', function(req, res) {
    console.log("Listing tables");
    dynamodb.listTables(tableParams, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log('listTables', err, data);
            res.send(data);
        }
    });
})

router.get('/genes', function (req, res) {
    console.log("Scanning all genes");
    docClient.scan(params, onScan);
    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            res.send(data)
            // print all the Cars
            console.log("Scan succeeded.");
            data.Items.forEach(function(gene) {
                console.log(gene.hgnc_symbol)
            });
            /*if (typeof data.LastEvaluatedKey != "undefined") {
                console.log("Scanning for more...");
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            }*/
        }
    }
});

module.exports = router;