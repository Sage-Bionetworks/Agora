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

    viewSynapseReg() {
        window.open('https://www.synapse.org/#!RegisterAccount:0', '_blank');
    }

    goToRoute(path: string) {
        this.router.navigate(['/' + path]);
    }
}
