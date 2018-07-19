import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'terms',
    templateUrl: './terms.component.html',
    styleUrls: [ './terms.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class TermsComponent implements OnInit {
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
