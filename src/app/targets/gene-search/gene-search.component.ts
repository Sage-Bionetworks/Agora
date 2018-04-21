import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/empty'
import { Observable } from 'rxjs/Observable';

import { Gene } from '../../models';

import {
    BreadcrumbService,
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

    private gene: Gene;

    geneId;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private dataService: DataService,
        private geneService: GeneService
    ) { }

    ngOnInit() {
        //this.genes = this.dataService.getTableData();
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
            .subscribe(data => {
                this.results = (data['items']) ? <Gene[]>data['items'] : [];
            })
    }

    search(queryString: string) {
        if (queryString) return this.dataService.getGenesMatchId(queryString);
    }

    getGeneId() {
        return this.gene.hgnc_symbol;
    }

    viewGene(gene: Gene) {
        this.geneService.setCurrentGene(gene);
        this.geneId = gene.hgnc_symbol;
        this.gene = gene;
        if (this.gene) this.router.navigate(['gene-details', this.gene.hgnc_symbol], {relativeTo: this.route});
    }
}
