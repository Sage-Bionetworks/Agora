import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {
    GeneNetwork,
    GeneResponse,
    GeneInfosResponse,
    GeneInfo,
    Druggability,
    Gene,
    MedianExpression
} from '../../models';

import {
    ApiService,
    GeneService,
    ForceService,
    NavigationService,
    DataService
} from '../../core/services';
import { SortEvent, Message } from 'primeng/api';

import { throwError } from 'rxjs';
import { TitleCasePipe } from '@angular/common';

import * as screenfull from 'screenfull';

@Component({
    selector: 'gene-similar',
    templateUrl: './gene-similar.component.html',
    styleUrls: ['./gene-similar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GeneSimilarComponent implements OnInit {
    @Input() id: string;
    dataLoaded: boolean = false;
    displayBRDia: boolean = false;
    networkData: GeneNetwork;
    selectedGeneData: GeneNetwork = {
        nodes: [],
        links: [],
        origin: undefined,
        filterLvl: 0
    };

    gene: Gene;
    geneInfo: GeneInfo;
    msgs: Message[] = [];
    cols: any[];
    selectedColumns: any[];
    selectedInfo: GeneInfo;
    datasource: GeneInfosResponse;
    genesInfo: GeneInfo[];
    totalRecords: any;
    loading: boolean;
    sortColumnIndex: number;
    noValue = 'No value';

    constructor(
        private router: Router,
        private titleCase: TitleCasePipe,
        private apiService: ApiService,
        private navService: NavigationService,
        private geneService: GeneService,
        private dataService: DataService,
        private forceService: ForceService
    ) { }

    ngOnInit() {
        this.cols = [
            { field: 'hgnc_symbol', header: 'Gene name' },
            { field: 'brain_regions_display_value', header: 'Brain Regions' },
            { field: 'num_brain_regions_display_value', header: 'Number of Brain Regions' },
            { field: 'nominated_target_display_value', header: 'Nominated Target' },
            { field: 'isIGAP', header: 'Genetic Association with LOAD'},
            { field: 'haseqtl', header: 'Brain eQTL' },
            { field: 'is_any_rna_changed_in_ad_brain_display_value', header: 'RNA Expression Change'},
            { field: 'is_any_protein_changed_in_ad_brain_display_value', header: 'Protein Expression Change'},
            { field: 'pharos_class_display_value', header: 'Pharos Class' },
            { field: 'sm_druggability_display_value', header: 'Small Molecule Druggability' },
            { field: 'safety_rating_display_value', header: 'Safety Rating' },
            { field: 'ab_modality_display_value', header: 'Antibody Modality' },
        ];

        // Add a position property so we can add/remove at the same position
        this.cols.forEach((col, i) => {
            col.position = i;
        });

        this.selectedColumns = this.cols.slice(0, 5);

        this.updateVariables();
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

    updateVariables() {
        if (!this.gene) { this.gene = this.geneService.getCurrentGene(); }
        if (!this.geneInfo) { this.geneInfo = this.geneService.getCurrentInfo(); }
        if (!this.id) { this.id = this.navService.getId(); }
    }

    initData() {
        // If we don't have a Gene or any Models/Tissues here, or in case we are
        // reloading the page, try to get it from the server and move on
        if (!this.gene || !this.geneInfo || this.id !== this.gene.ensembl_gene_id
            || !this.gene.ensembl_gene_id || this.gene.hgnc_symbol !==
            this.geneService.getCurrentGene().hgnc_symbol
        ) {
            this.apiService.getGene(this.id).subscribe((data: GeneResponse) => {
                if (!data.info) {
                    this.navService.goToRoute('/genes');
                } else {
                    if (!data.item) {
                        // Fill in a new gene with the info attributes
                        data.item = this.geneService.getEmptyGene(
                            data.info.ensembl_gene_id, data.info.hgnc_symbol
                        );
                        this.geneService.setInfoDataState(true);
                    }
                    this.geneService.updatePreviousGene();
                    this.geneService.updateGeneData(data);
                    this.gene = data.item;
                    this.geneInfo = data.info;
                }
            }, (error) => {
                console.log('Error loading gene overview! ' + error.message);
            }, () => {
                this.initTissuesModels();
            });
        } else {
            this.initTissuesModels();
        }
    }

    initTissuesModels() {
        // Check if we have a database id at this point
        if (this.gene) {
            if (!this.geneService.getPreviousGene() || this.geneService.hasGeneChanged()) {
                this.dataService.loadData(this.gene).subscribe((responseList) => {
                    // Genes response
                    if (!responseList.length) {
                        this.dataLoaded = true;
                        return;
                    } else {
                        if (responseList[0].geneModels) {
                            this.geneService.setGeneModels(responseList[0].geneModels);
                        }
                        if (responseList[0].geneTissues) {
                            this.geneService.setGeneTissues(responseList[0].geneTissues);
                        }
                        this.dataService.loadGenes(responseList[0]);
                        this.forceService.processSelectedNode(responseList[1], this.gene);
                    }
                }, (error) => {
                    console.error('Error loading the data!');
                    return throwError(error);  // Angular 6/RxJS 6
                }, () => {
                    this.initGeneClickedList();
                });
            } else {
                this.initGeneClickedList();
            }
        } else {
            this.geneService.setGeneTissues([]);
            this.geneService.setGeneModels([]);
            this.initGeneClickedList();
        }
    }

    initGeneClickedList() {
        let nodesIds: string[];

        if (!!this.forceService.getGeneClickedList() &&
            this.forceService.getGeneClickedList().origin &&
            this.forceService.getGeneClickedList().origin.ensembl_gene_id === this.id) {
            this.selectedGeneData = this.forceService.getGeneClickedList();
            nodesIds = this.selectedGeneData.nodes.map((gene) => gene.ensembl_gene_id);
        } else if (!!this.forceService.getGeneOriginalList() &&
            this.forceService.getGeneOriginalList().origin &&
            this.forceService.getGeneOriginalList().origin.ensembl_gene_id === this.id) {
            this.selectedGeneData = this.forceService.getGeneOriginalList();
            nodesIds = this.selectedGeneData.nodes.map((gene) => gene.ensembl_gene_id);
        }

        if (nodesIds && nodesIds.length) {
            this.apiService.getInfosMatchIds(nodesIds).subscribe((datas: GeneInfosResponse) => {
                this.genesInfo = datas.items;
                this.genesInfo.forEach((de: GeneInfo) => {

                    // Populate display fields & set default values
                    de.is_any_rna_changed_in_ad_brain_display_value = (de.rna_brain_change_studied) ?
                        de.isAnyRNAChangedInADBrain.toString() : 'No data';
                    de.is_any_protein_changed_in_ad_brain_display_value = (de.protein_brain_change_studied) ?
                        de.isAnyProteinChangedInADBrain.toString() : 'No data';
                    de.nominated_target_display_value = de.nominations > 0;

                    // Populate MedianExpression display fields
                    const meArray = (de.medianexpression.length) ?
                        de.medianexpression.map((me: MedianExpression) => me.tissue) : [];
                    de.brain_regions_display_value = (meArray.length) ? meArray.filter(this.getUnique)
                        .sort((a: string, b: string) => a.localeCompare(b)).join(', ') : '';
                    de.num_brain_regions_display_value = meArray.length.toString();

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

                this.totalRecords = (datas.items.length) ? datas.items.length : 0;
                this.loading = false;
                this.dataLoaded = true;
            });
        }
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
        downloadArray[0] = this.cols.map((c) => c.header).join();
        // List of columns with values containing commas
        const escapeFields = ['brain_regions_display_value', 'sm_druggability_display_value',
            'safety_rating_display_value', 'ab_modality_display_value'];

        this.genesInfo.forEach((de: GeneInfo) => {
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
        this.dataService.exportToCsv( 'genes-similar-' + this.gene.ensembl_gene_id + '.csv', downloadArray);
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

    getUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    // Using a conversion of 18pt font to 12px and
    // a spacing of 47px each side of the column header (spacing + letters)
    getColumnStyleString(col: any): object {
        return {
            width: Math.max((94 + (col.header.length * 12)), 250).toString() + 'px'
        };
    }

    colFinalValue(rowObj: any, field: any): string {

        if (rowObj[field] === undefined) {
            return this.noValue;
        } else {
                if (field === 'isIGAP' || field === 'haseqtl' || field === 'nominated_target_display_value'
                    || field === 'is_any_rna_changed_in_ad_brain_display_value' || field === 'is_any_protein_changed_in_ad_brain_display_value') {
                    return this.titleCase.transform(rowObj[field].toString());
                }
                return rowObj[field];
            }
    }

    onRowSelect(event) {
        this.msgs = [{
            severity: 'info',
            summary: 'Gene Selected',
            detail: 'Gene: ' + event.data.hgnc_symbol
        }];
        if (!this.selectedInfo) { this.selectedInfo = event.data; }
        this.router.navigated = false;

        if (!this.geneService.getCurrentGene()) {
            this.getGene(this.selectedInfo.hgnc_symbol);
        } else {
            this.geneService.updatePreviousGene();
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

    onRowUnselect(event) {
        this.msgs = [{
            severity: 'info',
            summary: 'Gene Unselected',
            detail: 'Gene: ' + event.data.ensembl_gene_id
        }];
        this.geneService.setCurrentGene(null);
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

    customSort(event: SortEvent) {
        event.data.sort((data1, data2) => {
            let result = null;
            const value1 = data1[event.field];
            const value2 = data2[event.field];

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
                    } else {
                        // sort noValue to the end
                        result = isNaN(numericValue1) ? 1 : -1;
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

    navigateBackToGene() {

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
