import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TargetsRoutingModule } from './targets-routing.module';
import { ChartsModule } from '../charts';
import { AppSharedModule } from '../shared';

import {
    SharedModule,
    PanelModule,
    ButtonModule,
    GrowlModule,
    CardModule,
    TooltipModule,
    TabViewModule,
    FieldsetModule
} from 'primeng/primeng';

import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';

import { TableModule } from 'primeng/table';

import { TargetsViewComponent } from './targets-view';
import { TargetsListComponent } from './targets-list';
import { GeneSearchComponent } from './gene-search';
import { GeneDetailsViewComponent } from './gene-details/gene-details-view';
import { GeneOverviewComponent } from './gene-details/gene-overview';
import { GeneODDIDrugabilityComponent } from './gene-details/gene-oddi-druggability';
import { GeneLillyDrugEBIlityComponent } from './gene-details/gene-lilly-drugebility';
import { GeneRNASeqDEComponent } from './gene-details/gene-rnaseq-de';
import { GeneNominationViewComponent } from './gene-details/gene-nomination-view';
import { GeneNominationVideoComponent } from './gene-details/gene-nomination-view/gene-nomination-video';

import { GeneService } from './services';

import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [
        TargetsViewComponent,
        TargetsListComponent,
        GeneSearchComponent,
        GeneDetailsViewComponent,
        GeneOverviewComponent,
        GeneODDIDrugabilityComponent,
        GeneLillyDrugEBIlityComponent,
        GeneRNASeqDEComponent,
        GeneNominationViewComponent,
        GeneNominationVideoComponent
    ],
    imports: [
        CommonModule,
        AppSharedModule.forRoot(),
        TargetsRoutingModule,
        ChartsModule,
        // Videogular2 modules
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule,
        // PrimeNG modules
        SharedModule,
        PanelModule,
        ButtonModule,
        GrowlModule,
        TableModule,
        CardModule,
        TooltipModule,
        TabViewModule,
        FieldsetModule,
        // Other third party modules
        NgSelectModule
    ],
    providers: [
        GeneService
    ]
})
// Changed the name so it does not conflict with primeng module
export class TargetsModule {}
