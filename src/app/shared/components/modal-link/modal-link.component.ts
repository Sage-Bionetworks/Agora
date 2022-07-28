// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Component, Input } from '@angular/core';

// -------------------------------------------------------------------------- //
// Component
// -------------------------------------------------------------------------- //
@Component({
  selector: 'modal-link',
  templateUrl: './modal-link.component.html',
  styleUrls: ['./modal-link.component.scss'],
})
export class ModalLinkComponent {
  @Input() icon = 'svg';
  @Input() text = '';
  @Input() header = '';

  @Input() ownerId = '';
  @Input() wikiId = '';

  isActive = false;
  hasActived = false;

  constructor() {}

  toggle() {
    this.hasActived = true;
    this.isActive = !this.isActive;
  }
}
