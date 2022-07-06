import { GCTGene, GCTGeneTissue } from 'app/models';

export const filterOptionLabel = function (
  value: string | number | string[] | number[]
) {
  let label = typeof value === 'string' ? value : value.toString(10);

  switch (label) {
    case 'and Late Onset Alzheimer&quot;s Disease Family Study':
      label = 'Late Onset Alzheimer&quot;s Disease Family Study';
  }

  return label.charAt(0).toUpperCase() + label.slice(1);
};

export const intersectFilterCallback = function (
  value: any,
  filters: any
): boolean {
  if (filters === undefined || filters === null || filters.length < 1) {
    return true;
  } else if (value === undefined || value === null || filters.length < 1) {
    return false;
  }

  for (const filter of filters) {
    if (value.indexOf(filter) !== -1) {
      return true;
    }
  }

  return false;
};

export const getDetailsPanelData = function (
  category: string,
  subCategory: string,
  gene: GCTGene,
  tissue: GCTGeneTissue
) {
  const data = {
    label: '',
    heading: '',
    subHeading: subCategory,
    valueLabel: 'Log 2 Fold Change',
    value: tissue.logfc,
    pValue: tissue.adj_p_val,
    min: parseFloat(tissue.ci_l.toPrecision(2)),
    max: parseFloat(tissue.ci_r.toPrecision(2)),
    footer: 'Significance is considered to be an adjusted p-value < 0.05',
  };

  if ('RNA - Differential Expression' === category) {
    data.label =
      (gene.hgnc_symbol ? gene.hgnc_symbol + ' - ' : '') + gene.ensembl_gene_id;
    data.heading = 'Differential RNA Expression (' + tissue.name + ')';
  } else if ('Protein - Differential Expression' === category) {
    data.label =
      (gene.hgnc_symbol ? gene.hgnc_symbol + ' ' : '') +
      (gene.uniprotid ? '(' + gene.uniprotid + ')' : '') +
      ' - ' +
      gene.ensembl_gene_id;
    data.heading = 'Differential Protein Expression (' + tissue.name + ')';
  }

  return data;
};
