import { Injectable } from '@angular/core';

import {
    Gene,
    GeneInfo,
    TissuesResponse,
    ModelsResponse,
    Proteomics,
    GeneExpValidation,
    GeneOverallScores
} from '../models';
import {
    mockGene1,
    mockGene2,
    mockInfo1,
    mockTissues,
    mockModels,
    mockExpValidation,
    mockGeneOverallScores
} from './gene-mocks';

@Injectable()
export class GeneServiceStub {
    previousGene: Gene;
    currentGene: Gene;
    currentInfo: GeneInfo;
    currentExpValidation: GeneExpValidation[] = [];
    currentGeneOverallScores: GeneOverallScores;
    defaultTissue: string = 'CBE';
    defaultModel: string = 'AD Diagnosis (males and females)';
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
    noInfoData: boolean = false;
    tissuesNum: number = 7;
    isEmptyGene: boolean = true;

    getPreviousGene(): Gene {
        return mockGene2;
    }

    getCurrentGene(): Gene {
        return mockGene1;
    }

    getCurrentInfo(): GeneInfo {
        return mockInfo1;
    }

    getCurrentExpValidation(): GeneExpValidation[] {
        return mockExpValidation;
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

    setCurrentExpValidation(geneExpValidation: GeneExpValidation[]) {
        this.currentExpValidation = geneExpValidation;
    }

    setCurrentGeneOverallScores(geneOverallScores: GeneOverallScores) {
        this.currentGeneOverallScores = geneOverallScores;
    }

    getCurrentGeneOverallScores() {
        return mockGeneOverallScores;
    }

    getDefaultTissue(): string {
        return this.defaultTissue;
    }

    setDefaultTissue(tissue: string) {
        this.defaultTissue = tissue;
    }

    getDefaultModel(): string {
        return this.defaultModel;
    }

    setCurrentModel(model: string) {
        this.currentModel = model;
    }

    getCurrentModel(): string {
        return this.currentModel;
    }

    setCurrentTissue(tissue: string) {
        this.currentTissue = tissue;
    }

    getCurrentTissue(): string {
        return this.currentTissue;
    }

    setDefaultModel(model: string) {
        this.defaultModel = model;
    }

    getGeneModels(): string[] {
        return this.geneModels;
    }

    setGeneModels(models: string[]) {
        this.geneModels = models;
    }

    getGeneTissues(): string[] {
        return this.geneTissues;
    }

    setGeneTissues(tissues: string[]) {
        this.geneTissues = tissues;
    }

    getEmptyGeneState(): boolean {
        return this.isEmptyGene;
    }

    setEmptyGeneState(state: boolean) {
        this.isEmptyGene = state;
    }

    updateEmptyGeneState() {
        if (this.getCurrentGene() && this.getCurrentGene()._id) {
            this.isEmptyGene = false;
        } else {
            this.isEmptyGene =  true;
        }
    }

    updatePreviousGene() {
        if (this.getCurrentGene() && this.getCurrentGene().ensembl_gene_id) {
            // Only update the previous gene if we already have a current one
            this.setPreviousGene(this.getCurrentGene());
        }
    }

    // To be used everytime a new gene data arrives from the server
    updateGeneData(data: any) {
        this.setCurrentGene(data['item']);
        this.setCurrentInfo(data['info']);
        this.setCurrentExpValidation(data['expValidation']);
        this.setFC(data['minFC'], data['maxFC']);
        this.setLogFC(data['minFC'], data['maxFC']);
        this.setAdjPValue(data['minAdjPValue'], data['maxAdjPValue']);
        this.setCurrentGeneOverallScores(data['overallScores']);
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
            this.getPreviousGene().ensembl_gene_id !== this.getCurrentGene().ensembl_gene_id :
            false;
    }

    getNoInfoDataState() {
        return this.noInfoData;
    }

    setInfoDataState(state: boolean) {
        this.noInfoData = state;
    }

    getGeneProteomics(): Proteomics[] {
        return [];
    }

    hasMedianExpression(): boolean  {
        const info = this.getCurrentInfo();
        return info && info.medianexpression && info.medianexpression.length > 0 ? true : false;
    }

    filterGeneTableOptionalColumns(columns): any[] {
        return columns.filter(col => col.field !== 'hgnc_symbol');
    }
}
