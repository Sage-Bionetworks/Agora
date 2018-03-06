import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Gene } from '../../../models';

import { GeneService } from '../../services';

@Component({
    selector: 'gene-rnaseq-de',
    templateUrl: './gene-rnaseq-de.component.html',
    styleUrls: [ './gene-rnaseq-de.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GeneRNASeqDEComponent implements OnInit {
    @Input() styleClass: string = 'rnaseq-panel';
    @Input() style: any;
    @Input() gene: Gene;
    @Input() tissues: string[];
    @Input() id: string;

    private sub: any;

    selectedTissue: string;
    selectedModel: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private geneService: GeneService
    ) { }

    ngOnInit() {
        if (!this.gene) this.router.navigate(['/targets']);
        this.tissues = this.geneService.getTissues();
        this.router.navigate(['/targets/gene-details/'+this.id, {'title': 'Volcano Plot'}, { outlets: { 'chart': ['scatter-plot'] }} ]);
    }

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets], {relativeTo: this.route}) : this.router.navigate([path], {relativeTo: this.route});
    }
}
