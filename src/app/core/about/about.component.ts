import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: [ './about.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class AboutComponent {

    wikiId = '612058';
    classNames = 'section-thin about-desc';

    constructor() {
        // empty
    }

}
