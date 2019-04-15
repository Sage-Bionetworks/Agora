/**
 * Angular 2 decorators and services
 */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { environment } from 'environments/environment';
import { Router, NavigationEnd } from '@angular/router';

export const ROOT_SELECTOR = 'app';

import * as browserUpdate from 'browser-update';

import { filter } from 'rxjs/operators';

/**
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
    name = 'Agora';
    showDevModule: boolean = environment.showDevModule;
    buParams: any = {
        required: {
            e: -2,
            i: 11,
            f: -3,
            o: -3,
            s: 10.1,
            c: '64.0.3282.16817',
            samsung: 7.0,
            vivaldi: 1.2
        },
        insecure: true
    };

    constructor(
        private router: Router
    ) {
        const navEndEvent$ = router.events.pipe(
            filter((e) => e instanceof NavigationEnd)
        );
        navEndEvent$.subscribe((e: NavigationEnd) => {
            (window as any).dataLayer.push({
                page_path: e.urlAfterRedirects
            });
        });
    }

    ngOnInit() {
        this.initBrowserUpdate(browserUpdate, this.buParams);

        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });
    }

    initBrowserUpdate(bu: any, bup: any) {
        bu(bup);
    }
}
