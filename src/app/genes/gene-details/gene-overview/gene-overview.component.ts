import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { Gene } from '../../../models';

import {
    BreadcrumbService,
    GeneService,
    DataService
} from '../../../core/services';

@Component({
    selector: 'gene-overview',
    templateUrl: './gene-overview.component.html',
    styleUrls: [ './gene-overview.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GeneOverviewComponent implements OnInit {
    @Input() styleClass: string = 'overview-panel';
    @Input() style: any;
    @Input() gene: Gene;
    @Input() id: string;
    @Input() models: string[] = [];
    @Input() tissues: string[] = [];
    @Input() dataLoaded: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private breadcrumb: BreadcrumbService,
        private geneService: GeneService,
        private dataService: DataService,
        private location: Location
    ) { }

    ngOnInit() {
        // Get the current clicked gene
        if (!this.gene) { this.gene = this.geneService.getCurrentGene(); }

        if (!this.id) { this.id = this.route.snapshot.paramMap.get('id'); }
        // If we don't have a Gene or any Models/Tissues here, or in case we are
        // reloading the page, try to get it from the server and move on
        if (!this.gene || !this.geneService.getModels().length ||
            this.geneService.getTissues().length) {
            this.dataService.getGene(this.id).subscribe((data) => {
                if (!data['item']) { this.router.navigate(['/genes']); }
                this.geneService.setCurrentGene(data['item']);
                this.geneService.setLogFC(data['minLogFC'], data['maxLogFC']);
                this.geneService.setNegAdjPValue(data['maxNegLogPValue']);
                this.gene = data['item'];

                this.geneService.loadTissues().then((tstatus) => {
                    if (tstatus) {
                        this.geneService.loadModels().then((mstatus) => {
                            if (mstatus) {
                                this.initDetails();
                            }
                        });
                    }
                });
            });
        } else {
            this.initDetails();
        }
    }

    initDetails() {
        this.dataService.loadGenes().then((genesLoaded) => {
            if (genesLoaded) {
                this.dataLoaded = genesLoaded;
            }
            // Handle error later
        });
    }

    getTextColor(state: boolean, normal?: boolean) {
        const colorClass = (state) ? 'green-text' : 'red-text';
        return (normal) ? colorClass + ' normal-heading' : '';
    }

    getRNASeqLink(): string[] {
        return ['gene-rna-seq', this.gene.hgnc_symbol];
    }

    getCoExpNetLink(): string[] {
        return ['gene-coexp-network', this.gene.hgnc_symbol];
    }

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets]) : this.router.navigate([path]);
    }

    goBack() {
        this.location.back();
    }
}
