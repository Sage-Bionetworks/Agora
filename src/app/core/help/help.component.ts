import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'help',
  templateUrl: './help.component.html',
  styleUrls: [ './help.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class HelpComponent {
    constructor() {
        //
    }

    sendEmail(clientMail: string) {
        window.open(clientMail);
    }
}
