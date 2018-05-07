import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { BreadcrumbService } from '../../core/services';

@Component({
    selector: 'genes-view',
    templateUrl: './genes-view.component.html',
    styleUrls: [ './genes-view.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GenesViewComponent implements OnInit {
    constructor(
        private breadcrumb: BreadcrumbService
    ) { }

    ngOnInit() {
        this.breadcrumb.setCrumbs([
            { label: 'GENES', routerLink: ['/genes'] }
        ]);
    }
}
