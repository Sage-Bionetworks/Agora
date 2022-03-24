import { Component, Input, ViewChildren, ViewEncapsulation } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';

interface Data {
   label?: string,
   heading?: string,
   subHeading?: string,
   value?: number,
   min?: number,
   max?: number,
   footer?: string
}

@Component({
   selector: 'gene-comparison-tool-details-panel',
   templateUrl: './gene-comparison-tool-details-panel.component.html',
   styleUrls: [ './gene-comparison-tool-details-panel.component.scss' ],
   encapsulation: ViewEncapsulation.None
})
export class GeneComparisonToolDetailsPanelComponent {
   event: Event = null;
   dataIndex: number = 1;
   _data: Data[] = [];
   get data() { return this._data[this.dataIndex] }
   @Input() set data(data: Data) {
      if (data && JSON.stringify(data) !== JSON.stringify(this._data[this.dataIndex])) {
         this.dataIndex = 0 === this.dataIndex ? 1 : 0;
         this._data[this.dataIndex] = data;
      }
   }
   isShown: boolean = false;

   @ViewChildren(OverlayPanel) panels!: OverlayPanel;

   getMarkerStyle(data) {
      const percentage = Math.round((data.value - data.min) / (data.max - data.min) * 100);
      return { left: percentage + '%' }
   }

   show(event: Event, data?: Data) {
      this.event = event;
      this.data = data;
      this.panels[0 === this.dataIndex ? 'last' : 'first'].hide();
      this.panels[0 === this.dataIndex ? 'first' : 'last'].show(event);
      this.isShown = true;
   }

   hide() {
      this.panels['first'].hide();
      this.panels['last'].hide();
      this.isShown = false;
   }

   toggle(event: Event, data?: Data) {
      if (event.target === this.event?.target && this.isShown) {
         this.hide()
      } else {
         this.show(event, data);
      }
   }
}
