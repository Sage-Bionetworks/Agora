import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {
    GeneNetwork,
    GeneResponse,
    GeneInfosResponse,
    GeneInfo,
    Druggability,
    Gene
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
    selectedInfo: GeneInfo;
    datasource: GeneInfosResponse;
    genesInfo: any;
    totalRecords: any;
    loading: boolean;
    sortColumnIndex: number;

    constructor(
        private router: Router,
        private apiService: ApiService,
        private navService: NavigationService,
        private geneService: GeneService,
        private dataService: DataService,
        private forceService: ForceService
    ) { }

    ngOnInit() {
        this.cols = [
            { field: 'hgnc_symbol', header: 'Gene name' },
            { field: 'nominations', header: 'Nominated Target' },
            { field: 'haseqtl', header: 'Brain eQTL' },
            { field: 'isIGAP', header: 'Genetic Association with LOAD'},
            { field: 'druggability', subfield: 'sm_druggability_bucket',
                header: 'Druggability Bucket'},
            { field: 'druggability', subfield: 'pharos_class', header: 'Pharos Class'}
        ];

        this.updateVariables();
        this.initData();
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
                this.totalRecords = datas.items.length;
                this.loading = false;
                this.dataLoaded = true;
            });
        }
    }

    // Using a conversion of 18pt font to 12px and
    // a spacing of 47px each side of the column header (spacing + letters)
    getColumnStyleString(col: any): object {
        return {
            width: Math.max((94 + (col.header.length * 12)), 250).toString() + 'px'
        };
    }

    druggabilitypc(druggability: Druggability[]): string {
        if (!druggability || !druggability.length || !druggability[0].pharos_class) { return '-'; }
        return druggability[0].pharos_class;
    }

    druggability(druggability: Druggability[]): string {
        if (!druggability || !druggability.length || !druggability[0].sm_druggability_bucket ||
            !druggability[0].classification
        ) {
            return '-';
        }
        return `${druggability[0].sm_druggability_bucket}: ${druggability[0].classification}`;
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
            const value1 = (!data1[event.field] && data1.druggability) ?
                data1.druggability[0][event.field] :
                data1[event.field];
            const value2 = (!data2[event.field] && data2.druggability) ?
                data2.druggability[0][event.field] :
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

    getSortColumnField(index: number, col: any) {
        if (index < 4) {
            return col.field;
        } else {
            return col.subfield;
        }
    }
}
