import { Injectable } from '@angular/core';

import { Gene, GeneInfo } from '../models';
import { mockGene1, mockInfo1, mockTissues, mockModels } from './gene-mocks';

@Injectable()
export class GeneServiceStub {
    currentGene: Gene;
    currentInfo: GeneInfo;
    currentTissue: string;
    geneTissues: string[] = [];
    currentModel: string;
    geneModels: string[] = [];
    models: string[] = [];
    tissues: string[] = [];
    minFC: number = 0;
    maxFC: number = 10;
    minLogFC: number = 0;
    maxLogFC: number = 10;
    maxAdjPValue: number = 50;
    minAdjPValue: number = 0;

    getCurrentGene(): Gene {
        return mockGene1;
    }

    getCurrentInfo(): GeneInfo {
        return mockInfo1;
    }

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

    getGeneModels(): string[] {
        return this.geneModels;
    }

    setGeneModels(models: string[]) {
        this.geneModels = models;
    }

    setGeneTissues(tissues: string[]) {
        this.geneTissues = tissues;
    }

    // To be used everytime a new gene data arrives from the server
    updateGeneData(data: any) {
        this.setCurrentGene(data['item']);
        this.setCurrentInfo(data['info']);
        this.setFC(data['minFC'], data['maxFC']);
        this.setLogFC(data['minFC'], data['maxFC']);
        this.setAdjPValue(data['minAdjPValue'], data['maxAdjPValue']);
    }

    loadGeneTissues(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.geneTissues = mockTissues;
            resolve(true);
        });
    }

    loadGeneModels(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.geneModels = mockModels;
            resolve(true);
        });
    }

    setAdjPValue(max: number, min?: number) {
        this.maxAdjPValue = max;
        this.minAdjPValue = (min) ? min : 0;
    }
}
