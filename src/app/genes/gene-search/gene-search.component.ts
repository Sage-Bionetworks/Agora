import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/empty';
import { Observable } from 'rxjs/Observable';

import { Gene } from '../../models';

import {
    GeneService,
    DataService
} from '../../core/services';

@Component({
    selector: 'gene-search',
    templateUrl: './gene-search.component.html',
    styleUrls: [ './gene-search.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GeneSearchComponent implements OnInit {
    @Input() fname: string;
    @Input() styleClass: string = '';
    @Input() style: any;
    @Input() genes: Gene[];
    queryField: FormControl = new FormControl();
    results: Gene[] = [];
    hasFocus: boolean = false;

    private gene: Gene;

    constructor(
        private router: Router,
        private dataService: DataService,
        private geneService: GeneService
    ) { }

    ngOnInit() {
        this.queryField.valueChanges
            .debounceTime(300)
            .distinctUntilChanged()
            .switchMap((query) => {
                if (query) {
                    return this.search(query);
                } else {
                    this.results = [];
                    return Observable.empty<Response>();
                }
            })
            .subscribe((data) => {
                this.results = (data['items']) ? data['items'] as Gene[] : [];
            });
    }

    search(queryString: string) {
        if (queryString) { return this.dataService.getGenesMatchId(queryString); }
    }

    focusSearchList(state: boolean) {
        this.hasFocus = state;
    }

    closeSearchList(event: any) {
        if (!this.hasFocus) { this.results = []; }
    }

    getGeneId() {
        return this.gene.hgnc_symbol;
    }

    viewGene(gene: Gene) {
        this.dataService.getGene(gene.hgnc_symbol).subscribe((data) => {
            if (!data['item']) { this.router.navigate(['/genes']); }
            this.geneService.setCurrentGene(data['item']);
            this.geneService.setFC(data['minFC'], data['maxFC']);
            this.geneService.setLogFC(data['minLogFC'], data['maxLogFC']);
            this.geneService.setAdjPValue(data['minAdjPValue'], data['maxAdjPValue']);
            this.gene = data['item'];
            this.router.navigate([
                '/genes',
                { outlets: {'genes-router': [ 'gene-details', data['item'].ensembl_gene_id ] }}
            ]);
        });
    }
}
