export interface GCTGeneTissue {
   name: string;
   logfc: number;
   adj_p_val: number;
   ci_l: number;
   ci_r: number;
   medianlogcpm: number;
}

export interface GCTGene {
   ensembl_gene_id: string;
   hgnc_symbol: string;
   tissues: GCTGeneTissue[];
   minMedianLogcpm?: number;
   maxMedianLogcpm?: number;
}

export interface GCTSelectOption {
   name: string;
   value?: any;
}

export interface GCTFilterOption {
   label: string;
   value: any;
   selected?: boolean;
}

export interface GCTFilter {
   name: string;
   label: string;
   short?: string;
   matchMode?: string;
   options: GCTFilterOption[];
}

export interface GCDetailsPanelData {
   label?: string;
   heading?: string;
   subHeading?: string;
   value?: number;
   valueLabel?: string;
   pValue?: number;
   min?: number;
   max?: number;
   footer?: string;
}
