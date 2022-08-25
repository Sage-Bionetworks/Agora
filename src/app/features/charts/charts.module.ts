import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';

import {
  BoxPlotComponent,
  CandlestickChartComponent,
  MedianChartComponent,
  RowChartComponent,
  ScoreChartComponent,
  NetworkChartComponent,
} from './components';

@NgModule({
  declarations: [
    BoxPlotComponent,
    CandlestickChartComponent,
    MedianChartComponent,
    RowChartComponent,
    ScoreChartComponent,
    NetworkChartComponent,
  ],
  imports: [CommonModule, SharedModule],
  exports: [
    BoxPlotComponent,
    CandlestickChartComponent,
    MedianChartComponent,
    RowChartComponent,
    ScoreChartComponent,
    NetworkChartComponent,
  ],
  providers: [],
})
export class ChartsModule {}
