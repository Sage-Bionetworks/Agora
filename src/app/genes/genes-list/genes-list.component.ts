import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import {
    GeneService,
    DataService
} from '../../core/services';

import { GeneInfo, NominatedTarget } from '../../models';

import {
    Message,
    SortEvent,
    LazyLoadEvent
} from 'primeng/primeng';

@Component({
    selector: 'genes-list',
    templateUrl: './genes-list.component.html',
    styleUrls: [ './genes-list.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GenesListComponent implements OnInit {
    @Input() genesInfo: GeneInfo[];

    datasource: GeneInfo[];
    msgs: Message[] = [];
    selectedInfo: GeneInfo;
    totalRecords: number;
    cols: any[];
    loading: boolean = true;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private dataService: DataService,
        private geneService: GeneService,
        private location: Location
    ) { }

    ngOnInit() {
        this.cols = [
            { field: 'hgnc_symbol', header: 'Gene name' },
            { field: 'nominations', header: 'Nominations' },
            { field: 'nominatedtarget', header: 'Teams' }
        ];

        this.dataService.getTableData().subscribe((data) => {
            this.datasource = (data['items']) ? data['items'] as GeneInfo[] : [];
            this.genesInfo = this.datasource;
            this.totalRecords = (data['totalRecords']) ? (data['totalRecords']) : 0;
            this.loading = false;
        });
    }

    getAlignment(i: number, max: number): string {
        return (i < max) ? 'left' : 'right';
    }

    onRowSelect(event) {
        this.msgs = [{
            severity: 'info',
            summary: 'Gene Selected',
            detail: 'Gene: ' + event.data.hgnc_symbol
        }];
        if (!this.selectedInfo) { this.selectedInfo = event.data; }
        this.dataService.getGene(this.selectedInfo.hgnc_symbol).subscribe((data) => {
            if (!data['item']) { this.router.navigate(['/genes']); }
            this.geneService.updateGeneData(data);
            this.router.navigate(
                ['../gene-details', this.selectedInfo.ensembl_gene_id],
                {relativeTo: this.route}
            );
        });
    }

    onRowUnselect(event) {
        this.msgs = [{
            severity: 'info',
            summary: 'Gene Unselected',
            detail: 'Gene: ' + event.data.ensembl_gene_id
        }];
        this.geneService.setCurrentGene(null);
    }

    isNaN(input: any): boolean {
        return isNaN(input);
    }

    customSort(event: SortEvent) {
        event.data.sort((data1, data2) => {
            const value1 = (Array.isArray(data1[event.field])) ?
                data1[event.field].map((nt) => nt.team).join(', ') :
                data1[event.field];
            const value2 = (Array.isArray(data2[event.field])) ?
                data2[event.field].map((nt) => nt.team).join(', ') :
                data2[event.field];
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
        if (this.loading) {
            this.dataService.getPageData(event).subscribe((data) => {
                this.datasource = (data['items']) ? data['items'] as GeneInfo[] : [];
                this.genesInfo = this.datasource;
                this.totalRecords = (data['totalRecords']) ? (data['totalRecords']) : 0;
                this.loading = false;
            });
        }
    }

    getTeams(nomTargets: NominatedTarget[]): string {
        return nomTargets.map((nt) => nt.team).join(', ');
    }

    goBack() {
        this.location.back();
    }
}
