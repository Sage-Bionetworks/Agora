import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Gene, GeneNetwork, GeneNode, GeneLink } from '../../../models';

import { GeneService, DataService } from '../../../core/services';
import { ForceService } from '../../../shared/services';

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
    displayBRDia: boolean = false;

    private pathways: GeneLink[] = [];
    private currentGene = this.geneService.getCurrentGene();
    private currentGeneData = [];
    private variants: boolean = false;
    private eqtl: boolean = false;
    private networkData: GeneNetwork;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private geneService: GeneService,
        private dataService: DataService,
        private forceService: ForceService
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
            this.loadGenes();
        }
    }

    updategene(event) {
        // this.dataService.loadNodes(event).then((data: GeneNetwork) => {
        //     // data.nodes.shift();
        //     this.pathways = data.nodes;
        // });
    }

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets], { relativeTo: this.route }) :
            this.router.navigate([path], { relativeTo: this.route });
    }

    loadGenes() {
        this.dataService.loadNodes(this.currentGene).then((data: any) => {
            this.forceService.setData(data);
            this.forceService.processNodes(this.currentGene).then((dn: GeneNetwork) => {
                this.networkData = dn;
                this.currentGeneData = dn.nodes.slice(1);
                this.pathways = dn.links;
                this.dataLoaded = true;
                console.log(this.currentGene);
            });
            // // this.eqtl = this.findEqtl();
            // this.variants = this.findVariant();
            // console.log(data);
        });
    }

    // findVariant() {
    //     this.variantsJson.find( (variant: any) => {
    //         if (variant.ENSEMBL === this.currentGene.ensembl_gene_id) {
    //             return true;
    //         }
    //     });
    //     return false;
    // }

    // findEqtl() {
    //     this.eqtlJson.find( (eqtl: any) => {
    //         if (eqtl.ensembl_gene_id === this.currentGene.ensembl_gene_id) {
    //             return true;
    //         }
    //     });
    //     return false;
    // }

    viewGene(gene: GeneNode) {
        this.dataService.getGene(gene.ensembl_gene_id).subscribe((data) => {
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            const currentUrl = this.router.url + '?';
            if (!data['item']) {
                this.router.navigate(['/genes']);
                return;
            }
            this.geneService.setCurrentGene(data['item']);
            this.geneService.setLogFC(data['minFC'], data['maxFC']);
            this.geneService.setAdjPValue(data['minAdjPValue'], data['maxAdjPValue']);
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

    showDialog(dialogString: string) {
        this[dialogString] = true;
    }
}
