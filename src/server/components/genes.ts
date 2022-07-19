// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { cache } from '../cache';
import { setHeaders } from '../helpers';
import { Gene, GeneCollection } from '../models';
import {
  getRnaDifferentialExpression,
  getProteinDifferentialExpression,
  getMetabolomics,
  getExperimentalValidation,
  getNeuropathologicCorrelations,
  getOverallScores,
  getGeneLinks,
} from '.';

// -------------------------------------------------------------------------- //
// Functions
// -------------------------------------------------------------------------- //

let allGenes: Gene[] = [];

export async function getAllGenes() {
  if (allGenes.length) {
    return allGenes;
  }

  allGenes = await GeneCollection.find()
    .lean()
    .sort({ hgnc_symbol: 1, ensembl_gene_id: 1 })
    .exec();

  return allGenes;

  // let result: Gene[] | undefined = cache.get('genes');

  // if (result) {
  //   return result;
  // }

  // result = await GeneCollection.find()
  //   .lean()
  //   .sort({ hgnc_symbol: 1, ensembl_gene_id: 1 })
  //   .exec();

  // cache.set('genes', result);
  // return result;
}

export async function getGenes(ids?: string | string[]) {
  const genes: Gene[] = await getAllGenes();

  if (ids) {
    ids = typeof ids == 'string' ? ids.split(',') : ids;
    return genes.filter((g: Gene) => ids?.includes(g.ensembl_gene_id));
  }

  return genes;
}

export async function getGenesMap() {
  const genes = await getGenes();
  return new Map(genes.map((g: Gene) => [g.ensembl_gene_id, g]));
}

export async function getGene(ensg: string) {
  const cacheKey = ensg + '-gene';
  let result: Gene | null | undefined = cache.get(cacheKey);

  if (result) {
    return result;
  }

  result = await GeneCollection.findOne({
    ensembl_gene_id: ensg,
  })
    .lean()
    .exec();

  if (result) {
    result.rna_differential_expression = await getRnaDifferentialExpression(
      ensg
    );
    result.protein_differential_expression =
      await getProteinDifferentialExpression(ensg);
    result.metabolomics = await getMetabolomics(ensg);
    result.neuropathologic_correlations = await getNeuropathologicCorrelations(
      ensg
    );
    result.overall_scores = await getOverallScores(ensg);
    result.experimental_validation = await getExperimentalValidation(ensg);
    result.links = await getGeneLinks(ensg);
  }

  cache.set(cacheKey, result);
  return result;
}

// -------------------------------------------------------------------------- //
// Routes
// -------------------------------------------------------------------------- //

export async function genesRoute(req: any, res: any) {
  const genes = await getGenes(req.query.ids);
  setHeaders(res);
  res.json(genes);
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

// -------------------------------------------------------------------------- //
// TO CLEAN
// -------------------------------------------------------------------------- //

export function searchGeneRoute(req: any, res: any) {
  if (!req.params || !req.query || !req.query.id) {
    res.status(404).send('Not found');
    return;
  }

  const id = req.query.id.trim();
  const isEnsembl = id.startsWith('ENSG');
  let query: { [key: string]: any } | null = null;

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

  GeneCollection.find(query)
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

    const result = await GeneCollection.find({ nominations: { $gt: 0 } })
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
