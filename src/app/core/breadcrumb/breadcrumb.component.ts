import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Router } from '@angular/router';

import { MenuItem } from 'primeng/primeng';

import { BreadcrumbService } from '../services';

import { Observable } from 'rxjs';

@Component({
    selector: 'breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: [ './breadcrumb.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class BreadcrumbComponent implements OnInit {
    @Input() styleClass: string = '';

    items: MenuItem[];
    home: any;
    crumbs$: Observable<MenuItem[]>;
    innerCrumbs$: Observable<MenuItem[]>;

    constructor(
        private breadcrumb: BreadcrumbService,
        private router: Router
    ) {}

    ngOnInit() {
        this.home = { icon: 'fa fa-home fa-lg fa fa-home fa-lg', routerLink: ['/genes'] };
        this.crumbs$ = this.breadcrumb.crumbs$;
    }

    getCrumbs() {
        return this.crumbs$;
    }

    goToRoute(path: string) {
        this.router.navigate(['/' + path]);
    }
}
