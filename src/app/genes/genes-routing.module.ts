import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenesViewComponent } from './genes-view';
import { GenesIntroComponent } from './genes-intro';
import { GenesListComponent } from './genes-list';
import { GeneOverviewComponent } from './gene-details/gene-overview';
import { GeneRNASeqDEComponent } from './gene-details/gene-rnaseq-de';
import { GeneNetworkComponent } from './gene-details/gene-network';
import { TeamsPageComponent } from './gene-details/teams-page';
import { GeneBRComponent } from './gene-details/gene-brainregions';
import { GeneSimilarComponent } from './gene-details/gene-similar';

export const routes: Routes = [
    { path: 'genes', component: GenesViewComponent, children: [
        { path: '', component: GenesIntroComponent, outlet: 'genes-router' },
        { path: 'genes-intro', component: GenesIntroComponent, outlet: 'genes-router' },
        { path: 'genes-list', component: GenesListComponent, outlet: 'genes-router' },
        { path: 'gene-details/:id', component: GeneOverviewComponent, outlet: 'genes-router' },
        { path: 'gene-rna-seq/:id', component: GeneRNASeqDEComponent, outlet: 'genes-router' },
        { path: 'gene-coexp-network/:id', component: GeneNetworkComponent, outlet: 'genes-router' },
        { path: 'teams-page/:id', component: TeamsPageComponent, outlet: 'genes-router' },
        { path: 'gene-similar/:id', component: GeneSimilarComponent, outlet: 'genes-router' },
        { path: 'gene-brainregions/:id', component: GeneBRComponent, outlet: 'genes-router' }
    ] },
    { path: '', redirectTo: 'genes', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GenesRoutingModule { }
