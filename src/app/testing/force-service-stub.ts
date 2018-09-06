import { Injectable, EventEmitter } from '@angular/core';

import { Gene, GeneNetwork, GeneNetworkLinks } from '../models';

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

    getGenes(): EventEmitter<GeneNetwork> {
        return this.datachange;
    }

    getGeneOriginalList() {
        if (this.genes.links.length && this.genes.nodes.length) {
            return this.genes;
        }
        return null;
    }

    processNodes(gene: Gene): Promise<GeneNetwork> {
        return new Promise((resolve, reject) => {
            resolve(this.genes);
        });
    }
}
