import {
  Component,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'gene-comparison-tool-legend-panel',
  templateUrl: './gene-comparison-tool-legend-panel.component.html',
  styleUrls: ['./gene-comparison-tool-legend-panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GeneComparisonToolLegendPanelComponent {
  isActive = false;

  @Output() howToClick: EventEmitter<any> = new EventEmitter();

  constructor() {}

  toggle() {
    this.isActive = !this.isActive;
  }

  onHowToClick() {
    this.howToClick.emit(null);
  }
}
