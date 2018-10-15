import { Injectable, EventEmitter } from '@angular/core';
import { Gene, LinksListResponse } from '../../models';

import { GeneNetwork, GeneLink, GeneNode, GeneNetworkLinks } from '../../models/geneLink';

@Injectable()
export class ForceService {

    datachange: EventEmitter<GeneNetwork> = new EventEmitter();

    // Add the new #[field] from TypeScript when it's out
    // https://github.com/Microsoft/TypeScript/issues/24418
    // Avoid using private variables, related to this issue
    // https://stackoverflow.com/questions/42260801/angular-2-mocking-private-properties
    dicNodes = [];
    dicLinks = [];
    dicGroup = [];
    rawData = [];
    genes: GeneNetwork = {
        links: [],
        nodes: [],
        origin: undefined,
        filterLvl: 0
    };
    genesClicked: GeneNetwork = {
        links: [],
        nodes: [],
        origin: undefined,
        filterLvl: 0
    };
    genesFiltered: GeneNetwork = {
        links: [],
        nodes: [],
        origin: undefined,
        filterLvl: 0
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
            origin: undefined,
            filterLvl: 0
        };
    }

    emitDataChangeEvent(data: GeneNetwork) {
        this.datachange.emit(data);
    }

    getGenes(): EventEmitter<GeneNetwork> {
        return this.datachange;
    }

    getGeneOriginalList(): GeneNetwork {
        if (this.genes.links.length && this.genes.nodes.length) {
            return this.genes;
        }
        return null;
    }

    getGeneClickedList(): GeneNetwork {
        if (this.genesClicked.links.length && this.genesClicked.nodes.length) {
            return this.genesClicked;
        }
        return null;
    }

    processNode(obj: GeneNetworkLinks, dic, genes) {
        // Nodes from selected Gene
        if (obj.geneB_ensembl_gene_id && !dic[obj.geneB_ensembl_gene_id]) {
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
        if (obj.geneA_ensembl_gene_id && !dic[obj.geneA_ensembl_gene_id]) {
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
                if (this.genes.origin.ensembl_gene_id === obj.geneA_ensembl_gene_id
                    || this.genes.origin.ensembl_gene_id === obj.geneB_ensembl_gene_id) {
                    if (dicL[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id].value
                        > this.genes.filterLvl) {
                        this.genes.filterLvl =
                            dicL[obj.geneA_ensembl_gene_id + obj.geneB_ensembl_gene_id].value;
                    }
                }
            }

            // check B - A link and add region.
            if (!!dicL[obj.geneB_ensembl_gene_id + obj.geneA_ensembl_gene_id] &&
                dicL[obj.geneB_ensembl_gene_id + obj.geneA_ensembl_gene_id]
                .brainregions.indexOf(obj.brainRegion) === -1) {
                dicL[obj.geneB_ensembl_gene_id + obj.geneA_ensembl_gene_id]
                    .value++;
                dicL[obj.geneB_ensembl_gene_id + obj.geneA_ensembl_gene_id]
                    .brainregions.push(obj.brainRegion);
                if (this.genes.origin.ensembl_gene_id === obj.geneA_ensembl_gene_id
                    || this.genes.origin.ensembl_gene_id === obj.geneB_ensembl_gene_id ) {
                    if (dicL[obj.geneB_ensembl_gene_id + obj.geneA_ensembl_gene_id].value
                        > this.genes.filterLvl) {
                        this.genes.filterLvl =
                        dicL[obj.geneB_ensembl_gene_id + obj.geneA_ensembl_gene_id].value;
                    }
                }
            }

            // check both nodes and add brainregion
            if (dicN[obj.geneA_ensembl_gene_id] && dicN[obj.geneA_ensembl_gene_id]
                .brainregions.indexOf(obj.brainRegion) === -1) {
                dicN[obj.geneA_ensembl_gene_id].brainregions.push(obj.brainRegion);
                this.processBrainRegion(dicN[obj.geneA_ensembl_gene_id], dicN);
            }
            if (dicN[obj.geneB_ensembl_gene_id] && dicN[obj.geneB_ensembl_gene_id]
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
            if (dicN[obj.geneA_ensembl_gene_id] && dicN[obj.geneA_ensembl_gene_id]
                .brainregions.indexOf(obj.brainRegion) === -1) {
                dicN[obj.geneA_ensembl_gene_id].brainregions.push(obj.brainRegion);
                this.processBrainRegion(dicN[obj.geneA_ensembl_gene_id], dicN);
            }
            if (dicN[obj.geneB_ensembl_gene_id] && dicN[obj.geneB_ensembl_gene_id]
                .brainregions.indexOf(obj.brainRegion) === -1) {
                dicN[obj.geneB_ensembl_gene_id].brainregions.push(obj.brainRegion);
                this.processBrainRegion(dicN[obj.geneB_ensembl_gene_id], dicN);
            }
        }
    }

    filterLink(lvl: number): Promise<GeneNetwork> {
        this.genesFiltered = {
            links: [],
            nodes: [],
            origin: undefined,
            filterLvl: 0
        };
        return new Promise((resolve, reject) => {
            const dicF = [];
            const dicL = [];
            this.genesFiltered.origin = this.genes.origin;
            this.genes.links.forEach((link: any) => {
                if (link.value > lvl) {
                    if (link.source.ensembl_gene_id) {
                        if (!dicF[link.source.ensembl_gene_id]) {
                            dicF[link.source.ensembl_gene_id] =
                                this.dicNodes[link.source.ensembl_gene_id];
                            this.genesFiltered.nodes
                                .push(this.dicNodes[link.source.ensembl_gene_id]);
                        }
                        if (!dicF[link.target.ensembl_gene_id]) {
                            dicF[link.target.ensembl_gene_id] =
                                this.dicNodes[link.target.ensembl_gene_id];
                            this.genesFiltered.nodes
                                .push(this.dicNodes[link.target.ensembl_gene_id]);
                        }
                    } else {
                        if (!dicF[link.source]) {
                            dicF[link.source] =
                                this.dicNodes[link.source];
                            this.genesFiltered.nodes
                                .push(this.dicNodes[link.source]);
                        }
                        if (!dicF[link.target]) {
                            dicF[link.target] =
                                this.dicNodes[link.target];
                            this.genesFiltered.nodes
                                .push(this.dicNodes[link.target]);
                        }
                    }
                }
            });
            this.genes.links.forEach((link: any) => {
                this.genesFiltered.nodes.forEach((n) => {
                    if (link.target.id) {
                        if (n.ensembl_gene_id === link.target.id) {
                            this.genesFiltered.nodes.forEach((t) => {
                                if (t.ensembl_gene_id === link.source.id) {
                                    this.genesFiltered.links.push(link);
                                }
                            });
                        }
                        if (n.ensembl_gene_id === link.source.id) {
                            this.genesFiltered.nodes.forEach((s) => {
                                if (s.ensembl_gene_id === link.target.id) {
                                    this.genesFiltered.links.push(link);
                                }
                            });
                        }
                    } else {
                        if (n.ensembl_gene_id === link.target) {
                            this.genesFiltered.nodes.forEach((t) => {
                                if (t.ensembl_gene_id === link.source) {
                                    this.genesFiltered.links.push(link);
                                }
                            });
                        }
                        if (n.ensembl_gene_id === link.source) {
                            this.genesFiltered.nodes.forEach((s) => {
                                if (s.ensembl_gene_id === link.target) {
                                    this.genesFiltered.links.push(link);
                                }
                            });
                        }
                    }
                });
            });
            resolve(this.genesFiltered);
        });
    }

    processSelectedNode(data: LinksListResponse , gene: Gene): Promise<GeneNetwork> {
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
                origin: gene,
                filterLvl: 0
            };
            this.genesClicked.nodes = [dicNodesC[gene.ensembl_gene_id]];
            data.items.forEach((obj: any) => {
                this.processNode(obj, dicNodesC, this.genesClicked);
                this.processLink(obj, dicLinksC, dicNodesC, this.genesClicked);
            });
            resolve(this.genesClicked);
        });
    }

    processNodes(gene: Gene): Promise<GeneNetwork> {
        return new Promise((resolve, reject) => {
            this.currentGene = gene;
            this.genes.origin = gene;
            this.genes.filterLvl = 0;
            this.dicNodes[this.currentGene.ensembl_gene_id] = {
                id: this.currentGene.ensembl_gene_id,
                ensembl_gene_id: this.currentGene.ensembl_gene_id,
                group: 1,
                hgnc_symbol: this.currentGene.hgnc_symbol,
                brainregions: []
            };
            this.genes.nodes = [...this.genes.nodes,
                this.dicNodes[this.currentGene.ensembl_gene_id]];
            this.rawData.forEach((obj: any) => {
                this.processNode(obj, this.dicNodes, this.genes);
                this.processLink(obj, this.dicLinks, this.dicNodes, this.genes);
            });
            this.genes.links.sort((a, b) => {
                return a['value'] - b['value'];
            });
            this.genesClicked = this.genes;
            // TODO: is a waste to return a promise and emit an event.
            // update network component to use events.
            this.emitDataChangeEvent(this.genes);
            resolve(this.genes);
        });
    }
}
