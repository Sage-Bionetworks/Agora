import { Component, Input, Output, EventEmitter } from '@angular/core';

interface Option {
  name: string;
  value: string;
}

@Component({
  selector: 'gene-model-selector',
  templateUrl: './gene-model-selector.component.html',
  styleUrls: ['./gene-model-selector.component.scss'],
})
export class GeneModelSelectorComponent {
  _options: Option[] = [];
  get options(): Option[] {
    return this._options;
  }
  @Input() set options(options: any) {
    this.selected = {} as Option;
    this._options =
      options?.map((option: any) => {
        return {
          name: option,
          value: option,
        } as Option;
      }) || [];

    if (this._options.length) {
      this.selected = this._options[0];
    }
  }

  @Input() selected: Option = { name: '', value: '' };

  @Output() onChange: EventEmitter<object> = new EventEmitter<object>();

  constructor() {}

  _onChange() {
    this.onChange.emit(this.selected);
  }
}
