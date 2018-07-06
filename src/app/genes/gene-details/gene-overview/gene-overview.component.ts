import { Component, OnInit, Input, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { Gene, GeneInfo, GeneNetwork } from '../../../models';

import {
    GeneService,
    DataService
} from '../../../core/services';
import { ForceService } from '../../../shared/services';

@Component({
    selector: 'gene-overview',
    templateUrl: './gene-overview.component.html',
    styleUrls: [ './gene-overview.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GeneOverviewComponent implements OnInit, OnDestroy {
    @Input() styleClass: string = 'overview-panel';
    @Input() style: any;
    @Input() gene: Gene;
    @Input() geneInfo: GeneInfo;
    @Input() id: string;
    @Input() models: string[] = [];
    @Input() tissues: string[] = [];
    @Input() dataLoaded: boolean = false;

    displayRelDia: boolean = false;
    displaySDDia: boolean = false;
    displayActDia: boolean = false;
    currentGeneData = [];
    subscription: any;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private geneService: GeneService,
        private dataService: DataService,
        private location: Location,
        private forceService: ForceService
    ) { }

    ngOnInit() {
        this.subscription = this.forceService.getGenes()
            .subscribe((data: GeneNetwork) => this.currentGeneData = data.nodes);
        // Get the current clicked gene
        if (!this.gene) { this.gene = this.geneService.getCurrentGene(); }
        if (!this.geneInfo) { this.geneInfo = this.geneService.getCurrentInfo(); }

        if (!this.id) { this.id = this.route.snapshot.paramMap.get('id'); }
        // If we don't have a Gene or any Models/Tissues here, or in case we are
        // reloading the page, try to get it from the server and move on
        if (!this.gene || !this.geneInfo || !this.geneService.getGeneModels().length ||
            !this.geneService.getGeneTissues().length || this.id !== this.gene.ensembl_gene_id) {
            this.dataService.getGene(this.id).subscribe((data) => {
                if (!data['item']) { this.router.navigate(['/genes']); }
                this.geneService.updateGeneData(data);
                this.gene = data['item'];
                this.geneInfo = data['info'];

                this.geneService.loadGeneTissues().then((tstatus) => {
                    if (tstatus) {
                        this.geneService.loadGeneModels().then((mstatus) => {
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
                // this.currentGeneData = this.forceService.getGenes().nodes;
            }
            // Handle error later
        });
    }

    getTextColor(state: boolean, normal?: boolean): string {
        const colorClass = (state) ? 'green-text' : 'red-text';
        return (normal) ? colorClass + ' normal-heading' : '';
    }

    getSummary(body: boolean): string {
        const summaryArray = this.geneInfo.summary.split(' [provided by ');
        if (body) {
            return summaryArray[0];
        } else {
            // Use a minus 2 instead of minus 1 because of the final dot in the string
            return summaryArray[1].substring(0, summaryArray[1].length - 2);
        }
    }

    getAlias() {
        if (this.geneInfo.alias.length > 0) {
            return this.geneInfo.alias.join(', ');
        }
        return '';
    }

    getRNASeqLink(): string[] {
        return ['gene-rna-seq', this.gene.hgnc_symbol];
    }

    getCoExpNetLink(): string[] {
        return ['gene-coexp-network', this.gene.hgnc_symbol];
    }

    showDialog(dialogString: string) {
        this[dialogString] = true;
    }

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets]) : this.router.navigate([path]);
    }

    goBack() {
        this.location.back();
    }

    viewPathaways() {
        window.open('https://www.ensembl.org/Homo_sapiens/Gene/Pathway?g=' +
            this.gene.ensembl_gene_id, '_blank');
    }

    viewGeneOntology() {
        window.open('https://www.ensembl.org/Homo_sapiens/Gene/Ontologies/molecular_function?g=' +
            this.gene.ensembl_gene_id, '_blank');
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
