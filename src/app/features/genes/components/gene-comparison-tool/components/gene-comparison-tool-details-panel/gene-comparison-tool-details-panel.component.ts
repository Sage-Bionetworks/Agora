import {
  Component,
  Input,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';

import { GCTDetailsPanelData } from '../../../../../../models';
import { HelperService } from '../../../../../../core/services';

@Component({
  selector: 'gene-comparison-tool-details-panel',
  templateUrl: './gene-comparison-tool-details-panel.component.html',
  styleUrls: ['./gene-comparison-tool-details-panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GeneComparisonToolDetailsPanelComponent {
  event: any = null;
  dataIndex = 1;
  _data: GCTDetailsPanelData[] = [];
  get data() {
    return this._data[this.dataIndex];
  }
  @Input() set data(data: GCTDetailsPanelData) {
    if (
      data &&
      JSON.stringify(data) !== JSON.stringify(this._data[this.dataIndex])
    ) {
      this.dataIndex = 0 === this.dataIndex ? 1 : 0;
      this._data[this.dataIndex] = data;
    }
  }
  isShown = false;

  @ViewChildren(OverlayPanel) panels: any = {} as OverlayPanel;

  constructor(private helperService: HelperService) {}

  getMarkerStyle(data: any) {
    const percentage = Math.round(
      ((data.value - data.min) / (data.max - data.min)) * 100
    );
    return { left: percentage + '%' };
  }

  show(event: any, data?: GCTDetailsPanelData) {
    this.event = event;
    this.data = data || {};
    this.panels[0 === this.dataIndex ? 'last' : 'first'].hide();

    if (this.event?.target) {
      this.panels[0 === this.dataIndex ? 'first' : 'last'].show(this.event);
    } else {
      const target = document.createElement('span');
      this.panels[0 === this.dataIndex ? 'first' : 'last'].show(
        new Event('click'),
        target
      );
    }

    this.isShown = true;
  }

  hide() {
    this.panels['first'].hide();
    this.panels['last'].hide();
    this.isShown = false;
  }

  toggle(event: any, data?: GCTDetailsPanelData) {
    if (event.target === this.event?.target && this.isShown) {
      this.hide();
    } else {
      this.show(event, data);
    }
  }

  getSignificantFigures(n: any, b: any) {
    return this.helperService.getSignificantFigures(n, b);
  }
}
