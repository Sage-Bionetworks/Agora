import {
    Component,
    OnInit,
    Input,
    ViewEncapsulation,
    ViewChild,
    AfterContentChecked
} from '@angular/core';
import { NavigationExtras } from '@angular/router';

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
    chartSub: Subscription;
    items: MenuItem[];
    neverActivated: boolean = true;
    disableMenu: boolean = false;
    firstTimeCheck: boolean = true;
    currentMenuTab: number = -1;

    constructor(
        private navService: NavigationService,
        private geneService: GeneService,
        private chartService: ChartService
    ) {}

    ngOnInit() {
        // Populate the tab menu
        this.populateTabMenu();
        this.geneInfo = this.geneService.getCurrentInfo();
    }

    populateTabMenu() {
        this.items = [
            { label: 'RNA', disabled: false } as MenuItem,
            { label: 'Protein', disabled: false } as MenuItem,
            { label: 'Metabolomics', disabled: false } as MenuItem
        ];
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
