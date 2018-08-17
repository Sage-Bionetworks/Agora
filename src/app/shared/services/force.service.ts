import { Injectable, EventEmitter } from '@angular/core';
import { Gene } from '../../models';

import { GeneNetwork, GeneLink, GeneNode, GeneNetworkLinks } from '../../models/geneLink';

@Injectable()
export class ForceService {

    datachange: EventEmitter<GeneNetwork> = new EventEmitter();

    // Add the new #[field] from TypeScript when it's out
    // https://github.com/Microsoft/TypeScript/issues/24418
    dicNodes = [];
    dicLinks = [];
    dicGroup = [];
    rawData = [];
    genes: GeneNetwork = {
        links: [],
        nodes: [],
        origin: undefined
    };
    genesClicked: GeneNetwork = {
        links: [],
        nodes: [],
        origin: undefined
    };
    currentGene: Gene;

    setData(data: GeneNetworkLinks[]) {
        this.rawData = data;
        this.dicNodes = [];
        this.dicLinks = [];
        this.dicGroup = [];
        this.genes = {
            links: [],
            nodes: [],
            origin: undefined
        };
    }

    emitDataChangeEvent(data: GeneNetwork) {
        this.datachange.emit(data);
    }

    getGenes() {
        return this.datachange;
    }

    getGeneOriginalList() {
        if (this.genes.links.length && this.genes.nodes.length) {
            return this.genes;
        }
        return null;
    }

    getGeneClickedList() {
        if (this.genesClicked.links.length && this.genesClicked.nodes.length) {
            return this.genesClicked;
        }
        return null;
    }

    processNode(obj: GeneNetworkLinks, dic, genes) {
        // Nodes from selected Gene
        if (!dic[obj.geneB_ensembl_gene_id]) {
            const node: GeneNode = {
                id: obj.geneB_ensembl_gene_id,
                ensembl_gene_id: obj.geneB_ensembl_gene_id,
                group: 1,
                hgnc_symbol: obj.geneB_external_gene_name,
                brainregions: [obj.brainRegion]
            };
            dic[obj.geneB_ensembl_gene_id] = node;
            genes.nodes = [...genes.nodes,
            dic[obj.geneB_ensembl_gene_id]];
            this.processBrainRegion(dic[obj.geneB_ensembl_gene_id], dic);
        }
        // Nodes to selected Gene
        if (!dic[obj.geneA_ensembl_gene_id]) {
            const node: GeneNode = {
                id: obj.geneA_ensembl_gene_id,
                ensembl_gene_id: obj.geneA_ensembl_gene_id,
                group: 1,
                hgnc_symbol: obj.geneA_external_gene_name,
                brainregions: [obj.brainRegion]
            };
            dic[obj.geneA_ensembl_gene_id] = node;
            genes.nodes = [...genes.nodes,
            dic[obj.geneA_ensembl_gene_id]];
            this.processBrainRegion(dic[obj.geneA_ensembl_gene_id], dic);
        }
    }

    processBrainRegion(node: GeneNode, dic) {
        node.brainregions.sort();
        const groupStr = node.brainregions.join('');
        if (!this.dicGroup[groupStr]) {
            this.dicGroup[groupStr] = {};
            this.dicGroup[groupStr].value = Object.keys(this.dicGroup).length + 1;
        }
        dic[node.id].group = this.dicGroup[groupStr].value;
    }

    processLink(obj: GeneNetworkLinks, dicL, dicN, genes) {
        if (!!dicL[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id] ||
            !!dicL[obj.geneB_ensembl_gene_id + obj.geneA_ensembl_gene_id]) {
            // check A - B link and add region.
            if (!!dicL[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id] &&
                dicL[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id]
                .brainregions.indexOf(obj.brainRegion) === -1) {
                dicL[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id]
                    .value++;
                dicL[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id]
                    .brainregions.push(obj.brainRegion);
            }

            // check B - A link and add region.
            if (!!dicL[obj.geneB_ensembl_gene_id + obj.geneA_ensembl_gene_id] &&
                dicL[obj.geneB_ensembl_gene_id + obj.geneA_ensembl_gene_id]
                .brainregions.indexOf(obj.brainRegion) === -1) {
                dicL[obj.geneB_ensembl_gene_id + obj.geneA_ensembl_gene_id]
                    .value++;
                dicL[obj.geneB_ensembl_gene_id + obj.geneA_ensembl_gene_id]
                    .brainregions.push(obj.brainRegion);
            }

            // check both nodes and add brainregion
            if (dicN[obj.geneA_ensembl_gene_id]
                .brainregions.indexOf(obj.brainRegion) === -1) {
                dicN[obj.geneA_ensembl_gene_id].brainregions.push(obj.brainRegion);
                this.processBrainRegion(dicN[obj.geneA_ensembl_gene_id], dicN);
            }
            if (dicN[obj.geneB_ensembl_gene_id]
                .brainregions.indexOf(obj.brainRegion) === -1) {
                dicN[obj.geneB_ensembl_gene_id].brainregions.push(obj.brainRegion);
                this.processBrainRegion(dicN[obj.geneB_ensembl_gene_id], dicN);
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
            dicL[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id] = link;
            genes.links = [...genes.links,
            dicL[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id]];
            if (dicN[obj.geneA_ensembl_gene_id]
                .brainregions.indexOf(obj.brainRegion) === -1) {
                dicN[obj.geneA_ensembl_gene_id].brainregions.push(obj.brainRegion);
                this.processBrainRegion(dicN[obj.geneA_ensembl_gene_id], dicN);
            }
            if (dicN[obj.geneB_ensembl_gene_id]
                .brainregions.indexOf(obj.brainRegion) === -1) {
                dicN[obj.geneB_ensembl_gene_id].brainregions.push(obj.brainRegion);
                this.processBrainRegion(dicN[obj.geneB_ensembl_gene_id], dicN);
            }
        }
    }

    processSelectedNode(gene: Gene, data): Promise<GeneNetwork> {
        return new Promise((resolve, reject) => {
            const dicNodesC = [];
            const dicLinksC = [];
            dicNodesC[gene.ensembl_gene_id] = {
                id: gene.ensembl_gene_id,
                ensembl_gene_id: gene.ensembl_gene_id,
                group: 1,
                hgnc_symbol: gene.hgnc_symbol,
                brainregions: []
            };
            this.genesClicked = {
                links: [],
                nodes: [],
                origin: gene
            };
            this.genesClicked.nodes = [dicNodesC[gene.ensembl_gene_id]];
            data['items'].forEach((obj: any) => {
                this.processNode(obj, dicNodesC, this.genesClicked);
                this.processLink(obj, dicLinksC, dicNodesC, this.genesClicked);
            });
            resolve(this.genesClicked);
        });
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
                this.processNode(obj, this.dicNodes, this.genes);
                this.processLink(obj, this.dicLinks, this.dicNodes, this.genes);
            });
            this.genes.links.sort((a, b) => {
                return a['value'] - b['value'];
            });
            this.genes.origin = gene;
            this.genesClicked = this.genes;
            // TODO: is a waste to return a promise and emit an event.
            // update network component to use events.
            this.emitDataChangeEvent(this.genes);
            resolve(this.genes);
        });
    }
}
