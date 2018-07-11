import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Gene, GeneInfo, TeamInfo } from '../../models';

@Injectable()
export class GeneService {
    // Add the new #[field] from TypeScript when it's out
    // https://github.com/Microsoft/TypeScript/issues/24418
    currentGene: Gene;
    currentInfo: GeneInfo;
    currentTeams: TeamInfo[];
    currentTissue: string;
    currentModel: string;
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

    constructor(
        private http: HttpClient
    ) {}

    setCurrentGene(gene: Gene) {
        this.currentGene = gene;
    }

    getCurrentGene(): Gene {
        return this.currentGene;
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

    getCurrentTissue() {
        return this.currentTissue;
    }

    setCurrentModel(model: string) {
        this.currentModel = model;
    }

    getCurrentModel() {
        return this.currentModel;
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

    loadTissues(): Promise<any> {
        return new Promise((resolve, reject) => {
            const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
            this.http.get('/api/tissues', { headers }).subscribe((data) => {
                this.tissues = data['items'];
            }, (error) => {
                console.log('Error loading tissues! ' + error.message);
            }, () => {
                resolve(true);
            });
        });
    }

    loadGeneTissues(): Promise<any> {
        return new Promise((resolve, reject) => {
            const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
            this.http.get('/api/tissues/gene', { headers }).subscribe((data) => {
                this.geneTissues = data['items'];
            }, (error) => {
                console.log('Error loading tissues! ' + error.message);
            }, () => {
                resolve(true);
            });
        });
    }

    loadModels(): Promise<any> {
        return new Promise((resolve, reject) => {
            const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
            this.http.get('/api/models', { headers }).subscribe((data) => {
                this.models = data['items'];
            }, (error) => {
                console.log('Error loading models! ' + error.message);
            }, () => {
                resolve(true);
            });
        });
    }

    loadGeneModels(): Promise<any> {
        return new Promise((resolve, reject) => {
            const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
            this.http.get('/api/models/gene', { headers }).subscribe((data) => {
                this.geneModels = data['items'];
            }, (error) => {
                console.log('Error loading models! ' + error.message);
            }, () => {
                resolve(true);
            });
        });
    }
}
