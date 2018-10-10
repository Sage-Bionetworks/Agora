import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Gene, GeneNetwork, LinksListResponse, GeneResponse } from '../../../models';

import {
    ApiService,
    DataService,
    GeneService,
    ForceService
} from '../../../core/services';

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
    @Input() noData: boolean;
    dataLoaded: boolean = false;
    networkData: GeneNetwork;
    filter: boolean;
    selectedGeneData: GeneNetwork = {
        nodes: [],
        links: [],
        origin: undefined,
        filterLvl: 0
    };

    private currentGene = this.geneService.getCurrentGene();
    private geneInfo: any;
    private filterlvl: number = 0;
    private filterlvlN: number = 0;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private apiService: ApiService,
        private dataService: DataService,
        private geneService: GeneService,
        private forceService: ForceService
    ) { }

    ngOnInit() {
        // The data wasn't loaded yet, redirect for now
        this.geneInfo = this.geneService.getCurrentInfo();
        if (!this.id) { this.id = this.route.snapshot.paramMap.get('id'); }
        if (!!this.forceService.getGeneOriginalList() &&
            this.id !== this.forceService.getGeneOriginalList().origin.ensembl_gene_id) {
            this.loadGenes();
        } else {
            if (this.forceService.getGeneOriginalList()) {
                const dn = this.forceService.getGeneOriginalList();
                this.filterlvl = dn.filterLvl;
                this.selectedGeneData.nodes = dn.nodes.slice(1);
                this.selectedGeneData.links = dn.links.slice().reverse();
                this.selectedGeneData.origin = dn.origin;
                this.dataLoaded = true;
                this.networkData = dn;
                console.log(this.currentGene);
            } else {
                this.loadGenes();
            }
        }
    }

    getText(state?: boolean): string {
        let text = '';
        if (state) {
            text = 'True';
        } else {
            if (state === undefined) {
                text = 'No data';
            } else {
                text = 'False';
            }
        }
        return text;
    }

    getTextColorClass(state: boolean, normal?: boolean): any {
        const colorClassObj = {} as any;
        if (state) {
            colorClassObj['green-text'] = true;
        } else {
            colorClassObj['red-text'] = true;
        }

        if (normal) {
            colorClassObj['normal-heading'] = true;
        } else {
            colorClassObj['italic-heading'] = true;
        }
        return colorClassObj;
    }

    updategene(event) {
        this.apiService.getLinksList(this.currentGene).subscribe((linksList: LinksListResponse) => {
            this.dataService.loadNodes(linksList, event).then((datanetwork: any) => {
                this.forceService.processSelectedNode(event, datanetwork).then((network) => {
                    this.selectedGeneData.links = network.links;
                    this.selectedGeneData.nodes = network.nodes;
                    this.selectedGeneData.origin = network.origin;
                    this.apiService.getGene(event.id).subscribe((data: GeneResponse) => {
                        if (data.info) {
                            this.geneInfo = data.info;
                        } else {
                            this.geneInfo = {
                                hgnc_symbol: this.selectedGeneData.origin.hgnc_symbol
                            };
                        }
                    });
                });
            });
        });
    }

    filterNodes(lvl) {
        this.filterlvlN = lvl;
        if (!lvl) {
            this.filter = false;
            this.networkData = this.forceService.getGeneOriginalList();
            this.selectedGeneData.nodes = this.networkData.nodes.slice(1);
            this.selectedGeneData.links = this.networkData.links.slice().reverse();
            this.selectedGeneData.origin = this.networkData.origin;
        } else {
            this.forceService.filterLink(lvl).then((network) => {
                this.networkData = network;
                this.selectedGeneData.nodes = network.nodes.slice(1);
                this.selectedGeneData.links = network.links.slice().reverse();
                this.selectedGeneData.origin = network.origin;
                this.filter = true;
            });
        }
    }

    filterLevel(n: number): number[] {
        return Array(n);
    }

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets], { relativeTo: this.route }) :
            this.router.navigate([path], { relativeTo: this.route });
    }

    loadGenes() {
        this.apiService.getLinksList(this.currentGene).subscribe((linksList: LinksListResponse) => {
            this.dataService.loadNodes(linksList, this.currentGene).then((data: any) => {
                this.forceService.processNodes(this.currentGene).then((dn: GeneNetwork) => {
                    this.filterlvl = dn.filterLvl;
                    this.selectedGeneData.nodes = dn.nodes.slice(1);
                    this.selectedGeneData.links = dn.links.slice().reverse();
                    this.selectedGeneData.origin = dn.origin;
                    this.dataLoaded = true;
                    this.networkData = dn;
                });
            });
        });
    }

    viewGene(link, pos) {
        let id = '';
        if (link[pos] && link[pos].ensembl_gene_id) {
            id = link[pos].ensembl_gene_id;
        } else if (link[pos]) {
            id = link[pos];
        } else {
            id = link;
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
