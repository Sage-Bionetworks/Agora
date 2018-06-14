import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';

import { DataService } from './';

import { Gene } from '../../models';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class GeneService {
    // Add the new #[field] from TypeScript when it's out
    // https://github.com/Microsoft/TypeScript/issues/24418
    currentGene: Gene;
    currentTissue: string;
    currentModel: string;
    models: string[] = [];
    tissues: string[] = [];
    minLogFC: number = 0;
    maxLogFC: number = 10;
    maxAdjPValue: number = 1e-50;
    minAdjPValue: number = Math.pow(10, -20);

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
