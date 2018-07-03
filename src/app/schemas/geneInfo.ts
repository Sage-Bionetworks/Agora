import { Schema, Model, model } from 'mongoose';
import { GeneInfoDocument } from '../models';

export let GoMFSchema: Schema = new Schema (
    {
        category: {
            required: true,
            type: String
        },
        MF: {
            required: true,
            type: String
        },
        evidence: {
            required: true,
            type: String
        },
        id: {
            required: true,
            type: String
        },
        pubmed: {
            required: true,
            type: Number
        },
        term: {
            required: true,
            type: String
        }
    }, {
        timestamps: true
    }
);

export let MedianExpressionSchema: Schema = new Schema (
    {
        medianlogcpm: {
            required: true,
            type: Number
        },
        tissue: {
            required: true,
            type: String
        }
    }, {
        timestamps: true
    }
);

export let NominatedTargetSchema: Schema = new Schema (
    {
        team: {
            require: true,
            type: String
        },
        rank: {
            required: true,
            type: Number
        },
        target_choice_justification: {
            required: true,
            type: String
        },
        predicted_therapeutic_direction: {
            required: true,
            type: String
        },
        data_used_to_support_target_selection: {
            required: true,
            type: String
        },
        data_synapseid: {
            required: true,
            type: [String]
        }
    }, {
        timestamps: true
    }
);

export let GeneInfoSchema: Schema = new Schema(
    {
        'ensembl_gene_id': {
            required: true,
            type: String
        },
        'alias': {
            required: false,
            type: [String]
        },
        'name': {
            require: true,
            type: String
        },
        'summary': {
            required: false,
            type: String
        },
        'hgnc_symbol': {
            required: true,
            type: String
        },
        'type_of_gene': {
            required: true,
            type: String
        },
        'go.MF': {
            required: true,
            type: [GoMFSchema]
        },
        'isIGAP': {
            required: true,
            type: Boolean
        },
        'haseqtl': {
            required: true,
            type: Boolean
        },
        'medianexpression': {
            required: true,
            type: [MedianExpressionSchema]
        },
        'nominatedtarget': {
            required: true,
            type: [NominatedTargetSchema]
        },
        'nominations': {
            required: true,
            type: Number
        }
    }, {
        collection: 'geneinfo',
        timestamps: true
    }
);

GeneInfoSchema.set('autoIndex', false);
GeneInfoSchema.index(
    {
        hgnc_symbol: 'text',
        ensembl_gene_id: 'text'
    }
);

// Mongoose forces a lowcase name for collections when using the queries
export const GenesInfo: Model<GeneInfoDocument> =
                model<GeneInfoDocument>('geneinfo', GeneInfoSchema);
