import {
    Gene,
    GeneInfo,
    GeneNetworkLinks,
    GeneNetwork,
    GeneStatistics,
    GenesResponse,
    Metabolomics,
    LinksListResponse,
    GeneExpValidation,
    GeneScoreDistribution,
    DistributionData,
    GeneOverallScores,
    GeneResponse,
    RnaDistribution
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
  model: 'AD Diagnosis (males and females)',
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
  model: 'AD Diagnosis (males and females)',
};

export const mockGeneCorrelationData: any = [
  {
    _id: '61e994f7f0ad252bb8361138',
    ci_lower: 0.91803550719735,
    ci_upper: 1.21903693075933,
    ensg: 'ENSG00000078043',
    gname: 'PIAS2',
    neuropath_type: 'BRAAK',
    oddsratio: 1.05766612357586,
    pval: 0.438026367318651,
    pval_adj: 0.717412210719562
  }
];

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
  model: '',
};

export const mockGeneStatistics: GeneStatistics = {
  maxFC: 1.246,
  minFC: 0.5,
  minLogFC: -1.0,
  maxLogFC: 0.32,
  minAdjPValue: Math.pow(10, 1.5351e-9),
  maxAdjPValue: Math.pow(10, 1.5351e-11),
  geneTissues: ['CBE', 'TCX'],
  geneModels: ['AD Diagnosis (males and females)', 'AD Diagnosis x AOD (males and females)'],
};

export const mockInfo1: GeneInfo = {
  _id: '5b33ce05cf26b9efe2025046',
  ensembl_gene_id: 'ENSG00000106211',
  alias: ['CMT2F', 'HEL-S-102', 'HMN2B', 'HS.76067', 'HSP27', 'HSP28', 'Hsp25', 'SRP27'],
  name: 'heat shock protein family B (small) member 1',
  summary:
    'This gene encodes a member of the small heat shock protein (HSP20) family of ' +
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
  isIGAP: false,
  haseqtl: true,
  isAnyRNAChangedInADBrain: true,
  rna_brain_change_studied: true,
  isAnyProteinChangedInADBrain: true,
  protein_brain_change_studied: false,
  medianexpression: [
    {
      medianlogcpm: 7.7848,
      tissue: 'DLPFC',
    },
    {
      medianlogcpm: 6.9782,
      tissue: 'TCX',
    },
  ],
  nominatedtarget: [
    {
      team: 'Emory',
      rank: 19,
      target_choice_justification:
        'HSPB1 was identified as a potential driver protein ' +
        'based on protein coexpression analysis of the BLSA and ACT cohorts. The' +
        'group of proteins coexpressed with HSPB1 is conserved across the datasets ' +
        'considered and is enriched in inflammatory processes, and for protein ' +
        'products of genes near loci previously associated with AD risk. HSPB1 has ' +
        'increased abundance in AD across the examined cohorts.',
      predicted_therapeutic_direction:
        'As a small oligomeric HSP, phosphorylation ' +
        'regulates its oligomerization and activity in protein quality control; ' +
        'this phosphorylation was previously seen to be dysregulated in AD ' +
        '(Dammer et al, Proteomics, 2014), and the overall increase does not ' +
        'necessarily represent more functional protein in cell types which may need ' +
        'it most.',
      data_used_to_support_target_selection:
        'Discovery quantitative proteomics of ' +
        'FrCx \nWPCNA of multiple and consensus cohorts\nANOVA',
      data_synapseid: 'syn3606086',
      study: 'ACT, BLSA, Banner',
      input_data: 'Protein',
      validation_study_details: '',
      initial_nomination: 2018,
    },
  ],
  druggability: [
    {
      sm_druggability_bucket: 1,
      safety_bucket: 3,
      abability_bucket: 1,
      pharos_class: 'Tchem',
      classification:
        'Small molecule druggable: Protein with a small molecule ligand ' +
        'identified from ChEMBL, meeting TCRD activity criteria.',
      safety_bucket_definition:
        'Potential risks, proceed with caution. Two or fewer of: ' +
        'high off-target gene expression, cander driver, essential gene, associated ' +
        'deleterious genetic disorder, HPO phenotype associated gene, or black box ' +
        'warning on clinically used drug.',
      abability_bucket_definition:
        'Secreted protein. Highly accessible to antibody-based ' + 'therapies.',
    },
  ],
  nominations: 1,
};

export const mockDataLink1: GeneNetworkLinks = {
  brainRegion: 'DLPFC',
  geneA_ensembl_gene_id: 'ENSG00000128564',
  geneA_external_gene_name: 'VGF',
  geneB_ensembl_gene_id: 'ENSG00000169436',
  geneB_external_gene_name: 'COL22A1',
};

export const mockDataLink2: GeneNetworkLinks = {
  brainRegion: 'STG',
  geneA_ensembl_gene_id: 'ENSG00000197106',
  geneA_external_gene_name: 'SLC6A17',
  geneB_ensembl_gene_id: 'ENSG00000152954',
  geneB_external_gene_name: 'NRSN1',
};

export const mockNetwork1: GeneNetwork = {
  nodes: [],
  links: [],
  origin: mockGene1,
  filterLvl: 1,
};

export const mockTissues: string[] = ['DLPFC', 'CBE', 'TCX'];

export const mockModels: string[] = [
  'AD Diagnosis (males and females)',
  'AD Diagnosis x AOD (males and females)',
  'AD Diagnosis x Sex (females only)',
  'AD Diagnosis x Sex (males only)',
];

export const mockMetabolomics: Metabolomics = {
  _id: '5d1cf521ec5b9d45d8f98781',
  associated_gene_name: 'VGF',
  ensembl_gene_id: 'ENSG00000128564',
  metabolite_id: 'PC.ae.C36.4',
  metabolite_full_name: 'PC ae C36:4',
  association_p: 4.6840012252077e-5,
  gene_wide_p_threshold_1kgp: 7.27802037845706e-5,
  n_per_group: [362, 302],
  boxplot_group_names: ['CN', 'AD'],
  ad_diagnosis_p_value: [0.14581678853452],
  transposed_boxplot_stats: [
    [
      -2.80747928431701, -0.666279090282903, -0.021045311527237, 0.810313336061741,
      2.95738287401986,
    ],
    [-2.4183583617742, -0.653260557186807, -0.114231130055799, 0.609836972086108, 2.04075458691275],
  ],
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
  geneModels: mockModels,
};

export const mockEvidenceData: any = {
  rnaDifferentialExpression: [mockGene1],
  rnaCorrelation: mockGeneCorrelationData,
};

export const mockRnaDistributionData: RnaDistribution[] = [
  {
    _id: '624a90996daa8dee2e0bf34e',
    model: 'AD Diagnosis (males and females)',
    tissue: 'ACC',
    min: -1.004,
    max: 1.598,
    first_quartile: -0.066,
    median: -0.004,
    third_quartile: 0.06
  }
];

export const mockLinksListResponse: LinksListResponse = {
  items: [mockDataLink1, mockDataLink2],
};

export const mockExpValidation: GeneExpValidation[] = [
  {
    _id: '12345',
    ensembl_gene_id: 'string',
    hgnc_symbol: 'BBB',
    hypothesis_tested: 'string',
    summary_findings: 'string',
    published: 'Yes',
    species: 'string',
    model_system: 'string',
    outcome_measure: 'string',
    outcome_measure_details: 'string',
    contributors: 'John D',
    team: 'Duke',
    reference_doi: 'https://doi.org/10.15252/abc.123',
    date_report: '01/01/2021',
  },
];

export const mockDistributionData: DistributionData = {
  distribution: [1],
  bins: [['0', '1']] as Array<[string, string]>,
  min: 1,
  max: 1,
  mean: 1,
  first_quartile: 1,
  third_quartile: 1,
  syn_id: 'syn25913473',
  wiki_id: '613104',
  name: 'Distribution Name',
};

export const mockGeneScoreDistribution: GeneScoreDistribution = {
  _id: 'string',
  logsdon: mockDistributionData,
  geneticsscore: mockDistributionData,
  omicsscore: mockDistributionData,
  literaturescore: mockDistributionData,
  flyneuropathscore: mockDistributionData,
};

export const mockGeneOverallScores: GeneOverallScores = {
  _id: 'string',
  ENSG: 'ENSG_string',
  GeneName: 'string',
  Logsdon: 1,
  GeneticsScore: 2,
  OmicsScore: 3,
  LiteratureScore: 4,
};

export const mockGeneResponse1: GeneResponse = {
    item: mockGene1,
    info: mockInfo1,
    expValidation: mockExpValidation,
    overallScores: mockGeneOverallScores
};

export const mockGeneResponseNoGeneItem: GeneResponse = {
    item: null,
    info: mockInfo1,
    expValidation: mockExpValidation,
    overallScores: mockGeneOverallScores
};

export const mockGeneResponseNoExpValidation: GeneResponse = {
    item: mockGene1,
    info: mockInfo1,
    expValidation: null,
    overallScores: mockGeneOverallScores
};

export const mockGeneResponseNoScores: GeneResponse = {
    item: mockGene1,
    info: mockInfo1,
    expValidation: mockExpValidation,
    overallScores: null
};

export const mockComparisonData: any = [
  {
    ensembl_gene_id: 'ENSG00000147065',
    hgnc_symbol: 'MSN',
    search_string: 'MSN ENSG00000147065',
    nominations: 4,
    teams: [
      'Chang Lab',
      'Emory',
      'MSSM',
    ],
    studies: [
      'ROSMAP',
      'Kronos',
      'MSBB',
      'ACT',
      'BLSA',
      'Banner'
    ],
    input_datas: [
      'Genetics',
      'RNA',
      'Protein'
    ],
    year_first_nominated: 2018,
    tissues: [
      {
          name: 'CBE',
          logfc: -0.075,
          adj_p_val: 0.53,
          ci_l: -0.247449816301241,
          ci_r: 0.0971389419847545
      },
      {
          name: 'TCX',
          logfc: 0.45,
          adj_p_val: 0.0000048,
          ci_l: 0.275315930793305,
          ci_r: 0.625589807405099
      },
      {
          name: 'FP',
          logfc: 0.24,
          adj_p_val: 0.029,
          ci_l: 0.0813918568317721,
          ci_r: 0.390592278697809
      },
      {
          name: 'IFG',
          logfc: 0.39,
          adj_p_val: 0.000047,
          ci_l: 0.236604395922642,
          ci_r: 0.550622391282589
      },
      {
          name: 'PHG',
          logfc: 0.66,
          adj_p_val: 9.7e-14,
          ci_l: 0.506746460875332,
          ci_r: 0.818617289426068
      },
      {
          name: 'STG',
          logfc: 0.42,
          adj_p_val: 0.000017,
          ci_l: 0.26315969917125,
          ci_r: 0.57956742943308
      },
      {
          name: 'DLPFC',
          logfc: 0.035,
          adj_p_val: 0.6,
          ci_l: -0.0564780903179806,
          ci_r: 0.126466211626011
      },
      {
          name: 'ACC',
          logfc: -0.014,
          adj_p_val: 0.89,
          ci_l: -0.133332670728704,
          ci_r: 0.104397058381771
      },
      {
          name: 'PCC',
          logfc: 0.087,
          adj_p_val: 0.28,
          ci_l: -0.0292845799777793,
          ci_r: 0.203483129927133
      }
    ]
  },
  {
    ensembl_gene_id: 'ENSG00000178209',
    hgnc_symbol: 'PLEC',
    search_string: 'PLEC ENSG00000178209',
    nominations: 4,
    teams: [
       'Chang Lab',
       'Columbia-Rush',
       'Emory',
       'MSSM'
    ],
    studies: [
       'MSBB',
       'ROSMAP',
       'ACT',
       'BLSA',
       'Banner'
    ],
    input_datas: [
       'Genetics',
       'Protein',
       'Clinical'
    ],
    year_first_nominated: 2018,
    tissues: [
       {
          name: 'CBE',
          logfc: -0.036,
          adj_p_val: 0.73,
          ci_l: -0.176640226646977,
          ci_r: 0.103812651594111
       },
       {
          name: 'TCX',
          logfc: 0.6,
          adj_p_val: 1.2e-13,
          ci_l: 0.454692784021938,
          ci_r: 0.736277325347362
       },
       {
          name: 'FP',
          logfc: 0.19,
          adj_p_val: 0.076,
          ci_l: 0.038934911709087,
          ci_r: 0.340651136285662
       },
       {
          name: 'IFG',
          logfc: 0.26,
          adj_p_val: 0.0078,
          ci_l: 0.102064436841011,
          ci_r: 0.419987884451435
       },
       {
          name: 'PHG',
          logfc: 0.4,
          adj_p_val: 0.0000035,
          ci_l: 0.241983198003192,
          ci_r: 0.549601428542308
       },
       {
          name: 'STG',
          logfc: 0.29,
          adj_p_val: 0.0038,
          ci_l: 0.125255893461247,
          ci_r: 0.446665153833976
       },
       {
          name: 'DLPFC',
          logfc: 0.15,
          adj_p_val: 0.0045,
          ci_l: 0.0646999550099166,
          ci_r: 0.240815178272514
       },
       {
          name: 'ACC',
          logfc: 0.11,
          adj_p_val: 0.18,
          ci_l: -0.009454410852896,
          ci_r: 0.224848280194496
       },
       {
          name: 'PCC',
          logfc: 0.23,
          adj_p_val: 0.0014,
          ci_l: 0.110884607461715,
          ci_r: 0.339463182789717
       }
    ]
  },
  {
    ensembl_gene_id: 'ENSG00000078043',
    hgnc_symbol: 'PIAS2',
    search_string: 'PIAS2 ENSG00000078043',
    nominations: 0,
    teams: [],
    studies: [],
    input_datas: [],
    year_first_nominated: null,
    tissues: [
       {
          name: 'CBE',
          logfc: -0.24,
          adj_p_val: 9.4e-8,
          ci_l: -0.309983650090592,
          ci_r: -0.162119973107282
       },
       {
          name: 'TCX',
          logfc: -0.18,
          adj_p_val: 0.000031,
          ci_l: -0.252943348118746,
          ci_r: -0.101071384192308
       },
       {
          name: 'FP',
          logfc: -0.008,
          adj_p_val: 0.8,
          ci_l: -0.0430851552954826,
          ci_r: 0.0279056837931007
       },
       {
          name: 'IFG',
          logfc: -0.064,
          adj_p_val: 0.0048,
          ci_l: -0.101764830252282,
          ci_r: -0.0266592635584823
       },
       {
          name: 'PHG',
          logfc: -0.071,
          adj_p_val: 0.00042,
          ci_l: -0.107043385195657,
          ci_r: -0.0343425013554725
       },
       {
          name: 'STG',
          logfc: -0.052,
          adj_p_val: 0.027,
          ci_l: -0.090106374941481,
          ci_r: -0.0141666372907566
       },
       {
          name: 'DLPFC',
          logfc: -0.002,
          adj_p_val: 0.94,
          ci_l: -0.0320451713775502,
          ci_r: 0.0282482646670148
       },
       {
          name: 'ACC',
          logfc: 0.017,
          adj_p_val: 0.54,
          ci_l: -0.0201775097685951,
          ci_r: 0.0550950243183526
       },
       {
          name: 'PCC',
          logfc: -0.017,
          adj_p_val: 0.54,
          ci_l: -0.0555437126110491,
          ci_r: 0.0211914151124134
       }
    ]
  }
];