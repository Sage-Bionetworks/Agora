import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

// Updating to rxjs 6 import statement
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, empty } from 'rxjs';

import { Gene, GeneInfo, GeneInfosResponse, GeneResponse } from '../../models';

import {
    ApiService,
    GeneService
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
    @Input() infos: Gene[];
    queryField: FormControl = new FormControl();
    results: GeneInfo[] = [];
    hasFocus: boolean = false;
    isSearching: boolean = false;
    gene: Gene;

    constructor(
        private router: Router,
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
                this.results = (data.items) ? data.items : [];
            }, (error) => {
                console.log('Invalid search!: ' + error.message);
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
        if (!this.geneService.getCurrentGene()) {
            this.getGene(info.hgnc_symbol);
        } else {
            this.geneService.updatePreviousGene();
            if (this.geneService.getCurrentGene().hgnc_symbol !== info.hgnc_symbol) {
                this.getGene(info.hgnc_symbol);
            } else {
                this.goToRoute(
                    '/genes',
                    { outlets: {'genes-router':
                        [
                            'gene-details', this.geneService.getCurrentGene().ensembl_gene_id
                        ]
                    }}
                );
            }
        }
    }

    getGene(geneSymbol: string) {
        this.apiService.getGene(geneSymbol).subscribe((data: GeneResponse) => {
            if (!data.info) {
                this.router.navigate(['./genes']);
            } else {
                if (!data.item) {
                    // Fill in a new gene with the info attributes
                    data.item = this.geneService.getEmptyGene(
                        data.info.ensembl_gene_id, data.info.hgnc_symbol
                    );
                }
                this.geneService.updatePreviousGene();
                this.geneService.updateGeneData(data);
                this.gene = data.item;
            }
        }, (error) => {
            console.log('Routing error! ' + error.message);
        }, () => {
            this.goToRoute(
                '/genes',
                { outlets: {'genes-router': [ 'gene-details', this.gene.ensembl_gene_id ] }}
            );
        });
    }

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets]) : this.router.navigate([path]);
    }
}
