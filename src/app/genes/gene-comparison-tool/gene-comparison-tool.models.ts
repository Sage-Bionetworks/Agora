import { SelectItem } from 'primeng/api';
import { MedianExpression } from '../../models';

export interface GCTGeneTissue {
   name: string;
   logfc: number;
   adj_p_val: number;
   ci_l: number;
   ci_r: number;
   medianexpression?: MedianExpression;
}

export interface GCTGene {
   ensembl_gene_id: string;
   hgnc_symbol: string;
   tissues: GCTGeneTissue[];
}

export interface GCTSelectOption extends SelectItem {
   label?: string;
   value: any;
   disabled?: boolean;

   name?: string;
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
