import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { BreadcrumbService, GeneService } from 'app/shared/_services';

import { Gene } from '../../shared/_models';

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
        private geneService: GeneService
    ) { }

    ngOnInit() {
        this.geneService.getGenes(this.fname).subscribe(data => {
            console.log('data');
            console.log(data);
            console.log(data['data']);
            this.genes = data['data'];
        });

        this.cols = [
            { field: 'gene', header: 'Gene' },
            { field: 'center', header: 'Center(s)' },
            { field: 'nominations', header: 'Nominations' }
        ];
    }

    getAlignment(i: number, max: number) {
        return (i < max) ? 'left' : 'right';
    }

    onRowSelect(event) {
        this.msgs = [{severity:'info', summary:'Gene Selected', detail:'Gene: ' + event.data.gene}];
    }

    onRowUnselect(event) {
        this.msgs = [{severity:'info', summary:'Gene Unselected', detail:'Gene: ' + event.data.gene}];
    }
}
