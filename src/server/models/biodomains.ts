// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Schema, model } from 'mongoose';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { BioDomains, BioDomain } from '../../app/models';
export { BioDomains, BioDomain } from '../../app/models';

// -------------------------------------------------------------------------- //
// Schemas
// -------------------------------------------------------------------------- //
const BioDomainSchema = new Schema<BioDomain>({
  biodomain: { type: String, required: true },
  go_terms: { type: [String], required: true },
  n_biodomain_terms: { type: Number, required: true },
  n_gene_biodomain_terms: { type: Number, required: true },
  pct_linking_terms: { type: Number, required: true },
});

const BioDomainsSchema = new Schema<BioDomains>(
  {
    ensembl_gene_id: { type: String, required: true },
    gene_biodomains: { type: [BioDomainSchema], required: true },
  },
  { collection: 'genesbiodomains' }
);

// -------------------------------------------------------------------------- //
// Models
// -------------------------------------------------------------------------- //
export const BioDomainsCollection = model<BioDomains>(
  'BioDomainsCollection', 
  BioDomainsSchema
);
