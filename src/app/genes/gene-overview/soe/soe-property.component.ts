import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core'

type Property = {
  title: string
  description: string
  link?: string
  anchorText?: string
}

@Component({
  selector: 'soe-property',
  templateUrl: './soe-property.component.html',
  styleUrls: ['./soe-property.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SOEPropertyComponent implements OnInit {
  @Input() prop: Property | string

  cols: any[]
  summary: any[]

  constructor() {}
  isItString(): boolean {
    console.log(typeof this.prop === 'string')
    return typeof this.prop === 'string'
  }
  ngOnInit() {}

  openWindow(url: string) {
    window.open(url, '_blank')
  }
}
