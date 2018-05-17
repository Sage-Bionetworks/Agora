import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';

import { DataService } from './';

import { Gene } from '../../models';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class GeneService {
    private currentGene: Gene;
    private currentTissue: string;
    private currentModel: string;
    private models: string[] = [];
    private tissues: string[] = [];
    private minLogFC: number = 0;
    private maxLogFC: number = 10;
    private maxNegLogPValue: number = 50;
    private minNegLogPValue: number = 0;

    constructor(
        private http: HttpClient,
        private decimalPipe: DecimalPipe,
        private dataService: DataService
    ) {}

    setCurrentGene(gene: Gene) {
        this.currentGene = gene;
    }

    getCurrentGene() {
        return this.currentGene;
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

    getModels(): string[] {
        return this.models;
    }

    setLogFC(min: number, max: number) {
        this.minLogFC = min;
        this.maxLogFC = max;
    }

    getLogFC(): number[] {
        return [this.minLogFC, this.maxLogFC];
    }

    setNegAdjPValue(max: number, min?: number) {
        this.maxNegLogPValue = max;
        this.minNegLogPValue = (min) ? min : 0;
    }

    getNegAdjPValue(): number[] {
        return [0, this.maxNegLogPValue];
    }

    loadTissues(): Promise<any> {
        return new Promise((resolve, reject) => {
            const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
            this.http.get('/api/tissues', { headers }).subscribe((data) => {
                this.tissues = data['items'];

                resolve(true);
            });
        });
    }

    loadModels(): Promise<any> {
        return new Promise((resolve, reject) => {
            const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
            this.http.get('/api/models', { headers }).subscribe((data) => {
                this.models = data['items'];

                resolve(true);
            });
        });
    }
}
