import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Response } from '@angular/http';
import { Gene } from '../_models';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class GeneService {

    constructor(private http: HttpClient) {}

    getGenes(fname?: string): Observable<Gene[]> {
        return this.http.get<Gene[]>('/assets/data/' + ((fname) ? fname : 'default.json'));
    }
}
