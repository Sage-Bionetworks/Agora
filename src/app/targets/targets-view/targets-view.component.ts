import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { BreadcrumbService } from 'app/shared/_services';

@Component({
    selector: 'targets-view',
    templateUrl: './targets-view.component.html',
    styleUrls: [ './targets-view.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class TargetsViewComponent implements OnInit {

    constructor(
        private router: Router,
        private breadcrumb: BreadcrumbService
    ) { }

    ngOnInit() {
        this.breadcrumb.setCrumbs([
            { label: 'TARGETS', routerLink: ['/targets'] }
        ])
    }

    viewGene() {

    }
}
