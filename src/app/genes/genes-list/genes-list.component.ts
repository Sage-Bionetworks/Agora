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
    noValue = 'No value';

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
            { field: 'initial_nomination_display_value', header: 'Year First Nominated' },
            { field: 'teams_display_value', header: 'Nominating Teams' },
            { field: 'study_display_value', header: 'Cohort Study' },
            { field: 'input_data_display_value', header: 'Input Data' },
            { field: 'pharos_class_display_value', header: 'Pharos Class' },
            { field: 'sm_druggability_display_value', header: 'Small Molecule Druggability' },
            { field: 'safety_rating_display_value', header: 'Safety Rating' },
            { field: 'ab_modality_display_value', header: 'Antibody Modality' },
            { field: 'validation_study_details_display_value', header: 'Experimental Validation' },
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
                let teamsArray = [];
                let studyArray = [];
                let inputDataArray = [];
                let validationStudyDetailsArray = [];
                let initialNominationArray = [];

                // Handle NominatedTargets fields
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

                // Populate NominatedTargets display fields
                de.teams_display_value = (teamsArray.length) ? teamsArray.filter(this.getUnique)
                    .sort((a: string, b: string) => a.localeCompare(b)).join(', ') : '';
                de.study_display_value = (studyArray.length) ? studyArray.filter(this.getUnique)
                    .sort((a: string, b: string) => a.localeCompare(b)).join(', ') : '';
                de.input_data_display_value = (inputDataArray.length) ? inputDataArray.filter(this.getUnique)
                    .sort((a: string, b: string) => a.localeCompare(b)).join(', ') : '';
                de.validation_study_details_display_value = (validationStudyDetailsArray.length) ?
                    [...new Set(validationStudyDetailsArray.filter(e => e !== ''))]
                    .sort((a: string, b: string) => a.localeCompare(b)).join(', ') : '';
                de.initial_nomination_display_value = (initialNominationArray.length) ?
                    Math.min(...initialNominationArray) : undefined;

                // Populate Druggability display fields
                if (de.druggability && de.druggability.length) {
                    de.pharos_class_display_value = de.druggability[0].pharos_class ?
                        de.druggability[0].pharos_class : this.noValue;
                    de.sm_druggability_display_value = de.druggability[0].sm_druggability_bucket + ': ' +
                        de.druggability[0].classification;
                    de.safety_rating_display_value = de.druggability[0].safety_bucket + ': ' +
                        de.druggability[0].safety_bucket_definition;
                    de.ab_modality_display_value = de.druggability[0].abability_bucket + ': ' +
                        de.druggability[0].abability_bucket_definition;
                } else {
                    de.pharos_class_display_value = this.noValue;
                    de.sm_druggability_display_value = this.noValue;
                    de.safety_rating_display_value = this.noValue;
                    de.ab_modality_display_value = this.noValue;
                }
            });
            this.genesInfo = this.dataSource;
            this.totalRecords = (data.totalRecords) ? data.totalRecords : 0;
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
        const defaultCol = this.selectedColumns.find(d => d.field === 'hgnc_symbol');
        if (!defaultCol) {
            this.selectedColumns.unshift(this.cols[0]);
        }

        this.selectedColumns.sort((a: any, b: any) => {
            return (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0);
        });
    }

    // Downloads the table as a csv file
    downloadTable() {
        const downloadArray = [];
        // The headers row for the csv file
        downloadArray[0] = this.cols.map((c) => c.header).join();
        // Columns with values containing commas
        const escapeFields = ['teams_display_value',  'study_display_value', 'input_data_display_value',
            'sm_druggability_display_value', 'safety_rating_display_value',
            'ab_modality_display_value', 'validation_study_details_display_value'];

        this.dataSource.forEach((de: GeneInfo) => {
            downloadArray.push('');
            this.cols.forEach((c, index) => {
                downloadArray[downloadArray.length - 1] +=
                    // quote the values that contain commas
                    (escapeFields.includes(c.field)) ?  ('"' + de[c.field] + '"') : de[c.field];
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
            detail: 'Gene: ' + (event.data.hgnc_symbol || event.data.ensembl_gene_id)
        }];

        if (!this.selectedInfo) { this.selectedInfo = event.data; }

        // We don't have a gene
        if (!this.geneService.getCurrentGene()) {
            this.getGene(this.selectedInfo.ensembl_gene_id);
        } else {
            this.geneService.updatePreviousGene();
            // We have a gene, but it's a new one
            if (this.geneService.getCurrentGene().ensembl_gene_id !== this.selectedInfo.ensembl_gene_id) {
                this.navService.setOvMenuTabIndex(0);
                this.getGene(this.selectedInfo.ensembl_gene_id);
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

    getGene(ensemblGeneId: string) {
        this.apiService.getGene(ensemblGeneId).subscribe((data: GeneResponse) => {
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
        console.log(event);
        event.data.sort((data1, data2) => {
            let result = null;
            let value1 = null;
            let value2 = null;

            if ('hgnc_symbol' === event.field) {
                value1 = data1.hgnc_symbol || data1.ensembl_gene_id;
                value2 = data2.hgnc_symbol || data2.ensembl_gene_id;
            } else {
                value1 = data1[event.field];
                value2 = data2[event.field];
            }

            if (value1 == null && value2 != null) {
                result = -1;
            } else if (value1 != null && value2 == null) {
                result = 1;
            } else if (value1 == null && value2 == null) {
                result = 0;
            } else if (typeof value1 === 'string' && typeof value2 === 'string') {
                // Natural sorting for this score type, which can be >= 10
                if (event.field === 'sm_druggability_display_value') {
                    const numericValue1 = parseInt(value1.split(':')[0], 10);
                    const numericValue2 = parseInt(value2.split(':')[0], 10);
                    if (!isNaN(numericValue1) && !isNaN(numericValue2)) {
                        result = (numericValue1 < numericValue2) ? -1 : (numericValue1 > numericValue2) ? 1 : 0;
                    }
                } else {
                    result = value1.localeCompare(value2);
                }
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
