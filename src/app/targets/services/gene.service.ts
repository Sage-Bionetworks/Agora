import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Response } from '@angular/http';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Gene } from '../../models';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class GeneService {
    private genes: Gene[] = [];
    private currentGene: Gene;

    private genesCollection: AngularFirestoreCollection<Gene>;
    private dbgenes: Observable<Gene[]>;

    constructor(
        private http: HttpClient,
        private afs: AngularFirestore
    ) {
        //this.genesCollection = this.afs.collection('genes'); // reference
        //this.dbgenes = this.genesCollection.valueChanges(); // observable of genes data
    }

    getGenes(fname: string): Observable<Gene[]> {
        return (this.dbgenes) ? this.dbgenes : this.http.get<Gene[]>('/assets/data/' + fname);
    }

    getDBGenes(): Observable<Gene[]> {
        return this.dbgenes;
    }

    getGenesArray() {
        return this.genes;
    }

    setGenes(genes: Gene[]) {
        this.genes = genes;
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
}
