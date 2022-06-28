export interface RnaDifferentialExpression {
  _id: string;
  ensembl_gene_id: string;
  hgnc_symbol: string;
  logfc: number;
  fc: number;
  ci_l: number;
  ci_r: number;
  adj_p_val: number;
  tissue: string;
  study: string;
  model: string;
}

export interface RnaDifferentialExpressionDistribution {
  _id: string;
  model: string;
  tissue: string;
  min: number;
  max: number;
  first_quartile: number;
  median: number;
  third_quartile: number;
}
