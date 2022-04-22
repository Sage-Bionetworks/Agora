import { Injectable } from '@angular/core';

import {
    Gene,
    GeneInfo,
    TissuesResponse,
    ModelsResponse,
    GeneResponse,
    Proteomics,
    GeneExpValidation,
    GeneOverallScores,
} from '../../models';

import { emptyGene } from 'app/testing';

import { ApiService } from './api.service';

@Injectable()
export class GeneService {
    // Add the new #[field] from TypeScript when it's out
    // https://github.com/Microsoft/TypeScript/issues/24418
    previousGene: Gene;
    currentGene: Gene;
    currentInfo: GeneInfo;
    currentExpValidation: GeneExpValidation[] = [];
    currentGeneOverallScores: GeneOverallScores;
    defaultTissue: string = 'CBE';
    defaultModel: string = 'AD Diagnosis (males and females)';
    currentTissue: string = this.defaultTissue;
    currentModel: string = this.defaultModel;
    currentProtein: string = '';
    models: string[] = [];
    geneModels: string[] = [];
    tissues: string[] = [];
    geneTissues: string[] = [];
    geneProteomics: Proteomics[] = [];
    minFC: number = 0;
    maxFC: number = 10;
    minLogFC: number = 0;
    maxLogFC: number = 10;
    maxAdjPValue: number = 1e-50;
    minAdjPValue: number = Math.pow(10, -20);
    noInfoData: boolean = false;
    tissuesNum: number = 7;
    pTissuesNum: number = 4;
    isEmptyGene: boolean = true;

    constructor(private apiService: ApiService) {}

    setCurrentGene(gene: Gene) {
        this.currentGene = gene;
    }

    getCurrentGene(): Gene {
        return this.currentGene;
    }

    setPreviousGene(gene: Gene) {
        this.previousGene = gene;
    }

    getPreviousGene(): Gene {
        return this.previousGene;
    }

    updatePreviousGene() {
        // Only update the previous gene if we already have a current one
        if (this.getCurrentGene() && this.getCurrentGene().ensembl_gene_id) {
            this.setPreviousGene(this.getCurrentGene());
        }
    }

    // To be used everytime a new gene data arrives from the server
    updateGeneData(data: GeneResponse) {
        this.setCurrentGene(data.item);
        this.setCurrentInfo(data.info);
        this.setCurrentExpValidation(data.expValidation);
        this.setCurrentModel(data.item?.model);
        this.setCurrentTissue(data.item?.tissue);
        this.setCurrentGeneOverallScores(data.overallScores);
    }

    setCurrentInfo(geneInfo: GeneInfo) {
        this.currentInfo = geneInfo;
    }

    getCurrentInfo(): GeneInfo {
        return this.currentInfo;
    }

    setCurrentExpValidation(geneExpValidation: GeneExpValidation[]) {
        this.currentExpValidation = geneExpValidation;
    }

    getCurrentExpValidation(): GeneExpValidation[] {
        return this.currentExpValidation;
    }

    setCurrentGeneOverallScores(geneOverallScores: GeneOverallScores) {
        this.currentGeneOverallScores = geneOverallScores;
    }

    getCurrentGeneOverallScores(): GeneOverallScores {
        return this.currentGeneOverallScores;
    }

    setCurrentTissue(tissue: string) {
        this.currentTissue = tissue;
    }

    getCurrentTissue(): string {
        return this.currentTissue;
    }

    setCurrentModel(model: string) {
        this.currentModel = model;
    }

    getCurrentModel(): string {
        return this.currentModel;
    }

    setCurrentProtein(protein: string) {
        this.currentProtein = protein;
    }

    getCurrentProtein(): string {
        return this.currentProtein;
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

    setDefaultModel(model: string) {
        this.defaultModel = model;
    }

    getTissues(): string[] {
        return this.tissues;
    }

    setTissues(tissues: string[]) {
        this.tissues = tissues;
    }

    getGeneTissues(): string[] {
        return [
            'CBE',
            'DLPFC',
            'FP',
            'IFG',
            'PHG',
            'STG',
            'TCX'
        ];
        // return this.geneTissues;
    }

    setGeneTissues(tissues: string[]) {
        this.geneTissues = tissues;
    }

    getModels(): string[] {
        return this.models;
    }

    setModels(models: string[]) {
        this.models = models;
    }

    getGeneModels(): string[] {
        return [
            'AD Diagnosis (males and females)',
            'AD Diagnosis x AOD (males and females)',
            'AD Diagnosis x Sex (females only)',
            'AD Diagnosis x Sex (males only)'
        ];
        // return this.geneModels;
    }

    setGeneModels(models: string[]) {
        this.geneModels = models;
    }

    getGeneProteomics(): Proteomics[] {
        return this.geneProteomics;
    }

    setGeneProteomics(proteomics: Proteomics[]) {
        this.geneProteomics = proteomics;
    }

    setLogFC(min: number, max: number) {
        this.minLogFC = min;
        this.maxLogFC = max;
    }

    setFC(min: number, max: number) {
        this.minFC = min;
        this.maxFC = max;
    }

    getLogFC(): number[] {
        return [this.minLogFC, this.maxLogFC];
    }

    getFC(): number[] {
        return [this.minFC, this.maxFC];
    }

    setAdjPValue(min: number, max: number) {
        this.maxAdjPValue = max;
        this.minAdjPValue = min;
    }

    getAdjPValue(): number[] {
        return [this.minAdjPValue, this.maxAdjPValue];
    }

    getNumOfTissues(): number {
        return this.tissuesNum;
    }

    getNumOfPTissues(): number {
        return this.pTissuesNum;
    }

    getEmptyGene(ensemblGeneId?: string, hgncSymbol?: string): Gene {
        const eGene = emptyGene;
        if (ensemblGeneId) { eGene.ensembl_gene_id = ensemblGeneId; }
        if (hgncSymbol) { eGene.hgnc_symbol = hgncSymbol; }
        return eGene;
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

    // Add pipe
    loadTissues(data: TissuesResponse) {
        this.tissues = data.items;
        if (this.tissues) {
            this.tissues.sort((a, b) => {
                if (a < b) { return -1; }
                if (a > b) { return 1; }
                return 0;
            });
        }
    }

    loadGeneTissues(data: TissuesResponse) {
        this.geneTissues = data.items;
        if (this.geneTissues) {
            this.geneTissues.sort((a, b) => {
                if (a < b) { return -1; }
                if (a > b) { return 1; }
                return 0;
            });
        }
    }

    loadModels(data: ModelsResponse) {
        this.models = data.items;
    }

    loadGeneModels(data: ModelsResponse) {
        this.geneModels = data.items;
    }

    hasGeneChanged(): boolean {
        return (this.getPreviousGene() && this.getCurrentGene()) ?
            this.getPreviousGene().ensembl_gene_id !== this.getCurrentGene().ensembl_gene_id :
            false;
    }

    getNoInfoDataState(): boolean {
        return this.noInfoData;
    }

    setInfoDataState(state: boolean) {
        this.noInfoData = state;
    }

    hasMedianExpression(): boolean  {
        const info = this.getCurrentInfo();
        let data = [];
        if (info.medianexpression) {
            data = info.medianexpression.filter(
                d => d.medianlogcpm && d.medianlogcpm > 0 ? true : false
            );
        }
        return info && info.medianexpression && data.length > 0 ? true : false;
    }
}
