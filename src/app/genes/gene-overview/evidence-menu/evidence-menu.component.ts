import {
    Component,
    OnInit,
    Input,
    ViewEncapsulation,
    ViewChild,
    AfterContentChecked
} from '@angular/core';
import { RouterEvent, NavigationEnd, NavigationExtras } from '@angular/router';

import { Gene, GeneInfo } from '../../../models';

import { GeneService, NavigationService } from '../../../core/services';
import { ChartService } from 'app/charts/services';

import { MenuItem } from 'primeng/api';
import { TabMenu } from 'primeng/tabmenu';

import { Subscription } from 'rxjs';

@Component({
    selector: 'evidence-menu',
    templateUrl: './evidence-menu.component.html',
    styleUrls: [ './evidence-menu.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class EvidenceMenuComponent implements OnInit, AfterContentChecked {
    @Input() gene: Gene;
    @Input() geneInfo: GeneInfo;
    @Input() id: string;
    @ViewChild('evidenceMenu', {static: false}) menu: TabMenu;

    extras: NavigationExtras = {
        relativeTo: this.navService.getRoute(),
        skipLocationChange: true
    };

    activeItem: MenuItem;
    currentGeneData = [];
    routerSub: Subscription;
    chartSub: Subscription;
    menuSub: Subscription;
    subscription: any;
    items: MenuItem[];
    neverActivated: boolean = true;
    disableMenu: boolean = false;
    firstTimeCheck: boolean = true;
    previousUrl: string;
    currentMenuTab: number = -1;

    constructor(
        private navService: NavigationService,
        private geneService: GeneService,
        private chartService: ChartService
    ) {}

    ngOnInit() {
        // Populate the tab menu
        this.items = [
            { label: 'RNA', disabled: false } as MenuItem,
            { label: 'Protein', disabled: true } as MenuItem,
            { label: 'Metabolomics', disabled: true } as MenuItem,
            { label: '', disabled: true} as MenuItem,
            { label: '', disabled: true} as MenuItem
        ];

        this.geneInfo = this.geneService.getCurrentInfo();

        this.chartSub = this.chartService.chartsRendered$.subscribe((state: boolean) => {
            if (state) {
                this.items[1].disabled = false;
                this.items[2].disabled = false;
            }
        });

        this.routerSub =  this.navService.getRouter().events.subscribe((re: RouterEvent) => {
            if (re instanceof NavigationEnd) {
                if (this.geneService.getCurrentGene() &&
                    this.geneService.getCurrentGene().hgnc_symbol) {
                    // The url id is undefined here because the route didn't change at
                    // this point like in the gene overview component. Check only for
                    // the evidence-menu part of the url for now
                    const evidenceTabIndex: number = (this.geneInfo) ? (this.geneInfo.nominations ?
                        2 : 1) : 2;
                    if (
                        (
                            !re.url.includes('/genes/(genes-router:gene-details/') &&
                            (
                                !this.previousUrl ||
                                !this.previousUrl.includes(
                                    '/genes/(genes-router:gene-details/'
                                )
                            )
                        ) ||
                        this.navService.getOvMenuTabIndex() !== evidenceTabIndex
                    ) {
                        console.log('here');
                        const urlToGo: string = this.navService.getOvMenuTabIndex() === 0 ?
                            'nom-details' : this.navService.getOvMenuTabIndex() === 1 ?
                            'soe' : 'druggability';
                        this.navService.goToRoute('/genes', {
                            outlets: {
                                'genes-router': ['gene-details', this.id],
                                'gene-overview': [urlToGo],
                                'evidence-menu': null
                            }
                        }, this.extras);

                        if (this.routerSub) {
                            this.routerSub.unsubscribe();
                        }
                        if (this.subscription) {
                            this.subscription.unsubscribe();
                        }
                    }
                }

                this.previousUrl = re.url;
            }
        });
    }

    activateMenu(event) {
        if (((!this.disableMenu && ((this.activeItem && this.menu.activeItem)
            ? (this.activeItem.label !== this.menu.activeItem.label) : false)
            ) || this.neverActivated) || event) {
            this.neverActivated = false;

            this.activeItem = (this.menu.activeItem) ? this.menu.activeItem :
                event ? {label: event.target.textContent, disabled: false} :
                {label: 'RNA', disabled: false};

            if (this.activeItem.disabled ||
                (
                    this.currentMenuTab !== -1 &&
                    (
                        this.activeItem.label ===
                        this.items[this.navService.getEvidenceMenuTabIndex()].label
                    )
                )
            ) {
                return;
            }

            if (this.activeItem) {
                switch (this.activeItem.label) {
                    case 'RNA':
                        this.navService.setEvidenceMenuTabIndex(0);
                        this.navService.goToRoute('/genes', {
                            outlets: {
                                'genes-router': ['gene-details', this.id],
                                'gene-overview': ['rna']
                            }
                        }, this.extras);
                        break;
                    case 'Protein':
                        this.navService.setEvidenceMenuTabIndex(1);
                        this.navService.goToRoute('/genes', {
                            outlets: {
                                'genes-router': ['gene-details', this.id],
                                'gene-overview': ['proteomics']
                            }
                        }, this.extras);
                        break;
                    case 'Metabolomics':
                        this.navService.setEvidenceMenuTabIndex(2);
                        this.navService.goToRoute('/genes', {
                            outlets: {
                                'genes-router': ['gene-details', this.id],
                                'gene-overview': ['metabolomics']
                            }
                        }, this.extras);
                        break;
                    default:
                        this.navService.setEvidenceMenuTabIndex(0);
                        this.navService.goToRoute('/genes', {
                            outlets: {
                                'genes-router': ['gene-details', this.id],
                                'gene-overview': ['rna']
                            }
                        }, this.extras);
                }

                this.currentMenuTab = this.navService.getEvidenceMenuTabIndex();
            }
        }
    }

    setActiveItem() {
        if (this.geneInfo) {
            this.activeItem = this.items[this.navService.getEvidenceMenuTabIndex()];
        }
    }

    ngAfterContentChecked() {
        // Small size
        if (this.firstTimeCheck) {
            this.firstTimeCheck = false;
        }
        if (this.menu && this.neverActivated) {
            this.activateMenu(null);
            this.setActiveItem();
        }
    }
}
