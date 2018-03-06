import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TargetsViewComponent } from './targets-view';
import { GeneDetailsViewComponent } from './gene-details/gene-details-view';
import { ScatterPlotViewComponent } from '../charts/scatter-plot/scatter-plot-view';

const routes: Routes = [
    { path: '', component: TargetsViewComponent },
    { path: 'gene-details/:id', component: GeneDetailsViewComponent, children: [
        { path: 'scatter-plot', component: ScatterPlotViewComponent, outlet: 'chart' }
    ] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TargetsRoutingModule { }
