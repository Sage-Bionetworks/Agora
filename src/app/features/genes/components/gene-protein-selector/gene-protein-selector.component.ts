import { Component, Input, Output, EventEmitter } from '@angular/core';

interface Option {
  name: string;
  value: string;
}

@Component({
  selector: 'gene-protein-selector',
  templateUrl: './gene-protein-selector.component.html',
  styleUrls: ['./gene-protein-selector.component.scss'],
})
export class GeneProteinSelectorComponent {
  _options: Option[] = [];
  get options(): Option[] {
    return this._options;
  }
  @Input() set options(options: any) {
    this._options =
      options?.map((option: any) => {
        return {
          name: option,
          value: option,
        };
      }) || [];

    if (this._options.length > 0) {
      this.selected.name = this._options[0]?.name || '';
      this.selected.value = this._options[0]?.value || '';
    }
  }

  selected: Option = {} as Option;

  @Output() onChange: EventEmitter<object> = new EventEmitter<object>();

  constructor() {}

  _onChange() {
    this.onChange.emit(this.selected);
  }
}
