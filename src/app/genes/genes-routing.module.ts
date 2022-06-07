import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenesViewComponent } from './genes-view';
import { GenesIntroComponent } from './genes-intro';
import { GenesListComponent } from './genes-list';
import { GeneComparisonToolComponent } from './gene-comparison-tool';
import { GeneSimilarComponent } from './gene-similar';
import { NominatedFormComponent } from './nominated-form';

import { SOEComponent } from './gene-overview/soe';
import { NominationDetailsComponent } from './gene-overview/nom-details';
import { EvidenceMenuComponent } from './gene-overview/evidence-menu';
import { RNAComponent } from './gene-overview/evidence-menu/rna';
import { ProteomicsComponent } from './gene-overview/evidence-menu/proteomics';
import { MetabolomicsComponent } from './gene-overview/evidence-menu/metabolomics';
import { GeneDruggabilityComponent } from './gene-overview/gene-druggability';
import { ExpValidationComponent } from './gene-overview/exp-validation';

export const routes: Routes = [
    { path: 'genes', component: GenesViewComponent, children: [
        { path: '', component: GenesIntroComponent, outlet: 'genes-router' },
        { path: 'genes-intro', component: GenesIntroComponent, outlet: 'genes-router' },
        { path: 'genes-list', component: GenesListComponent, outlet: 'genes-router' },
        { path: 'gene-comparison-tool', component: GeneComparisonToolComponent, outlet: 'genes-router' },
        { path: 'gene-similar/:id', component: GeneSimilarComponent, outlet: 'genes-router' },
        { path: 'nominated-form', component: NominatedFormComponent, outlet: 'genes-router'},
        {
            path: 'gene-details/:id',
            outlet: 'genes-router',
            loadChildren: './gene-overview/gene-overview.module#GeneOverviewModule'
        },
        { path: 'soe', component: SOEComponent, outlet: 'gene-overview' },
        { path: 'nom-details', component: NominationDetailsComponent, outlet: 'gene-overview' },
        { path: 'evidence', component: EvidenceMenuComponent, outlet: 'evidence-menu' },
        { path: 'rna', component: RNAComponent, outlet: 'gene-overview' },
        { path: 'proteomics', component: ProteomicsComponent, outlet: 'gene-overview' },
        { path: 'metabolomics', component: MetabolomicsComponent, outlet: 'gene-overview' },
        { path: 'druggability', component: GeneDruggabilityComponent, outlet: 'gene-overview'},
        { path: 'exp-validation', component: ExpValidationComponent, outlet: 'gene-overview'}

    ] },
    { path: '', redirectTo: 'genes', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GenesRoutingModule { }
