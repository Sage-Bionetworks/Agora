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

const GeneLinksSchema = new Schema(
  {
    geneA_ensembl_gene_id: String,
    geneB_ensembl_gene_id: String,
    alias: Array,
  },
  { collection: 'geneslinks' }
);
const GeneLinksCollection = model('GeneLinksCollection', GeneLinksSchema);

// -------------------------------------------------------------------------- //
//
// -------------------------------------------------------------------------- //

export async function getGeneLinks(ensg: string) {
  try {
    let result: any = cache.get('gene-links-' + ensg);

    if (result) {
      return result;
    }

    const listA = await GeneLinksCollection.find({
      geneA_ensembl_gene_id: ensg,
    })
      .lean()
      .exec();
    if (!listA) {
      return;
    }

    const listB = await GeneLinksCollection.find({
      geneB_ensembl_gene_id: ensg,
    })
      .lean()
      .exec();
    if (!listB) {
      return;
    }

    const ids = [
      ...listA.map((link) => {
        return link.geneB_ensembl_gene_id;
      }),
      ...listB.map((link) => {
        return link.geneA_ensembl_gene_id;
      }),
    ];

    const listC = await GeneLinksCollection.find({
      $and: [
        { geneA_ensembl_gene_id: { $in: ids } },
        { geneB_ensembl_gene_id: { $in: ids } },
      ],
    })
      .lean()
      .exec();
    if (!listC) {
      return;
    }

    result = [...listA, ...listB, ...listC];
    cache.set('gene-links-' + ensg, result);
    return result;
  } catch (err) {
    //handleError(err);
    console.error(err);
    return;
  }
}

export async function geneLinksRoute(req: any, res: any) {
  GeneLinksCollection.find({ geneA_ensembl_gene_id: req.query.id })
    .lean()
    .exec(async (err, links) => {
      const arrA = links.slice().map((slink) => {
        return slink.geneB_ensembl_gene_id;
      });

      // identify all genes related to the related genes identified above
      GeneLinksCollection.find(
        { geneB_ensembl_gene_id: req.query.id },
        async (errB: any, linkB: any) => {
          const arrB = linkB.slice().map((slink: any) => {
            return slink.toJSON()['geneA_ensembl_gene_id'];
          });
          const arr = [...arrA, ...arrB];

          // identify all genes related to the related genes identified above
          await GeneLinksCollection.find({
            geneA_ensembl_gene_id: { $in: arr },
          })
            .lean()
            .where('geneB_ensembl_gene_id')
            .in(arr)
            .exec((errC, linksC) => {
              if (errC) {
                //next(errC);
              } else {
                const flinks = [...links, ...linkB, ...linksC];
                res.setHeader(
                  'Cache-Control',
                  'no-cache, no-store, must-revalidate'
                );
                res.setHeader('Pragma', 'no-cache');
                res.setHeader('Expires', 0);
                res.json({ items: flinks });
              }
            });
        }
      );
    });
}
