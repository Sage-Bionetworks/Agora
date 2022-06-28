// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Request, Response, NextFunction } from 'express';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { cache } from '../cache';
import { setHeaders } from '../helpers';
import { getGenesMap } from './';
import {
  RnaDifferentialExpression,
  RnaDifferentialExpressionCollection,
  RnaDifferentialExpressionDistribution,
  RnaDifferentialExpressionDistributionCollection,
} from '../models';

// -------------------------------------------------------------------------- //
// Differential Expression
// -------------------------------------------------------------------------- //

export async function getRnaDifferentialExpression(ensg: string) {
  const cacheKey = ensg + '-rna-differential-expression';
  let result: RnaDifferentialExpression[] | undefined = cache.get(cacheKey);

  if (result) {
    return result;
  }

  result = await RnaDifferentialExpressionCollection.find({
    ensembl_gene_id: ensg,
  })
    .lean()
    .sort({ hgnc_symbol: 1, tissue: 1, model: 1 })
    .exec();

  if (result) {
    const models: { [key: string]: string[] } = {};

    // Filter out duplicates
    result = result.filter((item: any) => {
      if (!models[item['model']]) {
        models[item['model']] = [];
      }

      if (!models[item['model']].includes(item['tissue'])) {
        models[item['model']].push(item['tissue']);
        return true;
      }

      return false;
    });
  }

  cache.set(cacheKey, result);
  return result;
}

export async function getRnaDifferentialExpressionDistribution() {
  const cacheKey = 'rna-differential-expression-distribution';
  let result: RnaDifferentialExpressionDistribution[] | undefined =
    cache.get(cacheKey);

  if (result) {
    return result;
  }

  result = await RnaDifferentialExpressionDistributionCollection.find()
    .lean()
    .exec();

  cache.set(cacheKey, result);
  return result;
}

export async function getRnaDifferentialExpressionByModel(model: string) {
  const modelKey = model.replace(/[^a-z0-9]/gi, '');

  let result: RnaDifferentialExpression[] | undefined = cache.get(
    'rna-differential-expression-' + modelKey
  );

  if (result) {
    return result;
  }

  result = await RnaDifferentialExpressionCollection.find({
    model: model,
  })
    .lean()
    .sort({ hgnc_symbol: 1, tissue: 1 })
    .exec();

  if (result) {
    const genesMap = await getGenesMap();
    let grouped: any = {};

    result.forEach((item: any) => {
      if (!grouped[item.ensembl_gene_id]) {
        const _item: any = {
          ensembl_gene_id: item.ensembl_gene_id || '',
          hgnc_symbol: item.hgnc_symbol || '',
          search_string: '',
          nominations: 0,
          teams: [],
          studies: [],
          input_datas: [],
          year_first_nominated: null,
          tissues: [],
        };

        const gene = genesMap.get(item.ensembl_gene_id);

        if (gene) {
          _item.hgnc_symbol = gene.hgnc_symbol;
          _item.search_string = gene.hgnc_symbol + ' ' + gene.ensembl_gene_id;
          _item.nominations = gene.nominations || 0;

          if (gene.nominatedtarget?.length) {
            for (const nominated of gene.nominatedtarget) {
              if (nominated.team) {
                _item.teams.push(nominated.team);
              }

              if (nominated.study) {
                nominated.study.split(', ').forEach((study: any) => {
                  _item.studies.push(study || '');
                });
              }

              if (nominated.input_data) {
                nominated.input_data.split(', ').forEach((inputData: any) => {
                  _item.input_datas.push(inputData);
                });
              }

              if (nominated.initial_nomination) {
                if (
                  !_item.year_first_nominated ||
                  nominated.initial_nomination < _item.year_first_nominated
                ) {
                  _item.year_first_nominated = nominated.initial_nomination;
                }
              }
            }
          }

          if (gene.medianexpression) {
            for (const medianExp of gene.medianexpression) {
              const tissue = _item.tissues.find(
                (t: any) => t.name === medianExp.tissue
              );
              if (tissue) {
                tissue.medianexpression = {
                  medianlogcpm: medianExp.medianlogcpm,
                  minimumlogcpm: medianExp.minimumlogcpm,
                  maximumlogcpm: medianExp.maximumlogcpm,
                };
              }
            }
          }
        }

        grouped[item.ensembl_gene_id] = _item;
      }

      grouped[item.ensembl_gene_id].tissues.push({
        name: item.tissue,
        logfc: item.logfc,
        adj_p_val: item.adj_p_val,
        ci_l: item.ci_l,
        ci_r: item.ci_r,
      });
    });

    grouped = Object.values(grouped);

    return grouped;
  }

  cache.set('rna-differential-expression-' + modelKey, result);
  return result;
}

export async function comparisonDataRoute(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.query || !req.query.model || typeof req.query.model != 'string') {
    res.status(404).send('Not found');
    return;
  }

  try {
    const model = req.query.model.trim();
    const data = await getRnaDifferentialExpressionByModel(model);
    setHeaders(res);
    res.json(data);
  } catch (err) {
    next(err);
  }
}
