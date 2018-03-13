import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BreadcrumbService } from 'app/core/services';
import { GeneService } from '../services';
import { Observable } from 'rxjs/Observable';

import { Gene } from '../../models';

import { DecimalPipe } from '@angular/common';
import { NumbersPipe } from '../../shared/pipes';

import { Message, SortEvent } from 'primeng/primeng';

@Component({
    selector: 'targets-list',
    templateUrl: './targets-list.component.html',
    styleUrls: [ './targets-list.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class TargetsListComponent implements OnInit {
    @Input() fname: string = 'default.json';

    msgs: Message[] = [];
    genes$: Observable<Gene[]>;
    totalRecords: number;
    cols: any[];
    loading: boolean;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private geneService: GeneService
    ) { }

    ngOnInit() {
        this.genes$ = this.geneService.getGenes(this.fname);
        //this.genes = this.geneService.getDBGenes();
        this.genes$.subscribe(data => {
            this.geneService.setGenes(data);
        })

        this.cols = [
            { field: 'hgnc_symbol', header: 'Gene' },
            { field: 'AveExpr', header: 'Score' }
        ];
    }

    getAlignment(i: number, max: number) {
        return (i < max) ? 'left' : 'right';
    }

    onRowSelect(event) {
        this.msgs = [{severity:'info', summary:'Gene Selected', detail:'Gene: ' + event.data.hgnc_symbol}];
        this.geneService.setCurrentGene(event.data);
        let gene = this.geneService.getCurrentGene();
        if (gene) this.router.navigate(['gene-details', gene.ensembl_gene_id], {relativeTo: this.route});
    }

    onRowUnselect(event) {
        this.msgs = [{severity:'info', summary:'Gene Unselected', detail:'Gene: ' + event.data.hgnc_symbol}];
        this.geneService.setCurrentGene(null);
    }

    isNaN(input: any) {
        return isNaN(input);
    }

    customSort(event: SortEvent) {
        event.data.sort((data1, data2) => {
            let value1 = data1[event.field];
            let value2 = data2[event.field];
            let result = null;

            if (value1 == null && value2 != null)
                result = -1;
            else if (value1 != null && value2 == null)
                result = 1;
            else if (value1 == null && value2 == null)
                result = 0;
            else if (typeof value1 === 'string' && typeof value2 === 'string')
                result = value1.localeCompare(value2);
            else
                result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

            return (event.order * result);
        });
    }
}
