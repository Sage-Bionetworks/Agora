import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSharedModule } from '../shared';

import { GeneService } from '../targets/services';

import { ScatterPlotViewComponent } from './scatter-plot/scatter-plot-view';
import { LineChartViewComponent } from './line-chart/line-chart-view';

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
        LineChartViewComponent
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
        LineChartViewComponent
    ],
    providers: [
        GeneService
    ]
})
// Changed the name so it does not conflict with primeng module
export class ChartsModule {}
