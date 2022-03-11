import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GeneNetwork, GeneResponse } from '../../models';

import { ApiService, GeneService, ForceService } from '../../core/services';

@Component({
    selector: 'gene-brainregions',
    templateUrl: './gene-brainregions.component.html',
    styleUrls: ['./gene-brainregions.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GeneBRComponent implements OnInit {
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

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private apiService: ApiService,
        private geneService: GeneService,
        private forceService: ForceService
    ) { }

    ngOnInit() {
        if (!this.geneInfo) { this.geneInfo = this.geneService.getCurrentInfo(); }
        if (!this.id) { this.id = this.route.snapshot.paramMap.get('id'); }
        if (!!this.forceService.getGeneClickedList() &&
            this.forceService.getGeneClickedList().origin.ensembl_gene_id === this.id) {
            this.selectedGeneData = this.forceService.getGeneClickedList();
            this.dataLoaded = true;
        } else {
            this.gene = this.geneService.getCurrentGene();
            this.selectedGeneData.links = this.forceService.getGeneClickedList().links.slice().reverse();
            this.dataLoaded = true;
        }
    }

    viewGene(link, pos) {
        let id = '';
        if (link[pos].ensembl_gene_id) {
            id = link[pos].ensembl_gene_id;
        } else {
            id = link[pos];
        }
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
                                'genes-router': ['gene-details', data.item.ensembl_gene_id]
                            }
                        }]);
                });
        });
    }
}
