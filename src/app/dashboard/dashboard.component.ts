import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { BreadcrumbService } from '../shared/_services';
import {
    Router,
    ActivatedRoute
} from '@angular/router';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent implements OnInit {

    constructor(
        private breadcrumb: BreadcrumbService,
        private router : Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.breadcrumb.setCrumbs([
            { label: 'MY DASHBOARD', routerLink: ['/dashboard'] }
        ])
    }

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets], {relativeTo: this.route}) : this.router.navigate([path], {relativeTo: this.route});
    }
}
