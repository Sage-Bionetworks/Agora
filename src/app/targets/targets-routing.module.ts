import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TargetsViewComponent } from './targets-view';
import { GeneDetailsViewComponent } from './gene-details/gene-details-view';
import { ScatterPlotViewComponent } from '../charts/scatter-plot/scatter-plot-view';
import { RowChartViewComponent } from '../charts/row-chart/row-chart-view';

const routes: Routes = [
    { path: '', component: TargetsViewComponent },
    { path: 'gene-details/:id', component: GeneDetailsViewComponent, children: [
        {
            path: 'left-scatter-plot/:label',
            component: ScatterPlotViewComponent, outlet: 'left-chart'
        },
        {
            //path: 'right-scatter-plot/:label',
            path: 'right-row-chart/:label',
            component: RowChartViewComponent, outlet: 'right-chart'
        }
    ] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TargetsRoutingModule { }
