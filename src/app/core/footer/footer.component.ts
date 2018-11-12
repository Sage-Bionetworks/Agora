import { Component, ViewEncapsulation } from '@angular/core';

import { NavigationService } from '../services';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: [ './footer.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class FooterComponent {
    constructor(
        private navService: NavigationService
    ) {
        //
    }

    getVersion(data?: boolean): string {
        return ((data) ? DATA_VERSION : VERSION) || '0.0.0';
    }

    goToRoute(path: string) {
        this.navService.goToRoute('/' + path);
    }
}
