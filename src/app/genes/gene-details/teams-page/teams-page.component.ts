import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'teams-page',
    templateUrl: './teams-page.component.html',
    styleUrls: [ './teams-page.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class TeamsPageComponent {
    constructor(
        private router: Router
    ) {}

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets]) : this.router.navigate([path]);
    }
}
