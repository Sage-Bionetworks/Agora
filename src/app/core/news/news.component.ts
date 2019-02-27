import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'news',
    templateUrl: './news.component.html',
    styleUrls: [ './news.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class NewsComponent implements OnInit {
    ngOnInit() {
        //
    }

    viewSynapseReg() {
        window.open('https://www.synapse.org/#!RegisterAccount:0', '_blank');
    }
}
