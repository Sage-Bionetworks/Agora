import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSharedModule } from '../shared';

import { ScatterPlotViewComponent } from './scatter-plot/scatter-plot-view';
import { LineChartViewComponent } from './line-chart/line-chart-view';
import { SelectMenuViewComponent } from './select-menu/select-menu-view';
import { RowChartViewComponent } from './row-chart/row-chart-view';

import {
    SharedModule,
    PanelModule,
    ButtonModule,
    GrowlModule,
    CardModule,
    TooltipModule,
    TabViewModule,
    FieldsetModule
} from 'primeng/primeng';

@NgModule({
    declarations: [
        ScatterPlotViewComponent,
        LineChartViewComponent,
        SelectMenuViewComponent,
        RowChartViewComponent
    ],
    imports: [
        CommonModule,
        AppSharedModule.forRoot(),
        // PrimeNG modules
        SharedModule,
        PanelModule,
        ButtonModule,
        GrowlModule,
        CardModule,
        TooltipModule,
        TabViewModule,
        FieldsetModule
    ],
    exports: [
        ScatterPlotViewComponent,
        LineChartViewComponent,
        SelectMenuViewComponent,
        RowChartViewComponent
    ]
})
// Changed the name so it does not conflict with primeng module
export class ChartsModule {}
