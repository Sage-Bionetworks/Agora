import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'dialog-link',
  templateUrl: './dialog-link.component.html',
  styleUrls: ['./dialog-link.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogLinkComponent {
  @Input() icon = 'fa-solid fa-circle-info';
  @Input() label = '';
  @Input() header = '';

  @Input() ownerId = '';
  @Input() wikiId = '';

  isActive = false;
  hasOpened = false;

  constructor() {}

  showDialog() {
    this.isActive = true;
    this.hasOpened = true;
  }
}
