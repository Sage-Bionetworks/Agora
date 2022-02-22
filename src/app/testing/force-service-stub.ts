import { Injectable, EventEmitter } from '@angular/core';

import {
    Gene,
    GeneNetwork,
    GeneNetworkLinks,
    LinksListResponse,
    GeneLink,
    GeneNode
} from '../models';

import { mockGene1, mockGene2 } from './gene-mocks';

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
        links: [
            {
                brainregions: ['DLPFC'],
                geneIdA: 'VGF',
                geneIdB: 'COL22A1',
                source: {
                    brainregions: ['CBE', 'DLPFC', 'FP', 'IFG', 'PHG', 'STG', 'TCX'],
                    ensembl_gene_id: 'ENSG00000128564',
                    group: 38,
                    hgnc_symbol: 'VGF',
                    id: 'VGF',
                    index: 0,
                    vx: 0.6383193392459895,
                    vy: -4.464810585759529,
                    x: 365.1162545134067,
                    y: 609.1416686229836
                },
                target: {
                    brainregions: ['DLPFC'],
                    ensembl_gene_id: 'ENSG00000169436',
                    group: 2,
                    hgnc_symbol: 'COL22A1',
                    id: 'COL22A1',
                    index: 1,
                    vx: 0.6383193392459895,
                    vy: -4.464810585759529,
                    x: 365.1162545134067,
                    y: 609.1416686229836
                },
                value: 1
            } as GeneLink
        ],
        nodes: [{
            id: 'ENSG00000078043',
            ensembl_gene_id: 'ENSG00000078043',
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
