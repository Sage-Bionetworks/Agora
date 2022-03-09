import { Component, ViewChildren, ViewEncapsulation } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';

interface Data {
   gene: object,
   tissue: string,
   category: string,
   model: string
}

@Component({
   selector: 'gene-comparison-tool-details-panel',
   templateUrl: './gene-comparison-tool-details-panel.component.html',
   styleUrls: [ './gene-comparison-tool-details-panel.component.scss' ],
   encapsulation: ViewEncapsulation.None
})
export class GeneComparisonToolDetailsPanelComponent {
   event: Event = null;
   data: Data[] = [];
   dataIndex: number = 1;
   isShown: boolean = false;

   @ViewChildren(OverlayPanel) panels!: OverlayPanel;

   constructor() { }

   setData(data: Data) {
      if (data && JSON.stringify(data) !== JSON.stringify(this.data[this.dataIndex])) {
         this.dataIndex = 0 === this.dataIndex ? 1 : 0;
         this.data[this.dataIndex] = data;
      }
   }

   show(event: Event, data?: Data) {
      this.event = event;
      this.setData(data);
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
