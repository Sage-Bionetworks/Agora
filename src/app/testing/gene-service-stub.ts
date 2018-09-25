import { Injectable } from '@angular/core';

import { Gene, GeneInfo, TissuesResponse, ModelsResponse } from '../models';
import { mockGene1, mockGene2, mockInfo1, mockTissues, mockModels } from './gene-mocks';

@Injectable()
export class GeneServiceStub {
    previousGene: Gene;
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

    getPreviousGene(): Gene {
        return mockGene2;
    }

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

    setPreviousGene(gene: Gene) {
        this.previousGene = gene;
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

    updatePreviousGene() {
        if (this.getCurrentGene() && this.getCurrentGene().hgnc_symbol) {
            // Only update the previous gene if we already have a current one
            this.setPreviousGene(this.getCurrentGene());
        }
    }

    // To be used everytime a new gene data arrives from the server
    updateGeneData(data: any) {
        this.setCurrentGene(data['item']);
        this.setCurrentInfo(data['info']);
        this.setFC(data['minFC'], data['maxFC']);
        this.setLogFC(data['minFC'], data['maxFC']);
        this.setAdjPValue(data['minAdjPValue'], data['maxAdjPValue']);
    }

    loadGeneTissues(data?: TissuesResponse) {
        this.geneTissues = mockTissues;
        this.geneTissues.sort((a, b) => {
            if (a < b) { return -1; }
            if (a > b) { return 1; }
            return 0;
        });
    }

    loadGeneModels(data?: ModelsResponse) {
        this.geneModels = mockModels;
    }

    setAdjPValue(max: number, min?: number) {
        this.maxAdjPValue = max;
        this.minAdjPValue = (min) ? min : 0;
    }

    hasGeneChanged(): boolean {
        return (this.getPreviousGene() && this.getCurrentGene()) ?
            this.getPreviousGene().hgnc_symbol !== this.getCurrentGene().hgnc_symbol :
            false;
    }
}
