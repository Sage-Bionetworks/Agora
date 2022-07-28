import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  AboutPageComponent,
  HomePageComponent,
  NewsPageComponent,
  NominationFormPageComponent,
  PageNotFoundComponent,
} from './features/pages/components';

import {
  GeneDetailsComponent,
  GeneComparisonToolComponent,
  GeneNominatedTargetsComponent,
  GeneSimilarComponent,
} from './features/genes/components';

import { TeamsPageComponent } from './features/teams/components';

const routes: Routes = [
  { path: '', component: HomePageComponent },

  { path: 'genes/comparison', component: GeneComparisonToolComponent },
  { path: 'genes/nominated-targets', component: GeneNominatedTargetsComponent },
  { path: 'genes/:id/similar', component: GeneSimilarComponent },
  { path: 'genes/:id/:tab/:subtab', component: GeneDetailsComponent },
  { path: 'genes/:id/:tab', component: GeneDetailsComponent },
  { path: 'genes/:id', component: GeneDetailsComponent },
  { path: 'genes', component: HomePageComponent },

  { path: 'about', component: AboutPageComponent },
  { path: 'news', component: NewsPageComponent },
  { path: 'teams', component: TeamsPageComponent },
  { path: 'nomination-form', component: NominationFormPageComponent },

  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
