import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { Gene, GeneInfo, TeamInfo, NominatedTarget } from '../../../models';

import {
    ApiService,
    GeneService
} from '../../../core/services';

@Component({
    selector: 'soe',
    templateUrl: './soe.component.html',
    styleUrls: [ './soe.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class SOEComponent implements OnInit {
    @Input() gene: Gene;
    @Input() geneInfo: GeneInfo;
    @Input() id: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private geneService: GeneService
    ) {}

    ngOnInit() {
        if (!this.gene) { this.gene = this.geneService.getCurrentGene(); }
        if (!this.geneInfo) { this.geneInfo = this.geneService.getCurrentInfo(); }

        if (!this.id) { this.id = this.route.snapshot.paramMap.get('id'); }
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

    viewGeneOntology() {
        window.open('https://www.ensembl.org/Homo_sapiens/Gene/Ontologies/molecular_function?g=' +
            this.gene.ensembl_gene_id, '_blank');
    }

    viewPathways() {
        window.open('https://www.ensembl.org/Homo_sapiens/Gene/Pathway?g=' +
            this.gene.ensembl_gene_id, '_blank');
    }

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets]) : this.router.navigate([path]);
    }
}
