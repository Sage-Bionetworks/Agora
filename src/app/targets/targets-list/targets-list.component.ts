import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { BreadcrumbService } from 'app/core/services';
import { GeneService } from '../services';
import { PapaParseService } from 'ngx-papaparse';
import { Observable } from 'rxjs/Observable';

import { Gene } from '../../shared/models';

import { Message } from 'primeng/primeng';

@Component({
    selector: 'targets-list',
    templateUrl: './targets-list.component.html',
    styleUrls: [ './targets-list.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class TargetsListComponent implements OnInit {
    @Input() fname: string = 'default.json';

    msgs: Message[] = [];
    genes: Gene[];
    totalRecords: number;
    cols: any[];
    loading: boolean;

    constructor(
        private router: Router,
        private geneService: GeneService,
        private papa: PapaParseService
    ) { }

    ngOnInit() {
        this.geneService.getGene(this.fname).subscribe(data => {
            this.genes = data;
        });

        this.cols = [
            { field: 'hgnc_symbol', header: 'Gene' },
            { field: 'Study', header: 'Center(s)' },
            { field: 'percentage_gc_content', header: 'Nominations' }
        ];
    }

    getAlignment(i: number, max: number) {
        return (i < max) ? 'left' : 'right';
    }

    onRowSelect(event) {
        this.msgs = [{severity:'info', summary:'Gene Selected', detail:'Gene: ' + event.data.hgnc_symbol}];
        this.geneService.setCurrentGene(event.data.hgnc_symbol);
    }

    onRowUnselect(event) {
        this.msgs = [{severity:'info', summary:'Gene Unselected', detail:'Gene: ' + event.data.hgnc_symbol}];
        this.geneService.setCurrentGene(null);
    }
}
