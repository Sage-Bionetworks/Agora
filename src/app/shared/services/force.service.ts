import { Injectable } from '@angular/core';
import { Gene } from '../../models';

import { Observable } from 'rxjs/Observable';
import { GeneNetwork, GeneLink, GeneNode, GeneNetworkLinks } from '../../models/geneLink';

@Injectable()
export class ForceService {

    private dicNodes = [];
    private dicLinks = [];
    private dicGroup = [];
    private rawData = [];
    private genes: GeneNetwork = {
        links: [],
        nodes: []
    };
    private currentGene: Gene;

    setData(data: GeneNetworkLinks[]) {
        this.rawData = data;
        this.dicNodes = [];
        this.dicLinks = [];
        this.dicGroup = [];
        this.genes = {
            links: [],
            nodes: []
        };
    }

    getGenes() {
        return this.genes;
    }

    processNode(obj: GeneNetworkLinks) {
        // Nodes from selected Gene
        if (!this.dicNodes[obj.geneB_ensembl_gene_id]) {
            const node: GeneNode = {
                id: obj.geneB_ensembl_gene_id,
                ensembl_gene_id: obj.geneB_ensembl_gene_id,
                group: 1,
                hgnc_symbol: obj.geneB_external_gene_name,
                brainregions: [obj.brainRegion]
            };
            this.dicNodes[obj.geneB_ensembl_gene_id] = node;
            this.genes.nodes = [...this.genes.nodes,
            this.dicNodes[obj.geneB_ensembl_gene_id]];
            this.processBrainRegion(this.dicNodes[obj.geneB_ensembl_gene_id]);
        }
        // Nodes to selected Gene
        if (!this.dicNodes[obj.geneA_ensembl_gene_id]) {
            const node: GeneNode = {
                id: obj.geneA_ensembl_gene_id,
                ensembl_gene_id: obj.geneA_ensembl_gene_id,
                group: 1,
                hgnc_symbol: obj.geneA_external_gene_name,
                brainregions: [obj.brainRegion]
            };
            this.dicNodes[obj.geneA_ensembl_gene_id] = node;
            this.genes.nodes = [...this.genes.nodes,
            this.dicNodes[obj.geneA_ensembl_gene_id]];
            this.processBrainRegion(this.dicNodes[obj.geneA_ensembl_gene_id]);
        }
    }

    processBrainRegion(node: GeneNode) {
        node.brainregions.sort();
        const groupStr = node.brainregions.join('');
        if (!this.dicGroup[groupStr]) {
            this.dicGroup[groupStr] = {};
            this.dicGroup[groupStr].value = Object.keys(this.dicGroup).length + 1;
        }
        this.dicNodes[node.id].group = this.dicGroup[groupStr].value;
    }

    processLink(obj: GeneNetworkLinks) {
        if (!!this.dicLinks[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id] ||
            !!this.dicLinks[obj.geneB_ensembl_gene_id + obj.geneA_ensembl_gene_id]) {
            // check A - B link and add region.
            if (!!this.dicLinks[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id] &&
                this.dicLinks[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id]
                .brainregions.indexOf(obj.brainRegion) === -1) {
                this.dicLinks[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id]
                    .value++;
                this.dicLinks[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id]
                    .brainregions.push(obj.brainRegion);
            }

            // check B - A link and add region.
            if (!!this.dicLinks[obj.geneB_ensembl_gene_id + obj.geneA_ensembl_gene_id] &&
                this.dicLinks[obj.geneB_ensembl_gene_id + obj.geneA_ensembl_gene_id]
                .brainregions.indexOf(obj.brainRegion) === -1) {
                this.dicLinks[obj.geneB_ensembl_gene_id + obj.geneA_ensembl_gene_id]
                    .value++;
                this.dicLinks[obj.geneB_ensembl_gene_id + obj.geneA_ensembl_gene_id]
                    .brainregions.push(obj.brainRegion);
            }

            // check both nodes and add brainregion
            if (this.dicNodes[obj.geneA_ensembl_gene_id]
                .brainregions.indexOf(obj.brainRegion) === -1) {
                this.dicNodes[obj.geneA_ensembl_gene_id].brainregions.push(obj.brainRegion);
                this.processBrainRegion(this.dicNodes[obj.geneA_ensembl_gene_id]);
            }
            if (this.dicNodes[obj.geneB_ensembl_gene_id]
                .brainregions.indexOf(obj.brainRegion) === -1) {
                this.dicNodes[obj.geneB_ensembl_gene_id].brainregions.push(obj.brainRegion);
                this.processBrainRegion(this.dicNodes[obj.geneB_ensembl_gene_id]);
            }
        } else {
            const link: GeneLink = {
                value: 1,
                source: obj.geneA_ensembl_gene_id,
                target: obj.geneB_ensembl_gene_id,
                brainregions: [obj.brainRegion],
                hgnc_symbolA: obj.geneA_external_gene_name,
                hgnc_symbolB: obj.geneB_external_gene_name
            };
            this.dicLinks[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id] = link;
            this.genes.links = [...this.genes.links,
            this.dicLinks[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id]];
            if (this.dicNodes[obj.geneA_ensembl_gene_id]
                .brainregions.indexOf(obj.brainRegion) === -1) {
                this.dicNodes[obj.geneA_ensembl_gene_id].brainregions.push(obj.brainRegion);
                this.processBrainRegion(this.dicNodes[obj.geneA_ensembl_gene_id]);
            }
            if (this.dicNodes[obj.geneB_ensembl_gene_id]
                .brainregions.indexOf(obj.brainRegion) === -1) {
                this.dicNodes[obj.geneB_ensembl_gene_id].brainregions.push(obj.brainRegion);
                this.processBrainRegion(this.dicNodes[obj.geneB_ensembl_gene_id]);
            }
        }
    }

    processNodes(gene: Gene): Promise<GeneNetwork> {
        return new Promise((resolve, reject) => {
            this.currentGene = gene;
            this.dicNodes[this.currentGene.ensembl_gene_id] = {
                id: this.currentGene.ensembl_gene_id,
                ensembl_gene_id: this.currentGene.ensembl_gene_id,
                group: 1,
                hgnc_symbol: this.currentGene.hgnc_symbol,
                brainregions: []
            };
            this.genes.nodes = [...this.genes.nodes,
                this.dicNodes[this.currentGene.ensembl_gene_id]];
            this.rawData['items'].forEach((obj: any) => {
                this.processNode(obj);
                this.processLink(obj);
            });
            this.genes.links.sort((a, b) => {
                return a['value'] - b['value'];
            });
            resolve(this.genes);
        });
    }
}
