import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

interface IProperty  {
  title: string;
  description: string;
  link?: string;
  anchorText?: string;
}

@Component({
  selector: 'soe-property',
  templateUrl: './soe-property.component.html',
  styleUrls: ['./soe-property.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SOEPropertyComponent {
  @Input() prop: IProperty | string;

  cols: any[];
  summary: any[];

  isItString(): boolean {
    return typeof this.prop === 'string';
  }

  openWindow(url: string) {
    window.open(url, '_blank');
  }
}
