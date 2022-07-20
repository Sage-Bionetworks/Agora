// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Request, Response, NextFunction } from 'express';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { cache } from '../cache';
import { setHeaders } from '../helpers';
import { getGenesMap, getTeams } from './';
import {
  Gene,
  GCTGene,
  GCTGeneNominations,
  RnaDifferentialExpression,
  RnaDifferentialExpressionCollection,
  ProteinDifferentialExpression,
  ProteinLFQCollection,
  ProteinTMTCollection,
  Team,
} from '../models';
import { NominatedTarget } from '../../app/models';

// -------------------------------------------------------------------------- //
// Functions
// -------------------------------------------------------------------------- //

function getComparisonGeneAssociations(gene: Gene) {
  const data = [];

  // Genetically Associated with LOAD
  if (gene.isIGAP) {
    data.push(1);
  }

  // eQTL in Brain
  if (gene.haseqtl) {
    data.push(2);
  }

  // RNA Expression Changed in AD Brain
  if (gene.rna_brain_change_studied && gene.isAnyRNAChangedInADBrain) {
    data.push(3);
  }

  // Protein Expression Changed in AD Brain
  if (gene.protein_brain_change_studied && gene.isAnyProteinChangedInADBrain) {
    data.push(4);
  }

  return data;
}

function getComparisonGeneNominations(gene: Gene, teams: Team[]) {
  const data: GCTGeneNominations = {
    count: gene.nominations || 0,
    year: 0,
    teams: [],
    studies: [],
    inputs: [],
    programs: [],
    validations: [],
  };

  gene.nominatedtarget?.forEach((n: NominatedTarget) => {
    // Year
    if (
      n.initial_nomination &&
      (!data.year || n.initial_nomination < data.year)
    ) {
      data.year = n.initial_nomination;
    }

    // Team / Programs
    if (n.team) {
      const team = teams.find((item: Team) => item.team === n.team);

      if (team && !data.programs.includes(team.program)) {
        data.programs.push(team.program);
      }

      data.teams.push(n.team);
    }

    // Studies
    if (n.study) {
      n.study.split(', ').forEach((item: string) => {
        if (!data.studies.includes(item)) {
          data.studies.push(item);
        }
      });
    }

    // Inputs
    if (n.input_data) {
      n.input_data.split(', ').forEach((item: string) => {
        if (!data.inputs.includes(item)) {
          data.inputs.push(item);
        }
      });
    }

    // Validations
    if (
      n.validation_study_details &&
      !data.validations.includes(n.validation_study_details)
    ) {
      data.validations.push(n.validation_study_details.trim());
    }
  });

  return data;
}

function getComparisonGene(gene: Gene, teams: Team[]) {
  const data: GCTGene = {
    ensembl_gene_id: gene.ensembl_gene_id || '',
    hgnc_symbol: gene.hgnc_symbol || '',
    tissues: [],
    nominations: getComparisonGeneNominations(gene, teams),
    associations: getComparisonGeneAssociations(gene),
  };

  return data;
}

const rnaComparisonGenes: { [key: string]: GCTGene[] } = {};

export async function getRnaComparisonGenes(model: string) {
  //const cacheKey = 'rna-comparison-' + model.replace(/[^a-z0-9]/gi, '');

  let result = rnaComparisonGenes[model]; // cache.get(cacheKey);

  if (result?.length) {
    return result;
  }

  const differentialExpression: RnaDifferentialExpression[] =
    await RnaDifferentialExpressionCollection.find({
      model: model,
    })
      .lean()
      .sort({ hgnc_symbol: 1, tissue: 1 })
      .exec();

  if (differentialExpression) {
    const genes: { [key: string]: GCTGene } = {};
    const allGenes = await getGenesMap();
    const teams = await getTeams();

    differentialExpression.forEach((exp: RnaDifferentialExpression) => {
      if (!genes[exp.ensembl_gene_id]) {
        const gene: Gene =
          allGenes.get(exp.ensembl_gene_id) ||
          ({
            ensembl_gene_id: exp.ensembl_gene_id || '',
            hgnc_symbol: exp.hgnc_symbol || '',
          } as Gene);
        genes[exp.ensembl_gene_id] = getComparisonGene(gene, teams);
      }

      genes[exp.ensembl_gene_id].tissues.push({
        name: exp.tissue,
        logfc: exp.logfc,
        adj_p_val: exp.adj_p_val,
        ci_l: exp.ci_l,
        ci_r: exp.ci_r,
      });
    });

    result = Object.values(genes);
  }

  // cache.set(cacheKey, result);
  rnaComparisonGenes[model] = result;
  return result;
}

const proteinComparisonGenes: { [key: string]: GCTGene[] } = {};

export async function getProteinComparisonGenes(method: string) {
  //const cacheKey = 'rna-comparison-' + model.replace(/[^a-z0-9]/gi, '');

  let result = proteinComparisonGenes[method]; // cache.get(cacheKey);

  if (result?.length) {
    return result;
  }

  let items: ProteinDifferentialExpression[] = [];

  if ('TMT' === method) {
    items = await ProteinTMTCollection.find()
      .lean()
      .sort({ hgnc_symbol: 1, tissue: 1 })
      .exec();
  } else {
    items = await ProteinLFQCollection.find()
      .lean()
      .sort({ hgnc_symbol: 1, tissue: 1 })
      .exec();
  }

  if (items) {
    const genes: { [key: string]: GCTGene } = {};
    const allGenes = await getGenesMap();
    const teams = await getTeams();

    items.forEach((item: ProteinDifferentialExpression) => {
      if (!genes[item.uniqid]) {
        const gene: Gene =
          allGenes.get(item.ensembl_gene_id) ||
          ({
            ensembl_gene_id: item.ensembl_gene_id || '',
            hgnc_symbol: item.hgnc_symbol || '',
          } as Gene);
        genes[item.uniqid] = getComparisonGene(gene, teams);
        genes[item.uniqid].uniprotid = item.uniprotid;
      }

      genes[item.uniqid].tissues.push({
        name: item.tissue,
        logfc: item.log2_fc,
        adj_p_val: item.cor_pval,
        ci_l: item.ci_lwr,
        ci_r: item.ci_upr,
      });
    });

    result = Object.values(genes);
  }

  // cache.set(cacheKey, result);
  proteinComparisonGenes[method] = result;
  return result;
}

// -------------------------------------------------------------------------- //
// Routes
// -------------------------------------------------------------------------- //

export async function comparisonGenesRoute(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (
    !req.query ||
    !req.query.category ||
    typeof req.query.category !== 'string' ||
    !req.query.subCategory ||
    typeof req.query.subCategory !== 'string'
  ) {
    res.status(404).send('Not found');
    return;
  }

  try {
    let items: GCTGene[] = [] as GCTGene[];

    if ('RNA - Differential Expression' === req.query.category) {
      items = await getRnaComparisonGenes(req.query.subCategory);
    } else if ('Protein - Differential Expression' === req.query.category) {
      items = await getProteinComparisonGenes(req.query.subCategory);
    }

    setHeaders(res);
    res.json({ items });
  } catch (err) {
    next(err);
  }
}
