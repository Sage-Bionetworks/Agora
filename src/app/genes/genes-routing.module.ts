import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenesViewComponent } from './genes-view';
import { GenesIntroComponent } from './genes-intro';
import { GenesListComponent } from './genes-list';
import { GeneOverviewComponent } from './gene-details/gene-overview';
import { GeneRNASeqDEComponent } from './gene-details/gene-rnaseq-de';
import { GeneNetworkComponent } from './gene-details/gene-network';
import { ScatterPlotViewComponent } from '../charts/scatter-plot/scatter-plot-view';
import { RowChartViewComponent } from '../charts/row-chart/row-chart-view';


const routes: Routes = [
    { path: 'genes', component: GenesViewComponent, children: [
        { path: '', component: GenesIntroComponent, outlet: 'genes-router' },
        { path: 'genes-intro', component: GenesIntroComponent, outlet: 'genes-router' },
        { path: 'genes-list', component: GenesListComponent, outlet: 'genes-router' },
        { path: 'gene-details/:id', component: GeneOverviewComponent, outlet: 'genes-router' },
        { path: 'gene-rna-seq/:id', component: GeneRNASeqDEComponent, outlet: 'genes-router' },
        { path: 'gene-coexp-network/:id', component: GeneNetworkComponent, outlet: 'genes-router' }
    ] },
    { path: '**', redirectTo: 'genes', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GenesRoutingModule { }
