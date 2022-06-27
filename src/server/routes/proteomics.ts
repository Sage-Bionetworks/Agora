// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Schema, model } from 'mongoose';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { cache } from '../cache';

// -------------------------------------------------------------------------- //
// Schemas
// -------------------------------------------------------------------------- //

const ProteomicsSchema = new Schema(
  {
    ensembl_gene_id: String,
    hgnc_symbol: String,
  },
  { collection: 'genesproteomics' }
);
const ProteomicsCollection = model('ProteomicsCollection', ProteomicsSchema);

// -------------------------------------------------------------------------- //
// Functions
// -------------------------------------------------------------------------- //

export async function getGeneProteomics(ensg: string) {
  try {
    let result: any = cache.get('proteomics-' + ensg);

    if (result) {
      return result;
    }

    result = await ProteomicsCollection.find({
      ensembl_gene_id: ensg,
    })
      .lean()
      .exec();

    if (result) {
      result = result.filter((item: any) => {
        return item.log2_fc /*&& p.uniprotid === filter*/;
      });
    }

    cache.set('proteomics-' + ensg, result);
    return result;
  } catch (err) {
    //handleError(err);
    console.error(err);
    return;
  }
}
