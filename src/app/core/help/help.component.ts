import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'help',
  templateUrl: './help.component.html',
  styleUrls: [ './help.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class HelpComponent {
    ownerId = 'syn25913473';
    wikiId = '612057';
    classNames = 'section-thin help-desc';

    constructor() {
        // empty
    }
}
