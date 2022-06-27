import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'help-page',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HelpPageComponent {
  wikiId = '612057';
  className = 'help-page-content';
}
