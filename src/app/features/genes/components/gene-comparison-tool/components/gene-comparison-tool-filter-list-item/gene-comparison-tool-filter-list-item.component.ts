import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'gene-comparison-tool-filter-list-item',
  templateUrl: './gene-comparison-tool-filter-list-item.component.html',
  styleUrls: ['./gene-comparison-tool-filter-list-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GeneComparisonToolFilterListItemComponent {
  @Input() item: any;
  @Input() isVisible = false;
  @Input() title = '';
  @Input() description = '';
  @Output() onClear: EventEmitter<object> = new EventEmitter<object>();

  clearWasClicked() {
    this.isVisible = false;
    this.onClear.emit(this.item);
  }
}
