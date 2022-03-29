import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { GenesRoutingModule } from './genes-routing.module';
import { AppSharedModule } from '../shared';
import { DialogsModule } from 'app/dialogs';

import { GenesViewComponent } from './genes-view';
import { GenesIntroComponent } from './genes-intro';
import { GenesListComponent } from './genes-list';
import {
    GeneComparisonToolFilterPanelComponent,
    GeneComparisonToolFilterListComponent,
    GeneComparisonToolDetailsPanelComponent,
    GeneComparisonToolComponent
} from './gene-comparison-tool';
import { NominatedFormComponent } from './nominated-form';
import { GeneSearchComponent } from './gene-search';
import { GeneOverviewModule } from './gene-overview';
import { GeneBRComponent } from './gene-brainregions';
import { GeneSimilarComponent } from './gene-similar';

@NgModule({
    declarations: [
        GenesViewComponent,
        GenesIntroComponent,
        GenesListComponent,
        GeneComparisonToolFilterPanelComponent,
        GeneComparisonToolFilterListComponent,
        GeneComparisonToolDetailsPanelComponent,
        GeneComparisonToolComponent,
        NominatedFormComponent,
        GeneSearchComponent,
        GeneBRComponent,
        GeneSimilarComponent
    ],
    imports: [
        ReactiveFormsModule,
        AppSharedModule,
        DialogsModule,
        GenesRoutingModule,
        GeneOverviewModule
    ]
})
// Changed the name so it does not conflict with primeng module
export class GenesModule {}
