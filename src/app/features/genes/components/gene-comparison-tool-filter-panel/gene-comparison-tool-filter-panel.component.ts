import {
  Component,
  Input,
  Output,
  ViewEncapsulation,
  EventEmitter,
} from '@angular/core';

import { GCTFilter } from '../gene-comparison-tool';

@Component({
  selector: 'gene-comparison-tool-filter-panel',
  templateUrl: './gene-comparison-tool-filter-panel.component.html',
  styleUrls: ['./gene-comparison-tool-filter-panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GeneComparisonToolFilterPanelComponent {
  @Input() filters: GCTFilter[] = [] as GCTFilter[];

  isOpen = false;
  activePane = -1;

  @Output() onChange: EventEmitter<object> = new EventEmitter<object>();

  handleChange() {
    this.onChange.emit(this.filters);
  }

  openPane(index: number) {
    this.activePane = index;
  }

  closePanes() {
    this.activePane = -1;
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.closePanes();
    this.isOpen = false;
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }
}
