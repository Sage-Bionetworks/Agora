import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'beta-banner',
    templateUrl: './beta-banner.component.html',
    styleUrls: [ './beta-banner.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class BetaBannerComponent implements OnInit {
    constructor(
        private router: Router,
        public route: ActivatedRoute
    ) {}

    ngOnInit() {
        //
    }

    goToRoute(path: string) {
        this.router.navigate(['/' + path]);
    }
}
