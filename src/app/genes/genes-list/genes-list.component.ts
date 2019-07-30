import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import {
    GeneService,
    ApiService,
    NavigationService
} from '../../core/services';

import { GeneInfo, NominatedTarget, GeneResponse, GeneInfosResponse } from '../../models';

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
        private navService: NavigationService,
        private apiService: ApiService,
        private geneService: GeneService
    ) { }

    ngOnInit() {
        this.cols = [
            { field: 'hgnc_symbol', header: 'Gene Symbol' },
            { field: 'nominations', header: 'Nominations' },
            { field: 'teams', header: 'Nominating Teams' },
            { field: 'study', header: 'Cohort Study' },
            { field: 'input_data', header: 'Input Data' }
        ];

        this.initData();
    }

    initData() {
        this.apiService.getTableData().subscribe((data: GeneInfosResponse) => {
            this.datasource = (data.items) ? data.items : [];
            this.datasource.forEach((de: GeneInfo) => {
                // First map all entries nested in the data to a new array
                let teamsArray = (de.nominatedtarget.length) ? de.nominatedtarget.map(
                    (nt: NominatedTarget) => nt.team) : [];
                let studyArray = (de.nominatedtarget.length) ? de.nominatedtarget.map(
                    (nt: NominatedTarget) => nt.study) : [];
                let inputDataArray = (de.nominatedtarget.length) ? de.nominatedtarget.map(
                    (nt: NominatedTarget) => nt.input_data) : [];

                // Check if there are any strings with commas inside,
                // if there are separate those into new split strings
                teamsArray = this.commaFlattenArray(teamsArray);
                studyArray = this.commaFlattenArray(studyArray);
                inputDataArray = this.commaFlattenArray(inputDataArray);

                // Join the final strings into a new array removing duplicates
                de.teams = (teamsArray.length) ? teamsArray.filter(this.getUnique)
                    .sort((a: string, b: string) => a.localeCompare(b)).join(', ') : '';
                de.study = (studyArray.length) ? studyArray.filter(this.getUnique)
                    .sort((a: string, b: string) => a.localeCompare(b)).join(', ') : '';
                de.input_data = (inputDataArray.length) ? inputDataArray.filter(this.getUnique)
                    .sort((a: string, b: string) => a.localeCompare(b)).join(', ') : '';
            });
            this.genesInfo = this.datasource;
            this.totalRecords = (data.totalRecords) ? data.totalRecords : 0;

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

    commaFlattenArray(array: any[]): any[] {
        const finalArray: any[] = [];
        if (array.length) {
            array.forEach((t) => {
                if (t) {
                    const i = t.indexOf(', ');
                    if (i > -1) {
                        const tmpArray = t.split(', ');
                        finalArray.push(tmpArray[0]);
                        finalArray.push(tmpArray[1]);
                    } else {
                        finalArray.push(t);
                    }
                } else {
                    finalArray.push('');
                }
            });
            array = finalArray;
        }

        return array;
    }

    getUnique(value, index, self) {
        return self.indexOf(value) === index;
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

        // We don't have a gene
        if (!this.geneService.getCurrentGene()) {
            this.getGene(this.selectedInfo.hgnc_symbol);
        } else {
            this.geneService.updatePreviousGene();
            // We have a gene, but it's a new one
            if (this.geneService.getCurrentGene().hgnc_symbol !== this.selectedInfo.hgnc_symbol) {
                this.navService.setOvMenuTabIndex(0);
                this.getGene(this.selectedInfo.hgnc_symbol);
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

    getGene(geneSymbol: string) {
        this.apiService.getGene(geneSymbol).subscribe((data: GeneResponse) => {
            if (!data.item) { this.navService.getRouter().navigate(['/genes']); }
            this.geneService.updatePreviousGene();
            this.geneService.updateGeneData(data);
            this.navService.goToRoute(
                '/genes',
                {
                    outlets: {
                        'genes-router': [ 'gene-details', this.selectedInfo.ensembl_gene_id ]
                    }
                }
            );
        }, (error) => {
            console.log('Error getting gene: ' + error.message);
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
}
