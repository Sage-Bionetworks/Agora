import { Schema, Model, model } from 'mongoose';
import { MetabolomicsDocument } from '../models';

export let MetabolomicsSchema: Schema = new Schema (
    {
        'associated.gene.name': {
            required: true,
            type: String
        },
        'ensembl.gene.id': {
            required: true,
            type: String
        },
        'metabolite.id': {
            required: true,
            type: String
        },
        'metabolite.full.name': {
            required: true,
            type: String
        },
        'association.p': {
            required: true,
            type: Number
        },
        'gene.wide.p.threshold.1KGP': {
            required: true,
            type: Number
        },
        'n.per.group': {
            required: false,
            type: [Number]
        },
        'boxplot.group.names': {
            required: false,
            type: [String]
        },
        'AD.diagnosis.p.value': {
            required: false,
            type: [Number]
        },
        'transposed.boxplot.stats': {
            required: false,
            type: [[Number]]
        }
    }, {
        timestamps: true
    }
);

MetabolomicsSchema.set('autoIndex', false);
MetabolomicsSchema.index(
    {
        'metabolite.id': 'text',
        'ensembl.gene.id': 'text'
    }
);

// Mongoose forces a lowcase name for collections when using the queries
export const GenesMetabolomics: Model<MetabolomicsDocument> =
                model<MetabolomicsDocument>('genesmetabolomics', MetabolomicsSchema);
