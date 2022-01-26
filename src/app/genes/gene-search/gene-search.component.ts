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
    currentQuery: string = '';
    isSearching: boolean = false;
    isEnsemblIdSearch: boolean = false;
    isNotFound: boolean = false;
    results: GeneInfo[] = [];
    hasFocus: boolean = false;
    gene: Gene;
    hgncSymbolNotFoundString: string = 'No results found. Try searching by the Ensembl Gene ID.';
    ensemblIdNotFoundString: string = 'Unable to find a matching gene. Try searching by gene symbol.';
    notValidSearchString: string = 'Please enter a least two characters.';
    notValidEnsemblIdString: string = 'You must enter a full 15-character value to search for a gene by Ensembl identifier.';

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
                debounceTime(500),
                distinctUntilChanged(),
                switchMap((query) => {
                    this.results = [];
                    return this.search(query);
                }),
                catchError((err) => throwError(err))
            )
            // If you add a complete callback, it is never called here
            .subscribe((data: GeneInfosResponse) => {
                this.isSearching = false;

                // If we got an empty array as response, or no genes found
                if (!data.items.length) {
                    this.isNotFound = true;
                    this.setErrorMessage(this.isEnsemblIdSearch ? this.ensemblIdNotFoundString : this.hgncSymbolNotFoundString);
                } else {
                    this.isNotFound = false;
                    if (data.isEnsembl) {
                        // Multiple matching genes: This should never happen…but if it does, log an error
                        if (data.items.length > 1) {
                            console.log('Unexpected duplicate gene_info objects for ensembl ID "' + this.currentQuery + '" found.');
                            this.setErrorMessage(this.ensemblIdNotFoundString);
                        }
                        else {
                            this.viewGene(data.items[0]);
                        }
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

    search(query: string): Observable<any> {
        this.isEnsemblIdSearch = false;

        if (query.length < 2) {
            query = '';
            this.setErrorMessage(this.notValidSearchString);
        }
        else if (query.length > 3) {
            const prefix = query.toLowerCase().substring(0, 4);

            if ('ensg' === prefix) {
                const digits = query.toLowerCase().substring(4, query.length);
                this.isEnsemblIdSearch = true;

                // Check if 11 digits numeric string
                if (digits.length !== 11 || !/^\d+$/.test(digits)) {
                    query = '';
                    this.setErrorMessage(this.notValidEnsemblIdString);
                }
            }
        }

        this.currentQuery = query;
        this.isSearching = query ? true : false;
        return query ? this.apiService.getInfosMatchId(query) : empty();
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
        if (info.name !== this.hgncSymbolNotFoundString && info.name !== this.ensemblIdNotFoundString) {
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

    // The parameter is the gene hgnc_symbol from the server. To be classified as an alias,
    // the resulting hgnc_symbol can't have the search query
    hasAlias(hgncSymbol: string): boolean {
        return !hgncSymbol.includes(this.currentQuery.toUpperCase()) &&
            hgncSymbol !== this.hgncSymbolNotFoundString && hgncSymbol !== this.ensemblIdNotFoundString;
    }

    setErrorMessage(message: string) {
        this.results = [{
            _id: message,
            ensembl_gene_id: message,
            name: message,
            hgnc_symbol: message,
            type_of_gene: message,
            isIGAP: false,
            haseqtl: false,
            isAnyRNAChangedInADBrain: false,
            isAnyProteinChangedInADBrain: false,
            medianexpression: [],
            nominatedtarget: [],
            nominations: 0
        } as GeneInfo];
    }
}
