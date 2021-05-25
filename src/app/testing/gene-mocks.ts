import {
    Gene,
    GeneInfo,
    GeneNetworkLinks,
    GeneNetwork,
    GeneStatistics,
    GenesResponse,
    Metabolomics,
    LinksListResponse,
    GeneExpValidation
} from '../models';

export const mockGene1: Gene = {
    _id: '5afa0be1310e7e82fde5112c',
    hgnc_symbol: 'PIAS2',
    ensembl_gene_id: 'ENSG00000078043',
    fc: 1.246,
    logfc: -0.446,
    ci_l: -0.5474,
    ci_r: -0.3437,
    adj_p_val: Math.pow(10, 2.0532e-12),
    study: 'MayoRNAseq',
    tissue: 'CBE',
    model: 'AD Diagnosis (males and females)'
};

export const mockGene2: Gene = {
    _id: '5afa0be1310e7e82fde5112d',
    hgnc_symbol: 'MPV17',
    ensembl_gene_id: 'ENSG00000115204',
    fc: 1.246,
    logfc: -0.343,
    ci_l: -0.4257,
    ci_r: -0.2595,
    adj_p_val: Math.pow(10, 1.5351e-11),
    study: 'MayoRNAseq',
    tissue: 'CBE',
    model: 'AD Diagnosis (males and females)'
};

export const emptyGene: Gene = {
    _id: '',
    ensembl_gene_id: '',
    hgnc_symbol: '',
    logfc: 0,
    ci_l: 0,
    ci_r: 0,
    adj_p_val: 0,
    fc: 0,
    tissue: '',
    study: '',
    model: ''
};

export const mockGeneStatistics: GeneStatistics = {
    maxFC: 1.246,
    minFC: 0.5,
    minLogFC: -1.00,
    maxLogFC: 0.32,
    minAdjPValue: Math.pow(10, 1.5351e-9),
    maxAdjPValue: Math.pow(10, 1.5351e-11),
    geneTissues: ['CBE', 'TCX'],
    geneModels: ['AD Diagnosis (males and females)', 'AD Diagnosis x AOD (males and females)']
};

export const mockInfo1: GeneInfo = {
    _id: '5b33ce05cf26b9efe2025046',
    ensembl_gene_id: 'ENSG00000106211',
    alias: ['CMT2F', 'HEL-S-102', 'HMN2B', 'HS.76067', 'HSP27', 'HSP28', 'Hsp25', 'SRP27'],
    name: 'heat shock protein family B (small) member 1',
    summary: 'This gene encodes a member of the small heat shock protein (HSP20) family of ' +
        'proteins. In response to environmental stress, the encoded protein translocates from ' +
        'the cytoplasm to the nucleus and functions as a molecular chaperone that promotes the ' +
        'correct folding of other proteins. This protein plays an important role in the ' +
        'differentiation of a wide variety of cell types. Expression of this gene is correlated ' +
        'with poor clinical outcome in multiple human cancers, and the encoded protein may ' +
        'promote cancer cell proliferation and metastasis, while protecting cancer cells ' +
        'from apoptosis. Mutations in this gene have been identified in human patients with ' +
        'Charcot-Marie-Tooth disease and distal hereditary motor neuropathy. [provided  ' +
        'by RefSeq, Aug 2017].',
    hgnc_symbol: 'HSPB1',
    type_of_gene: 'protein-coding',
    go_MF: [
        {
            category: 'MF',
            evidence: 'HDA',
            id: 'GO:0003723',
            pubmed: [22658674],
            term: 'RNA binding'
        },
        {
            category: 'MF',
            evidence: 'ISS',
            id: 'GO:0005080',
            pubmed: {},
            term: 'protein kinase C binding'
        },
        {
            category: 'MF',
            evidence: 'IPI',
            id: 'GO:0005515',
            pubmed: [
                11003656, 11700327, 12601044, 14594798, 15161933, 15657067, 16169070, 17184779,
                17342744, 17353931, 18330356, 20467437, 20618440, 21157431, 21575178, 22365833,
                23188086, 23397142, 23948568, 24189400, 25036637, 25241761, 25277244, 25852190,
                26496610
            ],
            term: 'protein binding'
        }
    ],
    isChangedInADBrain: false,
    isIGAP: false,
    haseqtl: true,
    medianexpression: [
        {
            medianlogcpm: 7.7848,
            tissue: 'DLPFC'
        },
        {
            medianlogcpm: 6.9782,
            tissue: 'TCX'
        }
    ],
    nominatedtarget: [
        {
            team: 'Emory',
            rank: 19,
            target_choice_justification: 'HSPB1 was identified as a potential driver protein ' +
                'based on protein coexpression analysis of the BLSA and ACT cohorts. The' +
                'group of proteins coexpressed with HSPB1 is conserved across the datasets ' +
                'considered and is enriched in inflammatory processes, and for protein ' +
                'products of genes near loci previously associated with AD risk. HSPB1 has ' +
                'increased abundance in AD across the examined cohorts.',
            predicted_therapeutic_direction: 'As a small oligomeric HSP, phosphorylation ' +
                'regulates its oligomerization and activity in protein quality control; ' +
                'this phosphorylation was previously seen to be dysregulated in AD ' +
                '(Dammer et al, Proteomics, 2014), and the overall increase does not ' +
                'necessarily represent more functional protein in cell types which may need ' +
                'it most.',
            data_used_to_support_target_selection: 'Discovery quantitative proteomics of ' +
                'FrCx \nWPCNA of multiple and consensus cohorts\nANOVA',
            data_synapseid: ['syn3606086', 'syn5759376', 'syn7170616'],
            study: 'ACT, BLSA, Banner',
            input_data: 'Protein'
        }
    ],
    druggability: [
        {
            sm_druggability_bucket: 1,
            safety_bucket: 3,
            feasibility_bucket: 3,
            abability_bucket: 1,
            new_modality_bucket: 4,
            tissue_engagement_bucket: 3,
            pharos_class: 'Tchem',
            classification: 'Small molecule druggable: Protein with a small molecule ligand ' +
            'identified from ChEMBL, meeting TCRD activity criteria.',
            safety_bucket_definition: 'Potential risks, proceed with caution. Two or fewer of: ' +
            'high off-target gene expression, cander driver, essential gene, associated ' +
            'deleterious genetic disorder, HPO phenotype associated gene, or black box ' +
            'warning on clinically used drug.',
            feasibility_bucket_definition: 'High target qualification but low feasibility – ' +
            'Tier C  for drug development. Attempt to address gaps and re-evaluate if additional ' +
            'feasibility tools found. Either move to category 1 or 2 if successful, or park in ' +
            'category 5 if not.',
            abability_bucket_definition: 'Secreted protein. Highly accessible to antibody-based ' +
            'therapies.',
            new_modality_bucket_definition: 'Not specified suitable for degradation/inhibition ' +
            'by user.'
        }
    ],
    nominations: 1
};

export const mockDataLink1: GeneNetworkLinks = {
    brainRegion: 'DLPFC',
    geneA_ensembl_gene_id: 'ENSG00000128564',
    geneA_external_gene_name: 'VGF',
    geneB_ensembl_gene_id: 'ENSG00000169436',
    geneB_external_gene_name: 'COL22A1'
};

export const mockDataLink2: GeneNetworkLinks = {
    brainRegion: 'STG',
    geneA_ensembl_gene_id: 'ENSG00000197106',
    geneA_external_gene_name: 'SLC6A17',
    geneB_ensembl_gene_id: 'ENSG00000152954',
    geneB_external_gene_name: 'NRSN1'
};

export const mockNetwork1: GeneNetwork = {
    nodes: [],
    links: [],
    origin: mockGene1,
    filterLvl: 1
};

export const mockTissues: string [] = ['DLPFC', 'CBE', 'TCX'];

export const mockModels: string [] = [
    'AD Diagnosis (males and females)',
    'AD Diagnosis x AOD (males and females)',
    'AD Diagnosis x Sex (females only)',
    'AD Diagnosis x Sex (males only)'
];

export const mockMetabolomics: Metabolomics = {
    _id: '5d1cf521ec5b9d45d8f98781',
    associated_gene_name: 'VGF',
    ensembl_gene_id: 'ENSG00000128564',
    metabolite_id: 'PC.ae.C36.4',
    metabolite_full_name: 'PC ae C36:4',
    association_p: 4.6840012252077e-05,
    gene_wide_p_threshold_1kgp: 7.27802037845706e-05,
    n_per_group: [
        362,
        302
    ],
    boxplot_group_names: [
        'CN',
        'AD'
    ],
    ad_diagnosis_p_value: [
        0.14581678853452
    ],
    transposed_boxplot_stats: [
        [
            -2.80747928431701,
            -0.666279090282903,
            -0.021045311527237,
            0.810313336061741,
            2.95738287401986
        ],
        [
            -2.4183583617742,
            -0.653260557186807,
            -0.114231130055799,
            0.609836972086108,
            2.04075458691275
        ]
    ]
};

export const mockGenesResponse: GenesResponse = {
    items: [mockGene1],
    geneEntries: [mockGene1, mockGene2],
    maxFC: Math.max(mockGene1.fc, mockGene2.fc),
    minFC: Math.min(mockGene1.fc, mockGene2.fc),
    minLogFC: Math.max(mockGene1.logfc, mockGene2.logfc),
    maxLogFC: Math.min(mockGene1.logfc, mockGene2.logfc),
    minAdjPValue: Math.min(mockGene1.adj_p_val, mockGene2.adj_p_val),
    maxAdjPValue: Math.max(mockGene1.adj_p_val, mockGene2.adj_p_val),
    geneTissues: mockTissues,
    geneModels: mockModels
};

export const mockLinksListResponse: LinksListResponse = {
    items: [mockDataLink1, mockDataLink2]
};

export const mockExpValidation: GeneExpValidation = {
    _id: '12345',
    ensembl_gene_id: 'string',
    hgnc_symbol: 'BBB',
    Hypothesis_tested: 'string',
    Summary_findings: 'string',
    'Published?': 'Yes',
    Species: 'string',
    Model_system: 'string',
    Outcome_measure: 'string',
    Outcome_measure_details: 'string',
    Contributors: 'John D',
    Team: 'Duke',
    Date_report: '01/01/2021',
};
