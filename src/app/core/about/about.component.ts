import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: [ './about.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class AboutComponent implements OnInit {
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
