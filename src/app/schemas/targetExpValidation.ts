import { Schema, Model, model } from 'mongoose';
import { TargetExpValidationDocument } from '../models';

export const TargetExpValidationSchema = new Schema(
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
        'Published?': {
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
        Date_report: {
            required: true,
            type: String
        },
    }, {
        collection: 'targetexpvalidation',
        timestamps: true
    })

TargetExpValidationSchema.set('autoIndex', false);
TargetExpValidationSchema.index(
    {
        hgnc_symbol: 'text',
        ensembl_gene_id: 'text',
    }
);

export const TargetExpValidations: Model<TargetExpValidationDocument> =
    model<TargetExpValidationDocument>('targetexpvalidation', TargetExpValidationSchema);
