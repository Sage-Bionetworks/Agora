import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

import { GeneComparisonToolFilter, GeneComparisonToolFilterOption } from '../..';

@Component({
   selector: 'gene-comparison-tool-filter-list',
   templateUrl: './gene-comparison-tool-filter-list.component.html',
   styleUrls: [ './gene-comparison-tool-filter-list.component.scss' ],
   encapsulation: ViewEncapsulation.None
})
export class GeneComparisonToolFilterListComponent {
   @Input() filters: GeneComparisonToolFilter[];
   @Output() onChange: EventEmitter<object> = new EventEmitter<object>();

   hasSelectedFilters() {
      for (const filter of this.filters) {
         if (filter.options.filter(option => option.selected).length > 0) {
            return true;
         }
      }
      return false;
   }

   clear(option?: GeneComparisonToolFilterOption) {
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
}
