import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import {
    BreadcrumbService,
    GeneService,
    DataService
} from 'app/core/services';

import { Gene } from '../../models';

import {
    Message,
    SortEvent,
    LazyLoadEvent,
    FilterMetadata
} from 'primeng/primeng';

@Component({
    selector: 'genes-list',
    templateUrl: './genes-list.component.html',
    styleUrls: [ './genes-list.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GenesListComponent implements OnInit {
    @Input() genes: Gene[];

    datasource: Gene[];
    msgs: Message[] = [];
    selectedGene: Gene;
    totalRecords: number;
    cols: any[];
    loading: boolean = true;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private breadcrumb: BreadcrumbService,
        private dataService: DataService,
        private geneService: GeneService,
        private location: Location
    ) { }

    ngOnInit() {
        this.breadcrumb.setCrumbs([
            { label: 'GENES', routerLink: ['/genes'] },
            { label: 'LIST', routerLink: ['/genes/genes-list'] }
        ]);

        this.cols = [
            { field: 'hgnc_symbol', header: 'Gene name' },
            { field: 'aveexpr', header: 'Number of nominations' }
        ];
    }

    getAlignment(i: number, max: number) {
        return (i < max) ? 'left' : 'right';
    }

    onRowSelect(event) {
        this.msgs = [{
            severity: 'info',
            summary: 'Gene Selected',
            detail: 'Gene: ' + event.data.hgnc_symbol
        }];
        this.dataService.getGene(this.selectedGene.hgnc_symbol).subscribe((data) => {
            if (!data['item']) { this.router.navigate(['/genes']); }
            this.geneService.setCurrentGene(data['item']);
            this.geneService.setLogFC(data['minLogFC'], data['maxLogFC']);
            this.geneService.setNegAdjPValue(data['maxNegLogPValue']);
            this.router.navigate(
                ['../gene-details', this.selectedGene.hgnc_symbol],
                {relativeTo: this.route}
            );
        });
    }

    onRowUnselect(event) {
        this.msgs = [{
            severity: 'info',
            summary: 'Gene Unselected',
            detail: 'Gene: ' + event.data.hgnc_symbol
        }];
        this.geneService.setCurrentGene(null);
    }

    isNaN(input: any) {
        return isNaN(input);
    }

    customSort(event: SortEvent) {
        event.data.sort((data1, data2) => {
            const value1 = data1[event.field];
            const value2 = data2[event.field];
            let result = null;

            if (value1 == null && value2 != null) {
                result = -1;
            } else if (value1 != null && value2 == null) {
                result = 1;
            } else if (value1 == null && value2 == null) {
                result = 0;
            } else if (typeof value1 === 'string' && typeof value2 === 'string') {
                result = value1.localeCompare(value2);
            } else {
                result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
            }

            return (event.order * result);
        });
    }

    loadGenesLazy(event: LazyLoadEvent) {
        this.loading = true;

        // Make a remote request to load data using state metadata from event
        // event.first = First row offset
        // event.rows = Number of rows per page
        // event.sortField = Field name to sort with
        // event.sortOrder = Sort order as number, 1 for asc and -1 for dec
        // filters: FilterMetadata object having field as key and filter value, filter
        // matchMode as value

        // Use a promise when doing remotely
        this.dataService.getTableData(event).subscribe((data) => {
            this.datasource = (data['items']) ? data['items'] as Gene[] : [];
            this.genes = this.datasource;
            this.totalRecords = (data['totalRecords']) ? (data['totalRecords']) : 0;
            this.loading = false;
        });
    }

    goBack() {
        this.location.back();
    }
}
