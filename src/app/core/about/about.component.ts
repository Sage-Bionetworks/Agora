import { Component, ViewEncapsulation } from '@angular/core';

import { NavigationService } from '../services';

@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: [ './about.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class AboutComponent {

    constructor(
        private navService: NavigationService
    ) {
        //
    }

    viewSynapseReg() {
        window.open('https://www.synapse.org/#!RegisterAccount:0', '_blank');
    }

    getNavService() {
        return this.navService;
    }
}
