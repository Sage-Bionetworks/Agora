import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { Gene, GeneNetwork, GeneLink, GeneNode } from '../../../models';

import { GeneService, DataService } from '../../../core/services';

import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'gene-network',
    templateUrl: './gene-network.component.html',
    styleUrls: ['./gene-network.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GeneNetworkComponent implements OnInit {
    @Input() styleClass: string = 'network-panel';
    @Input() style: any;
    @Input() gene: Gene;
    @Input() id: string;
    dataLoaded: boolean = false;

    private pathways: GeneNode[] = [];
    private currentGene = this.geneService.getCurrentGene();
    private currentGeneData: Gene[] = [];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private geneService: GeneService,
        private dataService: DataService,
        private location: Location
    ) { }

    ngOnInit() {
        // The data wasn't loaded yet, redirect for now
        if (!this.dataService.getNdx()) {
            this.id = this.route.snapshot.paramMap.get('id');
            this.router.navigate([
                '/genes',
                {
                    outlets: {
                        'genes-router':
                        [
                            'gene-details', this.id
                        ]
                    }
                }
            ]);
        } else {
            this.dataLoaded = true;
        }
        this.loadGenes();
    }

    updategene(event) {
        this.dataService.loadNodes(event).then((data: GeneNetwork) => {
            this.pathways = data.nodes;
        });
    }

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets], { relativeTo: this.route }) :
            this.router.navigate([path], { relativeTo: this.route });
    }

    loadGenes() {
        this.dataService.loadNodes(this.currentGene).then((data: any) => {
            data.nodes.shift();
            this.currentGeneData = data.nodes;
            console.log(data);
        });
    }

    viewGene(gene: GeneNode) {
        this.dataService.getGene(gene.hgnc_symbol).subscribe((data) => {
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            const currentUrl = this.router.url + '?';
            if (!data['item']) {
                this.router.navigate(['/genes']);
                return;
            }
            this.geneService.setCurrentGene(data['item']);
            this.geneService.setLogFC(data['minLogFC'], data['maxLogFC']);
            this.geneService.setNegAdjPValue(data['maxNegLogPValue']);
            this.router.navigateByUrl(currentUrl)
                .then(() => {
                    this.router.navigated = false;
                    this.router.navigate(['/genes',
                        {
                            outlets:
                                {
                                    'genes-router': ['gene-details', data['item'].hgnc_symbol]
                                }
                        }]);
                });
        });
    }

    goBack() {
        this.location.back();
    }
}
