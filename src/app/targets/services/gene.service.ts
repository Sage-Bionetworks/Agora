import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Response } from '@angular/http';
import { Gene } from '../../shared/models';

import { PapaParseService } from 'ngx-papaparse';
import { fromCSV } from 'rx-from-csv';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class GeneService {
    genes: Gene[] = [];

    private currentGene: Gene;

    constructor(
        private http: HttpClient,
        private papa: PapaParseService
    ) {}

    getGene(fname: string): any {
        return this.http.get<Gene[]>('/assets/data/' + fname);
    }

    setCurrentGene(gene: Gene) {
        this.currentGene = gene;
    }

    getCurrentGene() {
        return this.currentGene;
    }
}
