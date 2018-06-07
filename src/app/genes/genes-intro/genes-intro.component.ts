import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'genes-intro',
    templateUrl: './genes-intro.component.html',
    styleUrls: [ './genes-intro.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class GenesIntroComponent {
    constructor(
        private router: Router
    ) {}

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets]) : this.router.navigate([path]);
    }
}
