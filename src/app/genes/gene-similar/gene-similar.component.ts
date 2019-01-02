import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GeneNetwork,
    LinksListResponse,
    GeneResponse,
    GeneInfosResponse,
    GeneInfo } from '../../models';

import {
    ApiService,
    GeneService,
    ForceService,
    NavigationService
} from '../../core/services';
import { SortEvent, Message } from 'primeng/api';

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

    gene = this.geneService.getCurrentGene();
    geneInfo: any;
    msgs: Message[] = [];
    cols: any[];
    selectedInfo: GeneInfo;
    datasource: GeneInfosResponse;
    genesInfo: any;
    totalRecords: any;
    loading: boolean;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private apiService: ApiService,
        private navService: NavigationService,
        private geneService: GeneService,
        private forceService: ForceService
    ) { }

    ngOnInit() {
        this.cols = [
            { field: 'hgnc_symbol', header: 'Gene name' },
            { field: 'nominations', header: 'Nominated Target' },
            { field: 'haseqtl', header: 'Brain eQTL' },
            { field: 'isIGAP', header: 'Genetic Association with LOAD'},
            { field: 'druggability', subfield: 'pharos_class', header: 'Druggability Bucket'},
            { field: 'druggability', header: 'Pharos Class'}
        ];
        // The data wasn't loaded yet, redirect for now
        if (!this.geneInfo) { this.geneInfo = this.geneService.getCurrentInfo(); }
        if (!this.id) { this.id = this.route.snapshot.paramMap.get('id'); }
        if (!!this.forceService.getGeneClickedList() &&
            this.forceService.getGeneClickedList().origin.ensembl_gene_id === this.id) {
            this.selectedGeneData = this.forceService.getGeneClickedList();
            const nodesIds = this.selectedGeneData.nodes.map((gene) => gene.ensembl_gene_id);
            this.apiService.getInfosMatchIds(nodesIds).subscribe((datas) => {
                this.genesInfo = datas['items'];
                this.totalRecords = datas['items'].length;
                this.loading = false;
                this.dataLoaded = true;
                this.dataLoaded = true;
            });
        } else if (!!this.forceService.getGeneOriginalList() &&
            this.forceService.getGeneOriginalList().origin.ensembl_gene_id === this.id) {
            this.selectedGeneData = this.forceService.getGeneOriginalList();
            const nodesIds = this.selectedGeneData.nodes.map((gene) => gene.ensembl_gene_id);
            this.apiService.getInfosMatchIds(nodesIds).subscribe((datas) => {
                this.genesInfo = datas['items'];
                this.totalRecords = datas['items'].length;
                this.loading = false;
                this.dataLoaded = true;
            });
        } else {
            const dn = this.forceService.getGeneClickedList();
            const nodesIds = dn.nodes.map((gene) => gene.ensembl_gene_id );
            this.apiService.getInfosMatchIds(nodesIds).subscribe((datas) => {
                this.genesInfo = datas['items'];
                this.totalRecords = datas['items'].length;
                this.loading = false;
            });
        }
    }

    druggabilitypc(druggability): string {
        if (!druggability) { return '-'; }
        return druggability.map((dg) => dg['pharos_class']);
    }

    druggability(druggability): string {
        if (!druggability) { return '-'; }
        return druggability.map((dg) => `${dg['sm_druggability_bucket']}: ${dg['classification']}`);
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
                this.goToRoute(
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
            this.goToRoute(
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

    goToRoute(path: string, outlets?: any) {
        this.navService.goToRoute(path, outlets);
    }
}
