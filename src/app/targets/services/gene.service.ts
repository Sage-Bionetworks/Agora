import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Response } from '@angular/http';
import { Gene } from '../../shared/models';

import { PapaParseService } from 'ngx-papaparse';
import { fromCSV } from 'rx-from-csv';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class GeneService {
    private genes: Gene[] = [];
    private currentGene: Gene;

    constructor(
        private http: HttpClient,
        private papa: PapaParseService
    ) {}

    getGenes(fname: string): Observable<Gene[]> {
        return this.http.get<Gene[]>('/assets/data/' + fname);
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

    getTissues(genes?: Gene[]): string[] {
        console.log(this.genes);
        console.log([...Array.from(new Set(this.genes.map(item => item.Tissue)))]);
        return genes ? [...Array.from(new Set(genes.map(item => item.Tissue)))] : [...Array.from(new Set(this.genes.map(item => item.Tissue)))];
    }
}
