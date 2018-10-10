import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'gene-druggability',
    templateUrl: './gene-druggability.component.html',
    styleUrls: [ './gene-druggability.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GeneDruggabilityComponent {

    constructor(
        private router: Router
    ) {}

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets]) : this.router.navigate([path]);
    }
}
