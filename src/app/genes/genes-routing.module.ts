import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenesViewComponent } from './genes-view';
import { GenesIntroComponent } from './genes-intro';
import { GenesListComponent } from './genes-list';
import { GeneRNASeqDEComponent } from './gene-rnaseq-de';
import { GeneNetworkComponent } from './gene-network';
import { GeneBRComponent } from './gene-brainregions';
import { GeneSimilarComponent } from './gene-similar';
import { NominatedFormComponent } from './nominated-form';

import { SOEComponent } from './gene-overview/soe';
import { NominationDetailsComponent } from './gene-overview/nom-details';

export const routes: Routes = [
    { path: 'genes', component: GenesViewComponent, children: [
        { path: '', component: GenesIntroComponent, outlet: 'genes-router' },
        { path: 'genes-intro', component: GenesIntroComponent, outlet: 'genes-router' },
        { path: 'genes-list', component: GenesListComponent, outlet: 'genes-router' },
        { path: 'gene-rna-seq/:id', component: GeneRNASeqDEComponent, outlet: 'genes-router' },
        { path: 'gene-coexp-network/:id', component: GeneNetworkComponent, outlet: 'genes-router' },
        { path: 'gene-similar/:id', component: GeneSimilarComponent, outlet: 'genes-router' },
        { path: 'gene-brainregions/:id', component: GeneBRComponent, outlet: 'genes-router' },
        { path: 'nominated-form', component: NominatedFormComponent, outlet: 'genes-router'},
        { path: 'gene-details/:id', outlet: 'genes-router', loadChildren:
            './gene-overview/gene-overview.module#GeneOverviewModule'
        },
        { path: 'soe', component: SOEComponent, outlet: 'gene-overview' },
        { path: 'nom-details', component: NominationDetailsComponent, outlet: 'gene-overview' }
    ] },
    { path: '', redirectTo: 'genes', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GenesRoutingModule { }
