import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ChartsModule } from '../../charts';
import { GeneOverviewRoutingModule } from './gene-overview-routing.module';
import { AppSharedModule } from '../../shared';
import { DialogsModule } from 'app/dialogs';

import { GeneOverviewComponent } from './gene-overview.component';
import { NominationDetailsComponent } from './nom-details';
import { SOEComponent } from './soe';
import { EvidenceMenuComponent } from './evidence-menu';
import { RNAComponent } from './evidence-menu/rna';
import { GeneRNASeqDEComponent } from './evidence-menu/rna/gene-rnaseq-de';
import { BoxPlotsViewComponent } from './evidence-menu/rna/gene-rnaseq-de/box-plots-view';
import { GeneNetworkComponent } from './evidence-menu/rna/gene-network';

@NgModule({
    declarations: [
        GeneOverviewComponent,
        SOEComponent,
        NominationDetailsComponent,
        EvidenceMenuComponent,
        RNAComponent,
        GeneRNASeqDEComponent,
        BoxPlotsViewComponent,
        GeneNetworkComponent
    ],
    imports: [
        ReactiveFormsModule,
        AppSharedModule,
        DialogsModule,
        ChartsModule,
        GeneOverviewRoutingModule
    ],
    entryComponents: [
        BoxPlotsViewComponent
    ]
})
// Changed the name so it does not conflict with primeng module
export class GeneOverviewModule {}
