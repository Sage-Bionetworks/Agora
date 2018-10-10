import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { GenesRoutingModule } from './genes-routing.module';
import { ChartsModule } from '../charts';
import { AppSharedModule } from '../shared';
import { DialogsModule } from 'app/dialogs';

import { GenesViewComponent } from './genes-view';
import { GenesIntroComponent } from './genes-intro';
import { GenesListComponent } from './genes-list';
import { GeneSearchComponent } from './gene-search';
import { GeneOverviewComponent } from './gene-details/gene-overview';
import { GeneRNASeqDEComponent } from './gene-details/gene-rnaseq-de';
import { GeneNetworkComponent } from './gene-details/gene-network';
import { TeamsPageComponent } from './gene-details/teams-page';
import { GeneBRComponent } from './gene-details/gene-brainregions';
import { GeneSimilarComponent } from './gene-details/gene-similar';
import { BoxPlotsViewComponent } from './gene-details/gene-rnaseq-de/box-plots-view';
import { GeneDruggabilityComponent } from './gene-details/gene-druggability';

import { NgxPageScrollModule } from 'ngx-page-scroll';

@NgModule({
    declarations: [
        GenesViewComponent,
        GenesIntroComponent,
        GenesListComponent,
        GeneSearchComponent,
        GeneOverviewComponent,
        GeneRNASeqDEComponent,
        GeneNetworkComponent,
        TeamsPageComponent,
        GeneBRComponent,
        GeneSimilarComponent,
        BoxPlotsViewComponent,
        GeneDruggabilityComponent
    ],
    imports: [
        NgxPageScrollModule,
        ReactiveFormsModule,
        ChartsModule,
        AppSharedModule,
        DialogsModule,
        GenesRoutingModule
    ],
    entryComponents: [
        BoxPlotsViewComponent
    ]
})
// Changed the name so it does not conflict with primeng module
export class GenesModule {}
