import { Document } from 'mongoose';

export interface GeneExpValidation {
    _id: string;
    ensembl_gene_id: string;
    hgnc_symbol: string;
    hypothesis_tested: string;
    summary_findings: string;
    published: string;
    species: string;
    model_system: string;
    outcome_measure: string;
    outcome_measure_details: string;
    contributors: string;
    team: string;
    reference_doi: string;
    date_report: string;
}

export type GeneExpValidationDocument = GeneExpValidation & Document;
