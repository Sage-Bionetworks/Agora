import { Schema, Model, model } from 'mongoose';
import { GeneExpValidationDocument } from '../models';

export const GeneExpValidationSchema = new Schema(
    {
        ensembl_gene_id: {
            required: true,
            type: String
        },
        hgnc_symbol: {
            required: true,
            type: String
        },
        Hypothesis_tested: {
            required: true,
            type: String
        },
        Summary_findings: {
            required: true,
            type: String
        },
        Published: {
            required: true,
            type: String
        },
        Species: {
            required: true,
            type: String
        },
        Model_system: {
            required: true,
            type: String
        },
        Outcome_measure: {
            required: true,
            type: String
        },
        Outcome_measure_details: {
            required: true,
            type: String
        },
        Contributors: {
            required: true,
            type: String
        },
        Team: {
            required: true,
            type: String
        },
        Reference_doi: {
            required: false,
            type: String
        },
        Date_report: {
            required: true,
            type: String
        },
    }, {
        collection: 'geneexpvalidation',
        timestamps: true
    });

GeneExpValidationSchema.set('autoIndex', false);
GeneExpValidationSchema.index(
    {
        hgnc_symbol: 'text',
        ensembl_gene_id: 'text',
    }
);

export const GenesExperimentalValidation: Model<GeneExpValidationDocument> =
    model<GeneExpValidationDocument>('geneexpvalidation', GeneExpValidationSchema);
