import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'synapse-account',
    templateUrl: './synapse-account.component.html',
    styleUrls: [ './synapse-account.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class SynapseAccountComponent implements OnInit {
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
