import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSharedModule } from '../shared';

import { ScatterPlotViewComponent } from './scatter-plot/scatter-plot-view';
import { SelectMenuViewComponent } from './select-menu/select-menu-view';
import { RowChartViewComponent } from './row-chart/row-chart-view';

import { ChartService } from './services';

import {
    ButtonModule
} from 'primeng/button';

@NgModule({
    declarations: [
        ScatterPlotViewComponent,
        SelectMenuViewComponent,
        RowChartViewComponent
    ],
    imports: [
        CommonModule,
        AppSharedModule.forRoot(),
        // PrimeNG modules
        ButtonModule
    ],
    exports: [
        ScatterPlotViewComponent,
        SelectMenuViewComponent,
        RowChartViewComponent
    ],
    providers: [
        ChartService
    ]
})
// Changed the name so it does not conflict with primeng module
export class ChartsModule {}
