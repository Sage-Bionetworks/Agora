import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Gene, GeneInfo, GeneInfosResponse, GeneResponse } from '../../models';

import {
    ApiService,
    GeneService,
    NavigationService
} from '../../core/services';

// Updating to rxjs 6 import statement
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, empty } from 'rxjs';

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
    @Input() infos: Gene[];
    queryField: FormControl = new FormControl();
    results: GeneInfo[] = [];
    hasFocus: boolean = false;
    isSearching: boolean = false;
    gene: Gene;

    constructor(
        private navService: NavigationService,
        private apiService: ApiService,
        private geneService: GeneService
    ) { }

    ngOnInit() {
        this.queryField.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((query) => {
                    if (query) {
                        this.isSearching = true;
                        return this.search(query);
                    } else {
                        this.isSearching = false;
                        this.results = [];
                        return empty();
                    }
                })
            )
            // If you add a complete callback, it is never called here
            .subscribe((data: GeneInfosResponse) => {
                this.isSearching = false;
                if (data.isEnsembl) {
                    // It is safe to get the first index here because there will be only
                    // one match when using the ensembl id
                    this.viewGene(data.items[0]);
                } else {
                    this.results = (data.items) ? data.items : [];
                }
            }, (error) => {
                this.isSearching = false;
            });
    }

    search(queryString: string): Observable<any> {
        if (queryString) {
            return this.apiService.getInfosMatchId(queryString);
        } else {
            this.isSearching = false;
            return empty();
        }
    }

    focusSearchList(state: boolean) {
        this.hasFocus = state;
    }

    closeSearchList(event: any) {
        if (!this.hasFocus) { this.results = []; }
    }

    getGeneId(): string {
        return this.gene.hgnc_symbol;
    }

    viewGene(info: GeneInfo) {
        this.navService.setOvMenuTabIndex(0);
        if (!this.geneService.getCurrentGene()) {
            this.getGene(info.hgnc_symbol);
        } else {
            if (this.geneService.getCurrentGene().hgnc_symbol !== info.hgnc_symbol) {
                this.getGene(info.hgnc_symbol);
            }
        }
    }

    getGene(geneSymbol: string) {
        this.apiService.getGene(geneSymbol).subscribe((data: GeneResponse) => {
            if (!data.info) {
                this.navService.goToRoute('./genes');
            } else {
                if (!data.item) {
                    // Fill in a new gene with the info attributes
                    data.item = this.geneService.getEmptyGene(
                        data.info.ensembl_gene_id, data.info.hgnc_symbol
                    );
                }
                const updatePromise = new Promise((resolve, reject) => {
                    this.geneService.updatePreviousGene();
                    this.geneService.updateGeneData(data);
                    this.gene = data.item;

                    resolve(true);
                });
                updatePromise.then(() => {
                    this.navService.goToRoute(
                        '/genes',
                        { outlets: {'genes-router': [ 'gene-details', this.gene.ensembl_gene_id ] }}
                    );
                });
            }
        }, (error) => {
            console.log('Routing error! ' + error.message);
        });
    }
}
