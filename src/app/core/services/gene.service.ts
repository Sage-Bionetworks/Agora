import { Injectable } from '@angular/core';

import { Gene, GeneInfo, TeamInfo, TissuesResponse, ModelsResponse } from '../../models';

import { ApiService } from './api.service';

@Injectable()
export class GeneService {
    // Add the new #[field] from TypeScript when it's out
    // https://github.com/Microsoft/TypeScript/issues/24418
    previousGene: Gene;
    currentGene: Gene;
    currentInfo: GeneInfo;
    currentTeams: TeamInfo[];
    currentTissue: string;
    currentModel: string;
    defaultTissue: string = 'DLPFC';
    models: string[] = [];
    geneModels: string[] = [];
    tissues: string[] = [];
    geneTissues: string[] = [];
    minFC: number = 0;
    maxFC: number = 10;
    minLogFC: number = 0;
    maxLogFC: number = 10;
    maxAdjPValue: number = 1e-50;
    minAdjPValue: number = Math.pow(10, -20);

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

    setCurrentInfo(geneInfo: GeneInfo) {
        this.currentInfo = geneInfo;
    }

    getCurrentInfo(): GeneInfo {
        return this.currentInfo;
    }

    setCurrentTeams(teams: TeamInfo[]) {
        this.currentTeams = teams;
    }

    getCurrentTeams(): TeamInfo[] {
        return this.currentTeams;
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

    getDefaultTissue(): string {
        return this.defaultTissue;
    }

    setDefaultTissue(tissue: string) {
        this.defaultTissue = tissue;
    }

    getTissues(): string[] {
        return this.tissues;
    }

    setTissues(tissues: string[]) {
        this.tissues = tissues;
    }

    getGeneTissues(): string[] {
        return this.geneTissues;
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
        return this.geneModels;
    }

    setGeneModels(models: string[]) {
        this.geneModels = models;
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

    getEmptyGene(ensemblGeneId?: string, hgncSymbol?: string): Gene {
        const eGene = {
            _id: '',
            ensembl_gene_id: '',
            hgnc_symbol: '',
            logfc: 0,
            ci_l: 0,
            ci_r: 0,
            adj_p_val: 0,
            tissue: '',
            study: '',
            model: ''
        } as Gene;
        if (ensemblGeneId) { eGene.ensembl_gene_id = ensemblGeneId; }
        if (hgncSymbol) { eGene.hgnc_symbol = hgncSymbol; }
        return eGene;
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
            this.getPreviousGene().hgnc_symbol !== this.getCurrentGene().hgnc_symbol :
            false;
    }
}
