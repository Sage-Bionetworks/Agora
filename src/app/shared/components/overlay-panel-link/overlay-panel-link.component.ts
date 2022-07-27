// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Component, Input, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';

// -------------------------------------------------------------------------- //
// Component
// -------------------------------------------------------------------------- //
@Component({
  selector: 'overlay-panel-link',
  templateUrl: './overlay-panel-link.component.html',
  styleUrls: ['./overlay-panel-link.component.scss'],
})
export class OverlayPanelLinkComponent {
  @Input() icon = 'svg';
  @Input() text = '';

  @Input() ownerId = '';
  @Input() wikiId = '';

  isActive = false;
  hasActived = false;

  @ViewChild('panel') panel!: OverlayPanel;

  constructor() {}

  toggle(event: Event) {
    this.hasActived = true;
    this.isActive = !this.isActive;
    this.panel.toggle(event);
  }
}
