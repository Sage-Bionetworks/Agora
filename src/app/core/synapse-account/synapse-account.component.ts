import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'synapse-account',
    templateUrl: './synapse-account.component.html',
    styleUrls: [ './synapse-account.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class SynapseAccountComponent implements OnInit {
    constructor() {
        //
    }

    ngOnInit() {
        //
    }

    viewSynapseReg() {
        window.open('https://www.synapse.org/#!RegisterAccount:0', '_blank');
    }
}
