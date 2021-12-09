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
        hypothesis_tested: {
            required: true,
            type: String
        },
        summary_findings: {
            required: true,
            type: String
        },
        published: {
            required: true,
            type: String
        },
        species: {
            required: true,
            type: String
        },
        Model_system: {
            required: true,
            type: String
        },
        outcome_measure: {
            required: true,
            type: String
        },
        outcome_measure_details: {
            required: true,
            type: String
        },
        contributors: {
            required: true,
            type: String
        },
        team: {
            required: true,
            type: String
        },
        reference_doi: {
            required: false,
            type: String
        },
        date_report: {
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
