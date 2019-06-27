import { Document } from 'mongoose';

export interface Metabolomics {
    'associated.gene.name': string;
    'ensembl.gene.id': string;
    'metabolite.id': string;
    'metabolite.full.name': string;
    'association.p': number;
    'gene.wide.p.threshold.1KGP': number;
    'n.per.group': number[];
    'boxplot.group.names': string[];
    'AD.diagnosis.p.value': number[];
    'transposed.boxplot.stats': number[][];
}

export type MetabolomicsDocument = Metabolomics & Document;
