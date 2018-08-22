import { Injectable, EventEmitter } from '@angular/core';

import { Gene, GeneNetwork, GeneNetworkLinks } from '../models';

@Injectable()
export class ForceServiceStub {
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
