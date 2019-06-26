import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Gene, GeneInfo, GeneInfosResponse, GeneResponse } from '../../models';

import {
    ApiService,
    GeneService,
    NavigationService
} from '../../core/services';

// Updating to rxjs 6 import statement
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Observable, empty, throwError } from 'rxjs';

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
    notFoundString: string = 'No results found. Try searching by the Ensembl Gene ID.';
    isNotFound: boolean = false;
    currentQuery: string = '';

    constructor(
        private navService: NavigationService,
        private apiService: ApiService,
        private geneService: GeneService
    ) { }

    ngOnInit() {
        this.initQueryField();
    }

    initQueryField() {
        this.queryField.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((query) => {
                    this.results = [];

                    if (query) {
                        this.currentQuery = query;
                        this.isSearching = true;
                        return this.search(query);
                    } else {
                        this.currentQuery = '';
                        this.isSearching = false;
                        return empty();
                    }
                }),
                catchError((err) => throwError(err))
            )
            // If you add a complete callback, it is never called here
            .subscribe((data: GeneInfosResponse) => {
                this.isSearching = false;

                // If we got an empty array as response, or no genes found
                if (!data.items.length) {
                    this.isNotFound = true;
                    this.results = [{
                        '_id': this.notFoundString,
                        'ensembl_gene_id': this.notFoundString,
                        'name': this.notFoundString,
                        'hgnc_symbol': this.notFoundString,
                        'type_of_gene': this.notFoundString,
                        'go.MF': [],
                        'isIGAP': false,
                        'haseqtl': false,
                        'isChangedInADBrain': false,
                        'medianexpression': [],
                        'nominatedtarget': [],
                        'nominations': 0
                    } as GeneInfo];
                } else {
                    this.isNotFound = false;
                    if (data.isEnsembl) {
                        // It is safe to get the first index here because there will be only
                        // one match when using the ensembl id
                        this.viewGene(data.items[0]);
                    } else {
                        this.results = data.items;
                    }
                }
            }, (error) => {
                this.queryField = new FormControl();
                this.results = [];
                this.initQueryField();
                this.isSearching = false;
            });
    }

    search(queryString: string): Observable<any> {
        if (queryString) {
            // const response = this.apiService.getInfosMatchId(queryString);
            // return response;
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
        if (info.name !== this.notFoundString) {
            this.navService.setOvMenuTabIndex(0);
            // We don't have a gene
            if (!this.geneService.getCurrentGene()) {
                this.getGene(info.hgnc_symbol);
            } else {
                this.geneService.updatePreviousGene();
                // We have a gene, but it's a new one
                if (this.geneService.getCurrentGene().hgnc_symbol !== info.hgnc_symbol) {
                    this.getGene(info.hgnc_symbol);
                } else {
                    this.navService.goToRoute(
                        '/genes',
                        {
                            outlets: {
                                'genes-router': [
                                    'gene-details',
                                    this.geneService.getCurrentGene().ensembl_gene_id
                                ]
                            }
                        }
                    );
                }
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
                        {
                            outlets: {
                                'genes-router': [
                                    'gene-details',
                                    this.geneService.getCurrentGene().ensembl_gene_id
                                ]
                            }
                        }
                    );
                });
            }
        }, (error) => {
            console.log('Routing error! ' + error.message);
        });
    }

    // The parameter is the gene hgnc_symbol from the server. To be calssified as an alias,
    // the resulting hgnc_symbol can't have the search query
    hasAlias(hgncSymbol: string): boolean {
        return !hgncSymbol.includes(this.currentQuery.toUpperCase());
    }
}
