db = db.getSiblingDB('agora')

const avg = (array) => array.reduce((a, b) => a + b) / array.length

const queries = [
    {
        collection: 'geneinfo',
        find: { hgnc_symbol: 'PLEC' }
    },
    {
        collection: 'geneinfo',
        find: { ensembl_gene_id: 'ENSG00000178209' }
    },
    {
        collection: 'geneinfo',
        find: {
            ensembl_gene_id: { $in: ['ENSG00000178209', 'ENSG00000171680'] }
        },
        sort: {
            hgnc_symbol: 1
        }
    },
    {
        collection: 'geneinfo',
        find: { ensembl_gene_id: 'ENSG00000178209' },
    },
    {
        collection: 'geneinfo',
        find: { $or: [
            { hgnc_symbol: { $regex: 'PLE', $options: 'i' } },
            { alias: { $regex: 'PLE', $options: 'i' } }
        ]}
    },
    {
        collection: 'geneinfo',
        find: { nominations: { $gt: 0 } },
        sort: { nominations: -1, hgnc_symbol: 1 }
    },
    {
        collection: 'genes',
        find: { ensembl_gene_id: 'ENSG00000178209' },
        sort: { hgnc_symbol: 1, tissue: 1, model: 1 }
    },
    {
        collection: 'genes',
        find: {
            ensembl_gene_id: 'ENSG00000178209',
            tissue: 'TCX',
        },
    },
    {
        collection: 'genes',
        find: {
            ensembl_gene_id: 'ENSG00000178209',
            model: 'AD Diagnosis (males and females)'
        },
    },
    {
        collection: 'genes',
        find: {
            ensembl_gene_id: 'ENSG00000178209',
            tissue: 'TCX',
            model: 'AD Diagnosis (males and females)'
        },
    },
    {
        collection: 'geneslinks',
        find: { geneA_ensembl_gene_id: 'ENSG00000178209' }
    },
    {
        collection: 'geneslinks',
        find: { geneB_ensembl_gene_id: 'ENSG00000178209' }
    },
    {
        collection: 'geneslinks',
        find: { $and: [
            {
                geneA_ensembl_gene_id: {$in: [
                    'ENSG00000168056', 'ENSG00000111783', 'ENSG00000171885',
                    'ENSG00000074855', 'ENSG00000183255', 'ENSG00000196576',
                    'ENSG00000175287', 'ENSG00000138193', 'ENSG00000107554',
                    'ENSG00000124942', 'ENSG00000139684', 'ENSG00000276855',
                    'ENSG00000196576', 'ENSG00000008226', 'ENSG00000178685',
                    'ENSG00000129151', 'ENSG00000170325', 'ENSG00000148204',
                    'ENSG00000168056', 'ENSG00000242173', 'ENSG00000141503',
                    'ENSG00000130165', 'ENSG00000074855', 'ENSG00000196576',
                    'ENSG00000148204', 'ENSG00000054179', 'ENSG00000168056',
                    'ENSG00000213398', 'ENSG00000167716', 'ENSG00000173821',
                    'ENSG00000134504', 'ENSG00000100075', 'ENSG00000106823',
                    'ENSG00000148204', 'ENSG00000054179', 'ENSG00000135424',
                    'ENSG00000123384', 'ENSG00000054654', 'ENSG00000185722',
                    'ENSG00000175906', 'ENSG00000161714', 'ENSG00000115266',
                    'ENSG00000063241', 'ENSG00000196576', 'ENSG00000148204',
                    'ENSG00000124942', 'ENSG00000115266', 'ENSG00000196576',
                    'ENSG00000144749', 'ENSG00000164530', 'ENSG00000158106',
                    'ENSG00000213366', 'ENSG00000116117', 'ENSG00000144909',
                    'ENSG00000119900', 'ENSG00000034677', 'ENSG00000158106',
                    'ENSG00000144597', 'ENSG00000173905', 'ENSG00000182095',
                    'ENSG00000136002', 'ENSG00000136068', 'ENSG00000127418',
                    'ENSG00000215712'
                ]}
            },
            {
                geneB_ensembl_gene_id: {$in: [
                    'ENSG00000168056', 'ENSG00000111783', 'ENSG00000171885',
                    'ENSG00000074855', 'ENSG00000183255', 'ENSG00000196576',
                    'ENSG00000175287', 'ENSG00000138193', 'ENSG00000107554',
                    'ENSG00000124942', 'ENSG00000139684', 'ENSG00000276855',
                    'ENSG00000196576', 'ENSG00000008226', 'ENSG00000178685',
                    'ENSG00000129151', 'ENSG00000170325', 'ENSG00000148204',
                    'ENSG00000168056', 'ENSG00000242173', 'ENSG00000141503',
                    'ENSG00000130165', 'ENSG00000074855', 'ENSG00000196576',
                    'ENSG00000148204', 'ENSG00000054179', 'ENSG00000168056',
                    'ENSG00000213398', 'ENSG00000167716', 'ENSG00000173821',
                    'ENSG00000134504', 'ENSG00000100075', 'ENSG00000106823',
                    'ENSG00000148204', 'ENSG00000054179', 'ENSG00000135424',
                    'ENSG00000123384', 'ENSG00000054654', 'ENSG00000185722',
                    'ENSG00000175906', 'ENSG00000161714', 'ENSG00000115266',
                    'ENSG00000063241', 'ENSG00000196576', 'ENSG00000148204',
                    'ENSG00000124942', 'ENSG00000115266', 'ENSG00000196576',
                    'ENSG00000144749', 'ENSG00000164530', 'ENSG00000158106',
                    'ENSG00000213366', 'ENSG00000116117', 'ENSG00000144909',
                    'ENSG00000119900', 'ENSG00000034677', 'ENSG00000158106',
                    'ENSG00000144597', 'ENSG00000173905', 'ENSG00000182095',
                    'ENSG00000136002', 'ENSG00000136068', 'ENSG00000127418',
                    'ENSG00000215712'
                ]}
            }
        ]}
    },
    {
        collection: 'genesmetabolomics',
        find: { ensembl_gene_id: 'ENSG00000000457' }
    },
    {
        collection: 'genesmetabolomics',
        find: { associated_gene_name: 'SCYL3' }
    },
    {
        collection: 'genesproteomics',
        find: { $and: [
            { hgnc_symbol: 'PLEC' },
            { uniprotid: { $ne: null } }
        ]}
    }
]

for (let query of queries) {
    const execCount = 10
    let explained = null
    let execTimes = []
    let lastTotalKeysExamined = 0
    let lastTotalDocsExamined = 0
    let lastNReturned = 0

    print()
    print('// -------------------------------------------------------------------------- //')
    print()
    print('Executing query (x' + execCount + ') on "' + query.collection + '" collection:')
    if (query.find) {
        print('find:')
        printjson(query.find)
    }
    if (query.sort) {
        print('sort:')
        printjson(query.sort)
    }
    print('...')

    for (let i = 0; i < execCount; i++) {
        if (query.sort) {
            explained = db[query.collection]
                .find(query.find)
                .sort(query.sort)
                .explain('executionStats')
        }
        else {
            explained = db[query.collection]
                .find(query.find)
                .explain('executionStats')
        }

        execTimes.push(explained.executionStats.executionTimeMillis)
        lastTotalKeysExamined = explained.executionStats.totalKeysExamined
        lastTotalDocsExamined = explained.executionStats.totalDocsExamined
        lastNReturned = explained.executionStats.nReturned
        sleep(200);
    }

    print()
    print('Average time: ' + avg(execTimes) + 'ms')
    print('Total keys: ' + lastTotalKeysExamined)
    print('Total docs: ' + lastTotalDocsExamined)
    print('Results found: ' + lastNReturned)
    print()
}