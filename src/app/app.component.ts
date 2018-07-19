/**
 * Angular 2 decorators and services
 */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { environment } from 'environments/environment';
import { AppState } from './app.service';
import { Router, NavigationEnd } from '@angular/router';

export const ROOT_SELECTOR = 'app';

/**
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.css' ],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
    name = 'Agora BETA';
    showDevModule: boolean = environment.showDevModule;

    constructor(
        private appState: AppState,
        private router: Router
    ) {}

    ngOnInit() {
        console.log('Initial App State', this.appState.state);

        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });
    }
}
