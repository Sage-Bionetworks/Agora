import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { removeParenthesis } from '../../../../shared/helpers/app-helpers';

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
        const newValue = removeParenthesis(option);
        return {
          name: option,
          value: newValue,
        } as Option;
      }) || [];
  }

  selected: Option = { name: '', value: '' };

  @Output() onChange: EventEmitter<object> = new EventEmitter<object>();

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const modelFromURL = params['model'];
      let index = this._options.findIndex(o => o.value === modelFromURL);
      if (index === -1) {
        // default to first option if page is loaded without a model parameter
        index = 0;
      }
      this.selected = this._options[index];
      this._onChange();
    });
  }

  _onChange() {
    this.onChange.emit(this.selected);
  }
}
