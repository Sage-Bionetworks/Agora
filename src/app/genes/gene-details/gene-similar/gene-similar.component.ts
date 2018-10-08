import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GeneNetwork, LinksListResponse, GeneResponse } from '../../../models';

import {
    ApiService,
    DataService,
    GeneService,
    ForceService
} from '../../../core/services';
import { SortEvent } from 'primeng/primeng';

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

    private gene = this.geneService.getCurrentGene();
    private geneInfo: any;
    private cols: any[];
    private datasource: GeneResponse[];
    private genesInfo: any;
    private totalRecords: any;
    private loading: boolean;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private apiService: ApiService,
        private dataService: DataService,
        private geneService: GeneService,
        private forceService: ForceService
    ) { }

    ngOnInit() {
        this.cols = [
            { field: 'hgnc_symbol', header: 'Gene name' },
            { field: 'nominations', header: 'Nominated Target' },
            { field: 'haseqtl', header: 'Brain Eqtl' },
            { field: 'isIGAP', header: 'AD Genetic Association'},
            { field: 'druggability', subfield: 'pharos_class', header: 'Druggability Bucket'},
            { field: 'druggability', header: 'Pharos Class'}
        ];
        // The data wasn't loaded yet, redirect for now
        if (!this.geneInfo) { this.geneInfo = this.geneService.getCurrentInfo(); }
        if (!this.id) { this.id = this.route.snapshot.paramMap.get('id'); }
        // if (!!this.forceService.getGeneClickedList() &&
        //     this.forceService.getGeneClickedList().origin.ensembl_gene_id === this.id) {
        //     this.selectedGeneData = this.forceService.getGeneClickedList();
        //     this.dataLoaded = true;
        // } else if (!!this.forceService.getGeneOriginalList() &&
        //     this.forceService.getGeneOriginalList().origin.ensembl_gene_id === this.id) {
        //     this.selectedGeneData = this.forceService.getGeneOriginalList();
        //     this.dataLoaded = true;
        // } else {
        this.apiService.getGene(this.id).subscribe((data) => {
            if (!data['item']) { this.router.navigate(['/genes']); }
            this.geneService.setCurrentGene(data['item']);
            this.geneService.setCurrentInfo(data['geneInfo']);
            this.gene = data['item'];
            this.geneInfo = data['geneInfo'];
            this.apiService.getLinksList(this.gene).subscribe(
                (linksList: LinksListResponse) => {
                this.dataService.loadNodes(linksList, this.gene).then((datalinks: any) => {
                    this.forceService.processNodes(this.gene).then((dn: GeneNetwork) => {
                        this.apiService.getTableData().subscribe((datas) => {
                            this.datasource =
                            (datas['items']) ? datas['items'] as GeneResponse[] : [];
                            this.genesInfo = this.datasource;
                            this.totalRecords =
                            (datas['totalRecords']) ? (datas['totalRecords']) : 0;
                            console.log(datas);
                            // Starts table with the nominations columns sorted in descending order
                            // this.customSort({
                            //     data: this.datasource,
                            //     field: 'nominations',
                            //     mode: 'single',
                            //     order: -1
                            // } as SortEvent);

                            this.loading = false;
                        });
                    });
                });
            });
        });
        //}
    }

    viewGene(id: string) {
        this.apiService.getGene(id).subscribe((data: GeneResponse) => {
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            const currentUrl = this.router.url + '?';
            if (!data.item) {
                this.router.navigate(['/genes']);
                return;
            }
            this.geneService.updateGeneData(data);
            this.router.navigateByUrl(currentUrl)
                .then(() => {
                    this.router.navigated = false;
                    this.router.navigate(['/genes',
                        {
                            outlets:
                            {
                                'genes-router': ['gene-details', data['item'].ensembl_gene_id]
                            }
                        }]);
                });
        });
    }

    druggabilitypc(druggability): string {
        return druggability.map((dg) => dg['pharos_class']);
    }

    druggability(druggability): string {
        return druggability.map((dg) => `${dg['sm_druggability_bucket']}: ${dg['classification']}`);
    }

    onRowSelect(event) {
        // todo
    }

    onRowUnselect(event) {
        // todo
    }

    customSort(event: SortEvent) {
        // todo
    }
}
