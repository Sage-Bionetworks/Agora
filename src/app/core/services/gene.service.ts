import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Response } from '@angular/http';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Gene } from '../../models';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import * as d3 from 'd3';

@Injectable()
export class GeneService {
    private genes: Gene[] = [];
    private plotGenes: Gene[] = [];
    private currentGene: Gene;
    private forestInfo: Map<string, any> = new Map<string, any>();

    private genesCollection: AngularFirestoreCollection<Gene>;
    private dbgenes: Observable<Gene[]>;

    // Chart related variables, move this?
    maxAdjPVal: number = -Infinity;
    minLogFC: number = +Infinity;
    maxLogFC: number = -Infinity;
    ci_L: number = +Infinity;
    ci_R: number = -Infinity;
    models: string[] = [];
    tissues: string[] = [];

    constructor(
        private http: HttpClient,
        private afs: AngularFirestore
    ) {
        //this.genesCollection = this.afs.collection('genes'); // reference
        //this.dbgenes = this.genesCollection.valueChanges(); // observable of genes data
    }

    loadGenes(fname: string) {
        this.loadGenesFile(fname).subscribe(data => {
            this.genes = data;
        })
    }

    loadPlotGenes(tissues: string[], models: string[]) {
        this.plotGenes = this.filterPlotGenes(tissues, models);
    }

    loadGenesFile(fname: string): Observable<Gene[]> {
        return (this.dbgenes) ? this.dbgenes : this.http.get<Gene[]>('/assets/data/' + fname);
    }

    getDBGenes(): Observable<Gene[]> {
        return this.dbgenes;
    }

    getGenes(): Gene[] {
        return this.genes;
    }

    getPlotGenes() {
        return this.plotGenes;
    }

    setGenes(genes: Gene[]) {
        this.genes = genes;
    }

    setPlotGenes(genes: Gene[]) {
        this.plotGenes = genes;
    }

    setCurrentGene(gene: Gene) {
        this.currentGene = gene;
    }

    getCurrentGene() {
        return this.currentGene;
    }

    getTissues(fname: string): Observable<string[]> {
        return this.http.get<string[]>('/assets/data/' + fname);
    }

    getModels(fname: string): Observable<string[]> {
        return this.http.get<string[]>('/assets/data/' + fname);
    }

    filterGenes(id: string) {
        this.genes.filter(g => {
            g.tissue_study_pretty = g.tissue_study_pretty.split('.').join('_');
            g.comparison_model_sex = g.comparison_model_sex.split('.').join('_');

            if (+g.logFC > this.maxLogFC) this.maxLogFC = +g.logFC;
            if (+g.logFC < this.minLogFC) this.minLogFC = +g.logFC;
            if (+g.neg_log10_adj_P_Val > this.maxAdjPVal) this.maxAdjPVal = +g.neg_log10_adj_P_Val;
            if (+g.CI_L < this.ci_L) this.ci_L = +g.CI_L;
            if (+g.CI_R > this.ci_R) this.ci_R = +g.CI_R;
            if (id === g.hgnc_symbol) {
                this.tissues.push(g.tissue_study_pretty);
                this.models.push(g.comparison_model_sex);
            }
            return id === g.hgnc_symbol;
        });
        this.models = this.models.filter((m, index, self) => {
            return self.indexOf(m) === index;
        });
        this.tissues = this.tissues.filter((t, index, self) => {
            return self.indexOf(t) === index;
        });
        this.plotGenes = this.filterPlotGenes(this.tissues, this.models);
    }

    filterPlotGenes(tissues: string[], models: string[]): Gene[] {
        return this.genes.filter(g => {
            return tissues.some(t => { return t === g.tissue_study_pretty}) ||
                models.some(m => { return m === g.comparison_model_sex});
        })
    }
}
