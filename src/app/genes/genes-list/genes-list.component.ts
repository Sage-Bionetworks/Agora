import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
    GeneService,
    ApiService
} from '../../core/services';

import { GeneInfo, NominatedTarget, GeneResponse } from '../../models';

import {
    Message,
    SortEvent
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
        private apiService: ApiService,
        private geneService: GeneService
    ) { }

    ngOnInit() {
        this.cols = [
            { field: 'hgnc_symbol', header: 'Gene Symbol' },
            { field: 'nominations', header: 'Nominations' },
            { field: 'nominatedtarget', header: 'Teams' }
        ];

        this.apiService.getTableData().subscribe((data) => {
            this.datasource = (data['items']) ? data['items'] as GeneInfo[] : [];
            this.genesInfo = this.datasource;
            this.totalRecords = (data['totalRecords']) ? (data['totalRecords']) : 0;

            // Starts table with the nominations columns sorted in descending order
            this.customSort({
                data: this.datasource,
                field: 'nominations',
                mode: 'single',
                order: -1
            } as SortEvent);

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
        if (!this.geneService.getCurrentGene()) {
            this.getGene(this.selectedInfo.hgnc_symbol);
        } else {
            this.geneService.updatePreviousGene();
            if (this.geneService.getCurrentGene().hgnc_symbol !== this.selectedInfo.hgnc_symbol) {
                this.getGene(this.selectedInfo.hgnc_symbol);
            } else {
                this.goToRoute(
                    '../gene-details',
                    this.geneService.getCurrentGene().ensembl_gene_id
                );
            }
        }
    }

    getGene(geneSymbol: string) {
        this.apiService.getGene(geneSymbol).subscribe((data: GeneResponse) => {
            if (!data.item) { this.router.navigate(['/genes']); }
            this.geneService.updatePreviousGene();
            this.geneService.updateGeneData(data);
            this.goToRoute('../gene-details', this.selectedInfo.ensembl_gene_id);
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

    getTeams(nomTargets: NominatedTarget[]): string {
        return nomTargets.map((nt) => nt.team).join(', ');
    }

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets], { relativeTo: this.route }) :
            this.router.navigate([path], { relativeTo: this.route });
    }
}
