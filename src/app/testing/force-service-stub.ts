import { Injectable, EventEmitter } from '@angular/core';

import {
    Gene,
    GeneNetwork,
    GeneNetworkLinks,
    LinksListResponse,
    GeneLink,
    GeneNode
} from '../models';

import { mockGene1 } from './gene-mocks';

@Injectable()
export class ForceServiceStub {
    datachange: EventEmitter<GeneNetwork> = new EventEmitter();

    // Add the new #[field] from TypeScript when it's out
    // https://github.com/Microsoft/TypeScript/issues/24418
    // Avoid using private variables, related to this issue
    // https://stackoverflow.com/questions/42260801/angular-2-mocking-private-properties
    dicNodes = [];
    dicLinks = [];
    dicGroup = [];
    rawData;
    genes: GeneNetwork = {
        links: [],
        nodes: [],
        origin: undefined,
        filterLvl: 0
    };
    genesClicked: GeneNetwork = {
        links: [{
            value: 1,
            source: 'VGF',
            target: 'PIAS2',
            brainregions: [],
            hgnc_symbolA: 'A',
            hgnc_symbolB: 'B'
        } as GeneLink],
        nodes: [{
            id: 'VGF',
            ensembl_gene_id: 'VGF',
            group: 1,
            hgnc_symbol: 'PIAS2',
            brainregions: []
        } as GeneNode],
        origin: mockGene1,
        filterLvl: 0
    };
    currentGene: Gene;
    linksListItems: GeneNetworkLinks[];

    setData(data: GeneNetworkLinks[]) {
        this.rawData = data;
        this.dicNodes = [];
        this.dicLinks = [];
        this.dicGroup = [];
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

    getGeneClickedList() {
        return this.genesClicked;
    }

    processNodes(gene: Gene) {
        //
    }

    setLinksListItems(items: GeneNetworkLinks[]) {
        this.linksListItems = items;
    }

    getLinksListItems(): GeneNetworkLinks[] {
        return this.linksListItems;
    }

    processSelectedNode(data: LinksListResponse , gene: Gene) {
        //
    }
}
