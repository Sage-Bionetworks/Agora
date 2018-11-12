import {
    Component,
    OnInit,
    Input,
    ViewEncapsulation,
    ViewChild,
    AfterContentChecked
} from '@angular/core';

import { Gene, GeneInfo } from '../../../models';

import { GeneService, NavigationService } from '../../../core/services';

import { MenuItem } from 'primeng/api';

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
    @ViewChild('overviewMenu') menu: MenuItem[];

    activeItem: MenuItem;
    currentGeneData = [];
    subscription: any;
    items: MenuItem[];
    neverActivated: boolean = true;

    constructor(
        private navService: NavigationService,
        private geneService: GeneService
    ) {}

    ngOnInit() {
        // Populate the tab menu
        this.items = [
            {label: 'RNA'},
            {label: 'Protein'},
            {label: 'Metabolomics'},
            {label: 'Single Cell RNA-Seq'},
            {label: 'Genomic'}
        ];

        this.geneInfo = this.geneService.getCurrentInfo();
        this.setActiveItem();
    }

    activateMenu() {
        this.activeItem = this.menu['activeItem'];
        if (this.activeItem) {
            switch (this.activeItem.label) {
                case 'RNA':
                    this.navService.goToRoute('/genes', {
                        outlets: {
                            'genes-router': ['gene-details', this.id],
                            'gene-overview': ['nom-details']
                        }
                    });
                    break;
                default:
                    this.navService.goToRoute('/genes', {
                        outlets: {
                            'genes-router': ['gene-details', this.id],
                            'gene-overview': ['nom-details']
                        }
                    });
            }
        }
    }

    ngAfterContentChecked() {
        if (this.menu && this.neverActivated) {
            this.neverActivated = false;
            this.activateMenu();
        }
    }

    setActiveItem() {
        if (this.geneInfo) {
            this.items[0].visible = true;
            this.activeItem = this.items[0];
        }
    }
}
