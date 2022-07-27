// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Component, Input } from '@angular/core';

// -------------------------------------------------------------------------- //
// Component
// -------------------------------------------------------------------------- //
@Component({
  selector: 'svg-icon',
  templateUrl: './svg-icon.component.html',
  styleUrls: ['./svg-icon.component.scss'],
})
export class SvgIconComponent {
  @Input() name = '';
  @Input() customClass = '';

  constructor() {}

  getClasses() {
    const classes = ['svg-icon', 'svg-icon-' + this.name];

    if (this.customClass) {
      classes.push(this.customClass);
    }

    return classes.join(' ');
  }
}
