import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';

import { GCTFilter, GCTFilterOption } from '../../../../../../models';

@Component({
  selector: 'gene-comparison-tool-filter-list',
  templateUrl: './gene-comparison-tool-filter-list.component.html',
  styleUrls: ['./gene-comparison-tool-filter-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GeneComparisonToolFilterListComponent {
  /* Filters ------------------------------------------------------------------ */
  @Input() filters: GCTFilter[] = [] as GCTFilter[];
  @Output() onChange: EventEmitter<object> = new EventEmitter<object>();

  /* Significance Threshold --------------------------------------------------- */
  @Input() significanceThresholdActive = false;
  @Input() significanceThreshold = -1;
  @Output() onremoveSignificanceThresholdFilter: EventEmitter<any> =
    new EventEmitter();

  /* ----------------------------------------------------------------------- */
  /* All
  /* ----------------------------------------------------------------------- */
  shouldShowList() {
    return this.hasSelectedFilters() || this.significanceThresholdActive;
  }

  clearList() {
    this.removeSignificanceThresholdFilter();
    this.clearSelectedFilters();
  }

  /* ----------------------------------------------------------------------- */
  /* Filters
  /* ----------------------------------------------------------------------- */
  hasSelectedFilters() {
    for (const filter of this.filters) {
      if (filter.options.filter((option) => option.selected).length > 0) {
        return true;
      }
    }
    return false;
  }

  clearSelectedFilters(option?: GCTFilterOption) {
    if (option) {
      option.selected = false;
    } else {
      for (const filter of this.filters) {
        for (const o of filter.options) {
          o.selected = false;
        }
      }
    }
    this.onChange.emit(this.filters);
  }

  /* ----------------------------------------------------------------------- */
  /* Significance Threshold
  /* ----------------------------------------------------------------------- */
  removeSignificanceThresholdFilter(): void {
    this.significanceThresholdActive = false;
    this.onremoveSignificanceThresholdFilter.emit(
      this.significanceThresholdActive
    );
  }
}
