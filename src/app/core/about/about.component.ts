import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: [ './about.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class AboutComponent implements OnInit {
    ngOnInit() {
        //
    }

    viewSynapseReg() {
        window.open('https://www.synapse.org/#!RegisterAccount:0', '_blank');
    }
}
