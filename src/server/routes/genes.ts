// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Schema, model } from 'mongoose';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { cache } from '../cache';
import { setHeaders } from '../helpers';
import {
  getRnaDifferentialExpression,
  getGeneProteomics,
  getGeneMetabolomics,
  getGeneExperimentalValidation,
  getGeneNeuropathCorrelations,
  getGeneOverallScores,
  getGeneLinks,
} from '.';

// -------------------------------------------------------------------------- //
// Schemas
// -------------------------------------------------------------------------- //

const GenesSchema = new Schema(
  {
    ensembl_gene_id: String,
    hgnc_symbol: String,
    alias: Array,
    nominations: Number,
  },
  { collection: 'geneinfo' }
);
export const GenesCollection = model('GenesCollection', GenesSchema);

// -------------------------------------------------------------------------- //
// Genes
// -------------------------------------------------------------------------- //

let genes: any = [];

export async function _getGenes() {
  try {
    // let result: any = cache.get('genes');

    // if (result) {
    //   return result;
    // }

    if (genes > 0) {
      return genes;
    }

    const result = await GenesCollection.find()
      .lean()
      .sort({ hgnc_symbol: 1, ensembl_gene_id: 1 })
      .exec();

    //cache.set('genes', result);
    genes = result;
    return result;
  } catch (err) {
    //handleError(err);
    console.error(err);
    return;
  }
}

export async function getGenes(ids?: string) {
  const _genes = await _getGenes();

  if (ids && ids.length > 0) {
    const idsArr: any = ids.split(',');
    return _genes.filter((gene: any) => idsArr.includes(gene.ensembl_gene_id));
  } else {
    return _genes;
  }
}

let genesMap: any = [];

export async function genesRoute(req: any, res: any) {
  const genes = await getGenes(req.query.ids);
  setHeaders(res);
  res.json(genes);
}

export async function getGenesMap() {
  try {
    // let result: any = cache.get('genes-map');

    // if (result) {
    //   return result;
    // }

    if (genesMap.length > 0) {
      return genesMap;
    }

    let result: any = await getGenes();
    result = new Map(result.map((g: any) => [g.ensembl_gene_id, g]));

    //cache.set('genes-map', result);
    genesMap = result;
    return result;
  } catch (err) {
    //handleError(err);
    console.error(err);
    return;
  }
}

export async function getGene(ensg: string) {
  try {
    let result: any = cache.get('gene-' + ensg);

    if (result) {
      return result;
    }

    result = await GenesCollection.findOne({
      ensembl_gene_id: ensg,
    }).lean();

    if (result) {
      result.rna_differential_expression = await getRnaDifferentialExpression(
        ensg
      );

      result.proteomics_evidence = {
        differential_expression: await getGeneProteomics(ensg),
      };
      result.metabolomics = await getGeneMetabolomics(ensg);
      result.overall_scores = await getGeneOverallScores(ensg);
      result.experimentalValidation = await getGeneExperimentalValidation(ensg);
      result.neuropathCorrelations = await getGeneNeuropathCorrelations(ensg);
      result.links = await getGeneLinks(ensg);
    }

    cache.set('gene-' + ensg, result);
    return result;
  } catch (err) {
    //handleError(err);
    console.error(err);
    return;
  }
}

export async function geneRoute(req: any, res: any) {
  if (!req.params || !req.params.id) {
    res.status(404).send('Not found');
    return;
  }

  const id = req.params.id.trim();
  const gene = await getGene(id);

  setHeaders(res);
  res.json(gene);
}

export function searchGeneRoute(req: any, res: any) {
  if (!req.params || !req.query || !req.query.id) {
    res.status(404).send('Not found');
    return;
  }

  const id = req.query.id.trim();
  const isEnsembl = id.startsWith('ENSG');
  let query = null;

  if (isEnsembl) {
    if (id.length == 15) {
      query = { ensembl_gene_id: id };
    } else {
      query = { ensembl_gene_id: { $regex: id, $options: 'i' } };
    }
  } else {
    query = {
      $or: [
        {
          hgnc_symbol: { $regex: id, $options: 'i' },
        },
        {
          alias: new RegExp('^' + id + '$', 'i'),
        },
      ],
    };
  }

  GenesCollection.find(query)
    .lean()
    .exec((err, items) => {
      if (err) return; //handleError(err);
      setHeaders(res);
      res.json({ items: items || [], isEnsembl });
    });
}

let nominatedGenes: any = [];

export async function getNominatedGenes() {
  try {
    // let result: any = cache.get('genes');

    // if (result) {
    //   return result;
    // }

    if (nominatedGenes > 0) {
      return nominatedGenes;
    }

    const result = await GenesCollection.find({ nominations: { $gt: 0 } })
      .select(
        [
          'hgnc_symbol',
          'ensembl_gene_id',
          'nominations',
          'nominatedtarget.initial_nomination',
          'nominatedtarget.team',
          'nominatedtarget.study',
          'nominatedtarget.input_data',
          'nominatedtarget.validation_study_details',
          'druggability.pharos_class',
          'druggability.sm_druggability_bucket',
          'druggability.classification',
          'druggability.safety_bucket',
          'druggability.safety_bucket_definition',
          'druggability.abability_bucket',
          'druggability.abability_bucket_definition',
        ].join(' ')
      )
      .lean()
      .sort({ nominations: -1, hgnc_symbol: 1 })
      .exec();

    //cache.set('genes', result);
    nominatedGenes = result;
    return result;
  } catch (err) {
    //handleError(err);
    console.error(err);
    return;
  }
}

export async function geneTableRoute(req: any, res: any) {
  // if (!req.params || !req.params.id) {
  //   res.status(404).send('Not found');
  //   return;
  // }

  setHeaders(res);
  res.json(await getNominatedGenes());
}
