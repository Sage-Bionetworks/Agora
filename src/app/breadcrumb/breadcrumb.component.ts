import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MenuItem } from 'primeng/primeng';

import { BreadcrumbService } from '../shared/_services';

import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: [ './breadcrumb.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class BreadcrumbComponent implements OnInit {
    @Input() type: string = 'outer';
    @Input() styleClass: string = '';

    @ViewChild('micon') menuIcon: ElementRef;

    items: MenuItem[];
    home: any;
    crumbs$: Observable<MenuItem[]>;
    innerCrumbs$: Observable<MenuItem[]>;

    popupItems: MenuItem[];

    constructor(
        private breadcrumb: BreadcrumbService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.home = { icon: 'fa fa-home fa-lg fa fa-home fa-lg', routerLink: ['/dashboard'] };
        this.crumbs$ = this.breadcrumb.crumbs$;

        this.popupItems = [
            {
                label: 'MY SAGE',
                items: [
                    {label: 'Personalize Dashboard', icon: 'fa fa-desktop'},
                    {label: 'Favorites', icon: 'fa fa-heart'},
                    {label: 'Recently Viewed', icon: 'fa fa-clock-o'},
                    {label: 'History', icon: 'fa fa-history'}
                ]
            },
            {
                label: 'EXPLORE',
                items: [
                    {label: 'New Content', icon: 'fa fa-flag-o'},
                    {label: 'Update Content', icon: 'fa fa-refresh'},
                    {label: 'Browse All Content', icon: 'fa fa-folder-open-o'},
                    {label: 'Search', icon: 'fa fa-search'},
                    {label: 'Analytics', icon: 'fa fa-pie-chart'}
                ]
            }
        ];
    }

    getCrumbs() {
        return this.crumbs$;
    }

    goToRoute(path: string) {
        this.router.navigate(['/' + path]);
    }

    getGradient() {
        return 'gradientheader';
    }

    closeMenu(event: any) {
        this.menuIcon.nativeElement.classList.toggle('active');
    }
}
