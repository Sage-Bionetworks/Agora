export type GeneComparisonToolFilterOption = {
   label: string;
   value: any;
   selected?: boolean;
}

export type GeneComparisonToolFilter = {
   name: string;
   label: string;
   short?: string;
   matchMode?: string;
   options: GeneComparisonToolFilterOption[];
}