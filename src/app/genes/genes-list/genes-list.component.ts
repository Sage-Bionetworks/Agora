import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import {
    GeneService,
    ApiService,
    NavigationService,
    DataService
} from '../../core/services';

import { GeneInfo, NominatedTarget, GeneResponse, GeneInfosResponse } from '../../models';

import {
    Message,
    SortEvent
} from 'primeng/primeng';

import * as screenfull from 'screenfull';

@Component({
    selector: 'genes-list',
    templateUrl: './genes-list.component.html',
    styleUrls: [ './genes-list.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GenesListComponent implements OnInit {
    @Input() genesInfo: GeneInfo[];

    dataSource: GeneInfo[];
    msgs: Message[] = [];
    selectedInfo: GeneInfo;
    totalRecords: number;
    cols: any[];
    selectedColumns: any[];
    loading: boolean = true;

    constructor(
        private navService: NavigationService,
        private apiService: ApiService,
        private geneService: GeneService,
        private dataService: DataService
    ) { }

    ngOnInit() {
        this.cols = [
            { field: 'hgnc_symbol', header: 'Gene Symbol'},
            { field: 'nominations', header: 'Nominations' },
            { field: 'initial_nomination', header: 'Year First Nominated' },
            { field: 'teams', header: 'Nominating Teams' },
            { field: 'study', header: 'Cohort Study' },
            { field: 'input_data', header: 'Input Data' },
            { field: 'pharos_class', header: 'Pharos Class' },
            { field: 'classification', header: 'Small Molecule Druggability' },
            { field: 'safety_bucket_definition', header: 'Safety Rating' },
            { field: 'abability_bucket_definition', header: 'Antibody Modality' },
            { field: 'validation_study_details', header: 'Experimental Validation' },
        ];

        // Add a position property so we can add/remove at the same position
        this.cols.forEach((col, i) => {
            col.position = i;
        });

        this.selectedColumns = this.cols.slice(0, 5);

        this.initData();
    }

    getFullscreenClass(): string {
        return (screenfull && screenfull.isFullscreen) ? 'fullscreen-table' : '';
    }

    getFullscreenStyle(): string {
        // The value 116px comes from .icon-row + th from the table, both have 58px
        return (screenfull && screenfull.isFullscreen) ? 'calc(100vh - 116px)' : '350px';
    }

    getWindowClass(): string {
        return (screenfull && !screenfull.isFullscreen) ?
            ' pi pi-window-maximize table-icon absolute-icon-left' :
            ' pi pi-window-minimize table-icon absolute-icon-left';
    }

    initData() {
        this.apiService.getTableData().subscribe((data: GeneInfosResponse) => {
            this.dataSource = (data.items) ? data.items : [];
            this.dataSource.forEach((de: GeneInfo) => {
                let teamsArray = [],
                    studyArray = [],
                    inputDataArray = [],
                    validationStudyDetailsArray = [],
                    initialNominationArray = [];

                // First map all entries nested in the data to a new array

                if (de.nominatedtarget.length) {
                    teamsArray = de.nominatedtarget.map((nt: NominatedTarget) => nt.team);
                    studyArray = de.nominatedtarget.map((nt: NominatedTarget) => nt.study);
                    inputDataArray = de.nominatedtarget.map((nt: NominatedTarget) => nt.input_data);
                    validationStudyDetailsArray = de.nominatedtarget
                        .map((nt: NominatedTarget) => nt.validation_study_details)
                        .filter(item => item !== undefined);
                    initialNominationArray = de.nominatedtarget
                        .map((nt: NominatedTarget) => nt.initial_nomination)
                        .filter(item => item !== undefined);
                }

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
                de.validation_study_details = (validationStudyDetailsArray.length) ? [...new Set(validationStudyDetailsArray)]
                    .sort((a: string, b: string) => a.localeCompare(b)).join(', ') : '';
                de.initial_nomination = (initialNominationArray.length) ? Math.min(...initialNominationArray) : undefined;

                // Druggability columns
                if (de.druggability && de.druggability.length) {
                    de.sm_druggability_bucket =
                        de.druggability[0].sm_druggability_bucket.toString();
                    de.safety_bucket = de.druggability[0].safety_bucket.toString();
                    de.abability_bucket = de.druggability[0].abability_bucket.toString();
                    de.pharos_class = de.druggability[0].pharos_class;
                    de.classification = de.druggability[0].sm_druggability_bucket + ': ' +
                        de.druggability[0].classification;
                    de.safety_bucket_definition = de.druggability[0].safety_bucket + ': ' +
                        de.druggability[0].safety_bucket_definition;
                    de.abability_bucket_definition = de.druggability[0].abability_bucket + ': ' +
                        de.druggability[0].abability_bucket_definition;
                } else {
                    const noValue = 'No value';
                    de.sm_druggability_bucket = noValue;
                    de.safety_bucket = noValue;
                    de.abability_bucket = noValue;
                    de.pharos_class = noValue;
                    de.classification = noValue;
                    de.safety_bucket_definition = noValue;
                    de.abability_bucket_definition = noValue;
                }
            });
            this.genesInfo = this.dataSource;
            this.totalRecords = (data.totalRecords) ? data.totalRecords : 0;

            // Starts table with the nominations columns sorted in descending order
            this.customSort({
                data: this.dataSource,
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

    reorderValues(event) {
        this.selectedColumns.sort((a: any, b: any) => {
            return (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0);
        });
    }

    // Downloads the table as a csv file
    downloadTable() {
        const downloadArray = [];
        // The headers row for the csv file
        downloadArray[0] = this.cols.map((c) => c.field).join();
        this.dataSource.forEach((de: GeneInfo) => {
            downloadArray.push('');
            this.cols.forEach((c, index) => {
                downloadArray[downloadArray.length - 1] += (c.field === 'hgnc_symbol' || c.field ===
                'nominations' || c.field === 'pharos_class') ? de[c.field] :
                    ('"' + de[c.field] + '"');
                downloadArray[downloadArray.length - 1] += ((index) < (this.cols.length - 1)) ?
                    ',' : '';
            });
        });

        // Finally export to csv
        this.dataService.exportToCsv('genes-list.csv', downloadArray);
    }

    toggleFullscreen() {
        const el = document.getElementsByClassName('ui-table');

        if (el[0]) {
            if (screenfull.enabled) {
                if (!screenfull.isFullscreen) {
                    screenfull.request(el[0]);
                } else {
                    screenfull.exit();
                }
            }
        }
    }

    // Using a conversion of 18pt font to 12px and
    // a spacing of 47px each side of the column header (spacing + letters)
    getColumnStyleString(col: any): object {
        return {
            width: Math.max((94 + (col.header.length * 12)), 250).toString() + 'px'
        };
    }

    getUnique(value, index, self) {
        return self.indexOf(value) === index;
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

    getNavService() {
        return this.navService;
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
