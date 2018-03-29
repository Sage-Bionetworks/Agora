import { Injectable, ContentChild } from '@angular/core';

import { MenuItem } from 'primeng/primeng';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class BreadcrumbService {
    private crumbs: ReplaySubject<MenuItem[]>;
    private innerCrumbs: ReplaySubject<MenuItem[]>;
    crumbs$: Observable<MenuItem[]>;
    innerCrumbs$: Observable<MenuItem[]>;

    constructor() {
        this.crumbs = new ReplaySubject<MenuItem[]>();
        this.crumbs$ = this.crumbs.asObservable();
        this.innerCrumbs = new ReplaySubject<MenuItem[]>();
        this.innerCrumbs$ = this.innerCrumbs.asObservable();
    }

    setCrumbs(items: MenuItem[]) {
        //this.crumbs. = [];
        this.crumbs.next(
            (items || []).map(item =>
                Object.assign({}, item, {
                    routerLinkActiveOptions: { exact: true }
                })
            )
        );
    }

    setInnerCrumbs(items: MenuItem[]) {
        //this.crumbs. = [];
        this.innerCrumbs.next(
            (items || []).map(item =>
                Object.assign({}, item, {
                    routerLinkActiveOptions: { exact: true }
                })
            )
        );
    }
}
