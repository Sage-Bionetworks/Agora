import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
    BreadcrumbService,
    GeneService,
    DataService
} from 'app/core/services';

import { Gene } from '../../models';

import { DecimalPipe } from '@angular/common';
import { NumbersPipe } from '../../shared/pipes';

import {
    Message,
    SortEvent,
    LazyLoadEvent
} from 'primeng/primeng';



@Component({
    selector: 'targets-list',
    templateUrl: './targets-list.component.html',
    styleUrls: [ './targets-list.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class TargetsListComponent implements OnInit {
    @Input() genes: Gene[];
    datasource: Gene[];

    msgs: Message[] = [];
    totalRecords: number;
    cols: any[];
    loading: boolean;
    rowGroupMetadata: any;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private dataService: DataService,
        private geneService: GeneService
    ) { }

    ngOnInit() {
        this.cols = [
            { field: 'hgnc_symbol', header: 'Gene' },
            { field: 'AveExpr', header: 'Score' }
        ];

        // USe a promise when doing remotely
        this.datasource = this.dataService.getTableData();
        this.totalRecords = this.datasource.length;

        this.loading = true;
    }

    getAlignment(i: number, max: number) {
        return (i < max) ? 'left' : 'right';
    }

    onRowSelect(event) {
        this.msgs = [{severity:'info', summary:'Gene Selected', detail:'Gene: ' + event.data.hgnc_symbol}];
        this.geneService.setCurrentGene(event.data);
        let gene = this.geneService.getCurrentGene();
        if (gene) {
            this.geneService.filterTissuesModels(gene).then((status) => {
                if (status) this.router.navigate(['gene-details', gene.hgnc_symbol], {relativeTo: this.route});
            });
        }
    }

    onRowUnselect(event) {
        this.msgs = [{severity:'info', summary:'Gene Unselected', detail:'Gene: ' + event.data.hgnc_symbol}];
        this.geneService.setCurrentGene(null);
    }

    isNaN(input: any) {
        return isNaN(input);
    }

    customSort(event: SortEvent) {
        event.data.sort((data1, data2) => {
            let value1 = data1[event.field];
            let value2 = data2[event.field];
            let result = null;

            if (value1 == null && value2 != null)
                result = -1;
            else if (value1 != null && value2 == null)
                result = 1;
            else if (value1 == null && value2 == null)
                result = 0;
            else if (typeof value1 === 'string' && typeof value2 === 'string')
                result = value1.localeCompare(value2);
            else
                result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

            return (event.order * result);
        });
    }

    loadCarsLazy(event: LazyLoadEvent) {
        this.loading = true;

        //in a real application, make a remote request to load data using state metadata from event
        //event.first = First row offset
        //event.rows = Number of rows per page
        //event.sortField = Field name to sort with
        //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
        //filters: FilterMetadata object having field as key and filter value, filter matchMode as value

        //imitate db connection over a network
        setTimeout(() => {
            if (this.datasource) {
                this.genes = this.datasource.slice(event.first, (event.first + event.rows));
                this.loading = false;
            }
        }, 500);
    }
}
