import {
  Component,
  Input,
  Output,
  ViewEncapsulation,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
  
import { GCTScorePanelData, OverallScoresDistribution } from '../../../../../../models';
import { HelperService } from '../../../../../../core/services';
import { GeneService } from '../../../../../genes/services';

import * as helpers from '../../gene-comparison-tool.helpers';
  
@Component({
  selector: 'gene-comparison-tool-score-panel',
  templateUrl: './gene-comparison-tool-score-panel.component.html',
  styleUrls: ['./gene-comparison-tool-score-panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GeneComparisonToolScorePanelComponent {
  event: any = null;
  dataIndex = 1;

  @Input() data: GCTScorePanelData | undefined;

  barColor = '#8b8ad1';
    
  @Output() onNavigateToMethodology: EventEmitter<object> = new EventEmitter<object>();
  @Output() onNavigateToFeedback: EventEmitter<object> = new EventEmitter<object>();
  
  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;
  
  scoreDistribution: OverallScoresDistribution | undefined;

  constructor(private helperService: HelperService, private geneService: GeneService) {}

  getValuePosition(data: any) {
    const percentage = Math.round(
      ((data.value - data.min) / (data.max - data.min)) * 100
    );
    return { left: percentage + '%' };
  }

  getIntervalPositions(data: any) {
    const minPercentage = Math.round(
      ((data.intervalMin - data.min) / (data.max - data.min)) * 100
    );

    const maxPercentage =
      100 -
      Math.round(((data.intervalMax - data.min) / (data.max - data.min)) * 100);

    return { left: minPercentage + '%', right: maxPercentage + '%' };
  }

  show(event: Event, data?: GCTScorePanelData) {
    this.event = event;

    if (data && data.distributions) {
      this.data = data;
      const dataKey = helpers.lookupScoreDataKey(data.columnName);
      this.scoreDistribution = data.distributions.find(scores => scores.name.toUpperCase() === dataKey);
      this.overlayPanel.toggle(event);
    }
  }

  hide() {
    this.overlayPanel.hide();
  }

  toggle(event: Event, data?: GCTScorePanelData) {
    if (
      event.target === this.event?.target &&
      this.overlayPanel.overlayVisible
    ) {
      console.log('i will hide now');
      this.hide();
    } else {
      this.show(event, data);
    }
  }
}
  