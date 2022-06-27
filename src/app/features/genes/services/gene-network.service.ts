import { Injectable } from '@angular/core';

import { GeneInfo } from '../models';

@Injectable()
export class GeneNetworkService {
  gene: GeneInfo = {} as GeneInfo;

  nodes: any = [];
  nodeGroups: any = [];
  nodeMap: any = {};

  links: any = [];
  linkMap: any = {};

  maxEdges = 0;

  constructor() {}

  reset() {
    this.nodeMap = {};
    this.nodes = [];
    this.nodeGroups = [];
    this.links = [];
    this.linkMap = {};
  }

  build(gene: GeneInfo) {
    this.reset();
    this.gene = gene;

    const node = {
      id: gene.ensembl_gene_id,
      ensembl_gene_id: gene.ensembl_gene_id,
      group: 1,
      hgnc_symbol: gene.hgnc_symbol,
      brainregions: [],
    };
    this.nodeMap[gene.ensembl_gene_id] = node;
    this.nodes = [node];

    gene.links?.forEach((obj: any) => {
      this.processNode(obj);
      this.processLink(obj);
    });

    this.links.sort((a: any, b: any) => {
      return a['value'] - b['value'];
    });

    return {
      links: this.links,
      nodes: this.nodes,
      origin: this.gene,
      maxEdges: this.maxEdges,
    };
  }

  processBrainRegion(node: any) {
    node.brainregions.sort();
    const key = node.brainregions.join('');
    if (!this.nodeGroups[key]) {
      this.nodeGroups[key] = {};
      this.nodeGroups[key].value = Object.keys(this.nodeGroups).length + 1;
    }
    this.nodeMap[node.id].group = this.nodeGroups[key].value;
  }

  processNode(link: any) {
    // Nodes from selected Gene
    if (
      link.geneB_ensembl_gene_id &&
      !this.nodeMap[link.geneB_ensembl_gene_id]
    ) {
      const node: any = {
        id: link.geneB_ensembl_gene_id,
        ensembl_gene_id: link.geneB_ensembl_gene_id,
        group: 1,
        hgnc_symbol: link.geneB_external_gene_name,
        brainregions: [link.brainRegion],
      };
      this.nodeMap[link.geneB_ensembl_gene_id] = node;
      this.nodes = [...this.nodes, node];
      this.processBrainRegion(node);
    }
    // Nodes to selected Gene
    if (
      link.geneA_ensembl_gene_id &&
      !this.nodeMap[link.geneA_ensembl_gene_id]
    ) {
      const node: any = {
        id: link.geneA_ensembl_gene_id,
        ensembl_gene_id: link.geneA_ensembl_gene_id,
        group: 1,
        hgnc_symbol: link.geneA_external_gene_name,
        brainregions: [link.brainRegion],
      };
      this.nodeMap[link.geneA_ensembl_gene_id] = node;
      this.nodes = [...this.nodes, node];
      this.processBrainRegion(node);
    }
  }

  processLink(obj: any) {
    if (
      !!this.linkMap[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id] ||
      !!this.linkMap[obj.geneB_ensembl_gene_id + obj.geneA_ensembl_gene_id]
    ) {
      // check A - B link and add region.
      if (
        !!this.linkMap[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id] &&
        this.linkMap[
          obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id
        ].brainregions.indexOf(obj.brainRegion) === -1
      ) {
        this.linkMap[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id]
          .value++;
        this.linkMap[
          obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id
        ].brainregions.push(obj.brainRegion);
        if (
          this.gene.ensembl_gene_id === obj.geneA_ensembl_gene_id ||
          this.gene.ensembl_gene_id === obj.geneB_ensembl_gene_id
        ) {
          if (
            this.linkMap[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id]
              .value > this.maxEdges
          ) {
            this.maxEdges =
              this.linkMap[
                obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id
              ].value;
          }
        }
      }

      // check B - A link and add region.
      if (
        !!this.linkMap[obj.geneB_ensembl_gene_id + obj.geneA_ensembl_gene_id] &&
        this.linkMap[
          obj.geneB_ensembl_gene_id + obj.geneA_ensembl_gene_id
        ].brainregions.indexOf(obj.brainRegion) === -1
      ) {
        this.linkMap[obj.geneB_ensembl_gene_id + obj.geneA_ensembl_gene_id]
          .value++;
        this.linkMap[
          obj.geneB_ensembl_gene_id + obj.geneA_ensembl_gene_id
        ].brainregions.push(obj.brainRegion);
        if (
          this.gene.ensembl_gene_id === obj.geneA_ensembl_gene_id ||
          this.gene.ensembl_gene_id === obj.geneB_ensembl_gene_id
        ) {
          if (
            this.linkMap[obj.geneB_ensembl_gene_id + obj.geneA_ensembl_gene_id]
              .value > this.maxEdges
          ) {
            this.maxEdges =
              this.linkMap[
                obj.geneB_ensembl_gene_id + obj.geneA_ensembl_gene_id
              ].value;
          }
        }
      }

      // check both nodes and add brainregion
      if (
        this.nodeMap[obj.geneA_ensembl_gene_id] &&
        this.nodeMap[obj.geneA_ensembl_gene_id].brainregions.indexOf(
          obj.brainRegion
        ) === -1
      ) {
        this.nodeMap[obj.geneA_ensembl_gene_id].brainregions.push(
          obj.brainRegion
        );
        this.processBrainRegion(this.nodeMap[obj.geneA_ensembl_gene_id]);
      }
      if (
        this.nodeMap[obj.geneB_ensembl_gene_id] &&
        this.nodeMap[obj.geneB_ensembl_gene_id].brainregions.indexOf(
          obj.brainRegion
        ) === -1
      ) {
        this.nodeMap[obj.geneB_ensembl_gene_id].brainregions.push(
          obj.brainRegion
        );
        this.processBrainRegion(this.nodeMap[obj.geneB_ensembl_gene_id]);
      }
    } else {
      const link = {
        value: 1,
        source: obj.geneA_ensembl_gene_id,
        target: obj.geneB_ensembl_gene_id,
        brainregions: [obj.brainRegion],
        geneIdA: obj.geneA_external_gene_name || obj.geneA_ensembl_gene_id,
        geneIdB: obj.geneB_external_gene_name || obj.geneB_ensembl_gene_id,
      };
      this.linkMap[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id] =
        link;
      this.links = [
        ...this.links,
        this.linkMap[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id],
      ];
      if (
        this.nodeMap[obj.geneA_ensembl_gene_id] &&
        this.nodeMap[obj.geneA_ensembl_gene_id].brainregions.indexOf(
          obj.brainRegion
        ) === -1
      ) {
        this.nodeMap[obj.geneA_ensembl_gene_id].brainregions.push(
          obj.brainRegion
        );
        this.processBrainRegion(this.nodeMap[obj.geneA_ensembl_gene_id]);
      }
      if (
        this.nodeMap[obj.geneB_ensembl_gene_id] &&
        this.nodeMap[obj.geneB_ensembl_gene_id].brainregions.indexOf(
          obj.brainRegion
        ) === -1
      ) {
        this.nodeMap[obj.geneB_ensembl_gene_id].brainregions.push(
          obj.brainRegion
        );
        this.processBrainRegion(this.nodeMap[obj.geneB_ensembl_gene_id]);
      }
    }
  }

  filterByEdges(data: any, min: number) {
    const nodes: any = [];
    const links: any = [];

    const dicF: any = {};
    const dicL: any = {};

    data.links.forEach((link: any) => {
      if (link.value < min) {
        return;
      }

      if (link.source.ensembl_gene_id) {
        if (!dicF[link.source.ensembl_gene_id]) {
          dicF[link.source.ensembl_gene_id] =
            this.nodeMap[link.source.ensembl_gene_id];
          nodes.push(this.nodeMap[link.source.ensembl_gene_id]);
        }
        if (!dicF[link.target.ensembl_gene_id]) {
          dicF[link.target.ensembl_gene_id] =
            this.nodeMap[link.target.ensembl_gene_id];
          nodes.push(this.nodeMap[link.target.ensembl_gene_id]);
        }
      } else {
        if (!dicF[link.source]) {
          dicF[link.source] = this.nodeMap[link.source];
          nodes.push(this.nodeMap[link.source]);
        }
        if (!dicF[link.target]) {
          dicF[link.target] = this.nodeMap[link.target];
          nodes.push(this.nodeMap[link.target]);
        }
      }
    });

    data.links.forEach((link: any) => {
      nodes.forEach((n: any) => {
        if (link.target.id) {
          if (
            !dicL[link.source.id + link.target.id] &&
            !dicL[link.target.id + link.source.id]
          ) {
            if (n.ensembl_gene_id === link.target.id) {
              nodes.forEach((t: any) => {
                if (t.ensembl_gene_id === link.source.id) {
                  dicL[link.target.id + link.source.id] = true;
                  links.push(link);
                }
              });
            }
            if (n.ensembl_gene_id === link.source.id) {
              nodes.forEach((s: any) => {
                if (s.ensembl_gene_id === link.target.id) {
                  dicL[link.source.id + link.target.id] = true;
                  links.push(link);
                }
              });
            }
          }
        } else {
          if (
            !dicL[link.source + link.target] &&
            !dicL[link.target + link.source]
          ) {
            if (n.ensembl_gene_id === link.target) {
              nodes.forEach((t: any) => {
                if (t.ensembl_gene_id === link.source) {
                  dicL[link.target + link.source] = true;
                  links.push(link);
                }
              });
            }
            if (n.ensembl_gene_id === link.source) {
              nodes.forEach((s: any) => {
                if (s.ensembl_gene_id === link.target) {
                  dicL[link.source + link.target] = true;
                  links.push(link);
                }
              });
            }
          }
        }
      });
    });

    data.nodes = nodes;
    data.links = links;

    return data;
  }
}
