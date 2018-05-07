import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenesViewComponent } from './genes-view';
import { GenesIntroComponent } from './genes-intro';
import { GenesListComponent } from './genes-list';
import { GeneDetailsViewComponent } from './gene-details/gene-details-view';
import { ScatterPlotViewComponent } from '../charts/scatter-plot/scatter-plot-view';
import { RowChartViewComponent } from '../charts/row-chart/row-chart-view';

const routes: Routes = [
    { path: 'genes', component: GenesViewComponent, children: [
        { path: '', component: GenesIntroComponent, outlet: 'genes-router' },
        { path: 'genes-intro', component: GenesIntroComponent, outlet: 'genes-router' },
        { path: 'genes-list', component: GenesListComponent, outlet: 'genes-router' },
        { path: 'gene-details/:id', component: GeneDetailsViewComponent, outlet: 'genes-router' }
    ] },
    { path: '**', redirectTo: 'genes', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GenesRoutingModule { }
