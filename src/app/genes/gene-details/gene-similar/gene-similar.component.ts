import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GeneNetwork } from '../../../models';

import { GeneService, DataService } from '../../../core/services';
import { ForceService } from '../../../shared/services';

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
        origin: undefined
    };

    private gene = this.geneService.getCurrentGene();
    private geneInfo: any;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private geneService: GeneService,
        private dataService: DataService,
        private forceService: ForceService
    ) { }

    ngOnInit() {
        // The data wasn't loaded yet, redirect for now
        if (!this.geneInfo) { this.geneInfo = this.geneService.getCurrentInfo(); }
        if (!this.id) { this.id = this.route.snapshot.paramMap.get('id'); }
        if (!!this.forceService.getGeneClickedList() &&
            this.forceService.getGeneClickedList().origin.ensembl_gene_id === this.id) {
            this.selectedGeneData = this.forceService.getGeneClickedList();
            this.dataLoaded = true;
            console.log('preloaded copy');
        } else if (!!this.forceService.getGeneOriginalList() &&
            this.forceService.getGeneOriginalList().origin.ensembl_gene_id === this.id) {
            this.selectedGeneData = this.forceService.getGeneOriginalList();
            this.dataLoaded = true;
            console.log('preloaded original');
        } else {
            this.dataService.getGene(this.id).subscribe((data) => {
                console.log(data);
                if (!data['item']) { this.router.navigate(['/genes']); }
                this.geneService.setCurrentGene(data['item']);
                this.geneService.setCurrentInfo(data['geneInfo']);
                this.gene = data['item'];
                this.geneInfo = data['geneInfo'];
                this.dataService.loadNodes(this.gene).then((datalinks: any) => {
                    this.forceService.setData(datalinks);
                    this.forceService.processNodes(this.gene).then((dn: GeneNetwork) => {
                        this.selectedGeneData.nodes = dn.nodes.slice();
                        this.dataLoaded = true;
                        console.log('loaded original');
                    });
                });
            });
        }
    }

    viewGene(id: string) {
        this.dataService.getGene(id).subscribe((data) => {
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            const currentUrl = this.router.url + '?';
            if (!data['item']) {
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
}
