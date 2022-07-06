import { GCTFilter, GCTSelectOption } from '../../../../models';

export const categories: GCTSelectOption[] = [
  {
    label: 'RNA - Differential Expression',
    value: 'RNA - Differential Expression',
  },
  {
    label: 'Protein - Differential Expression',
    value: 'Protein - Differential Expression',
  },
];

export const subCategories: { [key: string]: GCTSelectOption[] } = {
  'RNA - Differential Expression': [
    {
      label: 'AD Diagnosis (males and females)',
      value: 'AD Diagnosis (males and females)',
    },
    {
      label: 'AD Diagnosis x AOD (males and females)',
      value: 'AD Diagnosis x AOD (males and females)',
    },
    {
      label: 'AD Diagnosis x Sex (females only)',
      value: 'AD Diagnosis x Sex (females only)',
    },
    {
      label: 'AD Diagnosis x Sex (males only)',
      value: 'AD Diagnosis x Sex (males only)',
    },
  ],
  'Protein - Differential Expression': [
    {
      label: 'Label-free Quantification (LFQ)',
      value: 'Label-free Quantification (LFQ)',
    },
  ],
};

export const filters: GCTFilter[] = [
  {
    name: 'nominations',
    field: 'nominations.count',
    label: 'Number of Nominations',
    short: 'Nominations',
    description:
      'Filter for genes based on how many times they have been nominated as a potential target for AD.',
    matchMode: 'in',
    order: 'DESC',
    options: [],
  },
  {
    name: 'teams',
    field: 'nominations.teams',
    label: 'Nominating Teams',
    short: 'Team',
    description: 'Filter for genes based on the nominating research team.',
    matchMode: 'intersect',
    options: [],
  },
  {
    name: 'year',
    field: 'nominations.year',
    label: 'Year First Nominated',
    short: 'Year',
    description:
      'Filter for genes based on the year that they were first nominated as a potential target for AD.',
    matchMode: 'in',
    order: 'DESC',
    options: [],
  },
  {
    name: 'studies',
    field: 'nominations.studies',
    label: 'Cohort Study',
    short: 'Study',
    description:
      'Filter for genes based on which study or cohort the nominating research team analyzed to identify the gene as a potential target for AD.',
    matchMode: 'intersect',
    options: [],
  },
  {
    name: 'inputs',
    field: 'nominations.inputs',
    label: 'Input Data',
    short: 'Data',
    description:
      'Filter for genes based on the type of data that the nominating research team analyzed to identify the gene as a potential target for AD.',
    matchMode: 'intersect',
    options: [],
  },
  {
    name: 'programs',
    field: 'nominations.programs',
    label: 'Nominating Program',
    short: 'Nominating Program',
    description: 'Filter for genes based on the nominating program.',
    matchMode: 'intersect',
    options: [],
  },
  {
    name: 'validations',
    field: 'nominations.validations',
    label: 'Experimental Validation',
    short: 'Experimental Validation',
    description:
      'Filter for genes based on the experimental validation status indicated by the nominating team(s).',
    order: 'DESC',
    matchMode: 'intersect',
    options: [],
  },
  {
    name: 'associations',
    field: 'associations',
    label: 'Association with AD',
    short: 'Association with AD',
    description:
      'Filter for genes that are associated with AD based on GWAS, eQTL, and differential expression results.',
    matchMode: 'intersect',
    options: [
      {
        label: 'Genetically Associated with LOAD',
        value: 1,
      },
      {
        label: 'RNA Expression Changed in AD Brain',
        value: 2,
      },
      {
        label: 'Protein Expression Changed in AD Brain',
        value: 3,
      },
      {
        label: 'Protein Expression Changed in AD Brain',
        value: 4,
      },
    ],
  },
];
