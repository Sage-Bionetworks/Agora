import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'help',
  templateUrl: './help.component.html',
  styleUrls: [ './help.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class HelpComponent {

    wikiId = '612057';
    classNames = 'section-thin help-desc';

    constructor() {
        // empty
    }
}
