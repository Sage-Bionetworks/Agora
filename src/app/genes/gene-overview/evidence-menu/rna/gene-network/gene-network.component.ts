import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import { PlatformLocation } from '@angular/common';

import { Router, NavigationStart } from '@angular/router';

import { Gene, GeneNetwork, LinksListResponse, GeneResponse } from '../../../../../models';

import {
    ApiService,
    DataService,
    GeneService,
    ForceService,
    NavigationService
} from '../../../../../core/services';

import { Subscription } from 'rxjs';

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
    networkDataCopy: GeneNetwork;
    filter: boolean;
    selectedGeneData: GeneNetwork = {
        nodes: [],
        links: [],
        origin: undefined,
        filterLvl: 0
    };
    routerSubscription: Subscription;
    previousUrl: string;

    private currentGene = this.geneService.getCurrentGene();
    private geneInfo: any;
    private filterlvl: number = 0;
    private filterlvlN: number = 0;

    constructor(
        private location: PlatformLocation,
        private router: Router,
        private navService: NavigationService,
        private apiService: ApiService,
        private dataService: DataService,
        private geneService: GeneService,
        private forceService: ForceService
    ) { }

    ngOnInit() {
        if (!this.noData) { this.noData = this.geneService.getInfoDataState(); }

        // Only process things if we have data
        if (!this.noData) {
            this.gene = this.geneService.getCurrentGene();
            this.geneInfo = this.geneService.getCurrentInfo();
            this.id = this.navService.getId();

            // If we move away from the overview page, remove
            // the charts
            this.routerSubscription = this.router.events.subscribe((event) => {
                if (event instanceof NavigationStart) {
                    if (!event.url.includes('gene-similar') &&
                        !event.url.includes('gene-overview:rna')) {
                        this.removeForceServiceData();
                    }

                    this.previousUrl = event.url;
                }
            });
            this.location.onPopState(() => {
                if (this.previousUrl && !this.previousUrl.includes('gene-similar') &&
                    !this.previousUrl.includes('gene-overview:rna')) {
                    this.removeForceServiceData();
                }
            });

            if (this.forceService.getGeneOriginalList() === null ||
                this.id !== this.forceService.getGeneOriginalList().origin.ensembl_gene_id) {
                this.loadGenes();
            } else {
                const dn = this.forceService.getGeneOriginalList();
                this.filterlvl = dn.filterLvl;
                this.selectedGeneData.nodes = dn.nodes.slice(1);
                this.selectedGeneData.links = dn.links.slice().reverse();
                this.selectedGeneData.origin = dn.origin;
                this.dataLoaded = true;
                this.networkData = dn;
            }
        } else {
            this.dataLoaded = true;
        }
    }

    // Prevents duplicated networks
    removeForceServiceData() {
        const genes: GeneNetwork = {
            links: [],
            nodes: [],
            origin: undefined,
            filterLvl: 0
        };
        this.forceService.genes = genes;
        this.forceService.genesClicked = genes;
        this.forceService.genesFiltered = genes;
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

    updategene(event: Gene) {
        const self = this;
        if (event.hgnc_symbol !== this.geneService.getCurrentGene().hgnc_symbol) {
            this.apiService.getLinksList(event).subscribe((linksList: LinksListResponse) => {
                const lsnPromise = new Promise((resolve, reject) => {
                    this.forceService.processSelectedNode(linksList, event);
                    resolve(true);
                });
                lsnPromise.then(() => {
                    const dataNetwork = self.forceService.getGeneClickedList();
                    self.selectedGeneData.links = dataNetwork.links;
                    self.selectedGeneData.nodes = dataNetwork.nodes;
                    self.selectedGeneData.origin = dataNetwork.origin;
                    self.apiService.getGene(event.hgnc_symbol).subscribe((data: GeneResponse) => {
                        if (data.info) {
                            self.geneInfo = data.info;
                        } else {
                            self.geneInfo = {
                                hgnc_symbol: self.selectedGeneData.origin.hgnc_symbol
                            };
                        }
                    });
                });
            });
        }
    }

    filterNodes(lvl) {
        this.filterlvlN = lvl;
        this.geneInfo = this.geneService.getCurrentInfo();
        this.networkData = this.forceService.getGeneOriginalList();
        this.selectedGeneData.nodes = this.networkData.nodes.slice(1);
        this.selectedGeneData.links = this.networkData.links.slice().reverse();
        this.selectedGeneData.origin = this.networkData.origin;
        if (!lvl) {
            this.filter = false;
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
        this.navService.goToRoute(path, outlets);
    }

    onNavigate(url) {
        window.open(url, '_blank');
    }

    loadGenes() {
        this.forceService.setData(this.forceService.getLinksListItems());
        this.dataService.loadNodes().then(() => {
            const dn = this.forceService.getGeneClickedList();
            this.geneInfo = this.geneService.getCurrentInfo();
            this.networkData = {
                links: [],
                nodes: [],
                origin: undefined,
                filterLvl: 0
            };
            this.selectedGeneData.nodes = [];
            this.selectedGeneData.links = [];
            this.selectedGeneData.origin = undefined;
            this.filterlvl = dn.filterLvl;
            if (dn.links.length > 1000) {
                this.initialFilter();
            } else {
                this.networkData = dn;
                this.selectedGeneData.nodes = this.networkData.nodes.slice(1);
                this.selectedGeneData.links = this.networkData.links.slice().reverse();
                this.selectedGeneData.origin = this.networkData.origin;
                this.dataLoaded = true;
            }
        });
    }

    initialFilter() {
        this.filterlvlN = this.filterlvlN + 1;
        this.forceService.filterLink(this.filterlvlN).then((network) => {
            if (network.links.length < 1000 || this.filterlvlN >= this.filterlvl - 1) {
                this.networkData = network;
                this.selectedGeneData.nodes = network.nodes.slice(1);
                this.selectedGeneData.links = network.links.slice().reverse();
                this.selectedGeneData.origin = network.origin;
                this.dataLoaded = true;
                this.filter = true;
            } else {
                this.initialFilter();
            }
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
        const router = this.navService.getRouter();
        router.routeReuseStrategy.shouldReuseRoute = () => false;
        const currentUrl = router.url + '?';
        router.navigateByUrl(currentUrl)
            .then(() => {
                router.navigated = false;
                router.navigate([
                    '/genes',
                    {
                        outlets: {
                            'genes-router': ['gene-details', id]
                        }
                    }
                ]);
            });
    }

    showDialog(dialogString: string) {
        this[dialogString] = true;
    }
}
