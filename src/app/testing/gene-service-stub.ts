import { Injectable } from '@angular/core';

import { Gene, GeneInfo } from '../models';

@Injectable()
export class GeneServiceStub {
    currentGene: Gene;
    currentInfo: GeneInfo;
    currentTissue: string;
    currentModel: string;
    models: string[] = [];
    tissues: string[] = [];
    minFC: number = 0;
    maxFC: number = 10;
    minLogFC: number = 0;
    maxLogFC: number = 10;
    maxAdjPValue: number = 50;
    minAdjPValue: number = 0;

    setLogFC(min: number, max: number) {
        this.minLogFC = min;
        this.maxLogFC = max;
    }

    setFC(min: number, max: number) {
        this.minFC = min;
        this.maxFC = max;
    }

    setCurrentGene(gene: Gene) {
        this.currentGene = gene;
    }

    setCurrentInfo(geneInfo: GeneInfo) {
        this.currentInfo = geneInfo;
    }

    // To be used everytime a new gene data arrives from the server
    updateGeneData(data: any) {
        this.setCurrentGene(data['item']);
        this.setCurrentInfo(data['info']);
        this.setFC(data['minFC'], data['maxFC']);
        this.setLogFC(data['minFC'], data['maxFC']);
        this.setAdjPValue(data['minAdjPValue'], data['maxAdjPValue']);
    }

    setAdjPValue(max: number, min?: number) {
        this.maxAdjPValue = max;
        this.minAdjPValue = (min) ? min : 0;
    }
}
