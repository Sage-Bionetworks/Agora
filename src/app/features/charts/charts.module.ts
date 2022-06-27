import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';

import {
  BoxPlotComponent,
  CandlestickChartComponent,
  ForceChartComponent,
  MedianChartComponent,
  RowChartComponent,
  ScoreChartComponent,
} from './components';

@NgModule({
  declarations: [
    BoxPlotComponent,
    CandlestickChartComponent,
    ForceChartComponent,
    MedianChartComponent,
    RowChartComponent,
    ScoreChartComponent,
  ],
  imports: [CommonModule, SharedModule],
  exports: [
    BoxPlotComponent,
    CandlestickChartComponent,
    ForceChartComponent,
    MedianChartComponent,
    RowChartComponent,
    ScoreChartComponent,
  ],
  providers: [],
})
export class ChartsModule {}
