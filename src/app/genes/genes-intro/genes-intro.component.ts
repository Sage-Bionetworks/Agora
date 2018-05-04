import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BreadcrumbService } from '../../core/services';

@Component({
    selector: 'genes-intro',
    templateUrl: './genes-intro.component.html',
    styleUrls: [ './genes-intro.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GenesIntroComponent implements OnInit {
    constructor(
        private router: Router,
        private breadcrumb: BreadcrumbService,
    ) { }

    ngOnInit() {
        this.breadcrumb.setCrumbs([
            { label: 'GENES', routerLink: ['/genes'] }
        ]);
    }

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets]) : this.router.navigate([path]);
    }
}
