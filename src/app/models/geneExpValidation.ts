import { Document } from 'mongoose';

export interface GeneExpValidation {
    _id: string;
    ensembl_gene_id: string;
    hgnc_symbol: string;
    Hypothesis_tested: string;
    Summary_findings: string;
    Published: string;
    Species: string;
    Model_system: string;
    Outcome_measure: string;
    Outcome_measure_details: string;
    Contributors: string;
    Team: string;
    Reference_doi: string;
    Date_report: string;
}

export type GeneExpValidationDocument = GeneExpValidation & Document;
