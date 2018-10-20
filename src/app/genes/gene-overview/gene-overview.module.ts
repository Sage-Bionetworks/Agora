import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { GeneOverviewRoutingModule } from './gene-overview-routing.module';
import { AppSharedModule } from '../../shared';
import { DialogsModule } from 'app/dialogs';

import { GeneOverviewComponent } from './gene-overview.component';
import { NominationDetailsComponent } from './nom-details';
import { SOEComponent } from './soe';

@NgModule({
    declarations: [
        GeneOverviewComponent,
        SOEComponent,
        NominationDetailsComponent
    ],
    imports: [
        ReactiveFormsModule,
        AppSharedModule,
        DialogsModule,
        GeneOverviewRoutingModule
    ]
})
// Changed the name so it does not conflict with primeng module
export class GeneOverviewModule {}
