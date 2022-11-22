import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  AboutPageComponent,
  HomePageComponent,
  NewsPageComponent,
  NominationFormPageComponent,
  PageNotFoundComponent,
  TeamsPageComponent,
} from './core/pages/';

import {
  GeneDetailsComponent,
  GeneComparisonToolComponent,
  GeneNominatedTargetsComponent,
  GeneSimilarComponent,
} from './features/genes/components';

export const routes: Routes = [
  { 
    path: '', component: HomePageComponent,
    data: {
      title: 'Agora | Explore Alzheimer\'s Disease Genes',
      description: 'Explore transcriptomic, proteomic, and metabolomic evidence for whether or not genes are associated with Alzheimer\'s disease using the Agora portal.'
    }
  },

  { 
    path: 'genes/comparison', component: GeneComparisonToolComponent,
    data: {
      title: 'Gene Comparison | Visual comparison tool for AD genes',
      description: 'Explore high-dimensional omics data with our visual gene comparison tool, then build, share, and download visualizations for your own custom gene lists.'
    }
  },
  { 
    path: 'genes/nominated-targets', component: GeneNominatedTargetsComponent,
    data: {
      title: 'Nominated Targets | Candidate genes for AD treatment or prevention',
      description: 'Browse a list of genes that researchers have identified using computational analyses of high-dimensional human genomic, proteomic and metabolomic data.'
    }
  },
  { path: 'genes/genes-router:genes-list', redirectTo: 'genes/nominated-targets', pathMatch: 'full' },
  { path: 'genes/genes-router:gene-details/:id', redirectTo: 'genes/:id', pathMatch: 'full' },
  { path: 'genes/:id/similar', component: GeneSimilarComponent },
  { path: 'genes/:id/:tab/:subtab', component: GeneDetailsComponent },
  { path: 'genes/:id/:tab', component: GeneDetailsComponent },
  { 
    path: 'genes/:id', component: GeneDetailsComponent,
    data: {
      title: 'Agora | Gene Details',
      description: 'View information and evidence about genes in Alzheimer\'s disease'
    }
  },
  { 
    path: 'genes', component: HomePageComponent,
    data: {
      title: 'Agora | Explore Alzheimer\'s Disease Genes',
      description: 'Explore transcriptomic, proteomic, and metabolomic evidence for whether or not genes are associated with Alzheimer\'s disease using the Agora portal.'
    }
  },
  { 
    path: 'about', component: AboutPageComponent,
    data: {
      title: 'About Agora',
      description: 'Agora is funded by the National Institute on Aging, and is developed and maintained by Sage Bionetworks.'
    }
  },
  { 
    path: 'news', component: NewsPageComponent,
    data: {
      title: 'News | Agora Releases',
      description: 'See what\'s new in Agora, from new features to our latest data updates.'
    }
  },
  { 
    path: 'teams', component: TeamsPageComponent,
    data: {
      title: 'Contributing Teams',
      description: 'Find information about the NIA-funded and community research teams that have contributed evidence to Agora.'
    } 
  },
  { 
    path: 'nomination-form', component: NominationFormPageComponent,
    data: {
      title: 'Nominate a Target | Suggest a new AD therapeutic target',
      description: 'Nominate a gene as a new candidate for AD treatment or prevention'
    }
  },
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
