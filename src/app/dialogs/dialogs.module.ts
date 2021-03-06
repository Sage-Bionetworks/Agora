import { NgModule } from '@angular/core';

import { AppSharedModule } from '../shared';

import { BPDialogComponent } from './bp-dialog';
import { BRDialogComponent } from './br-dialog';
import { DRUggabilityComponent } from './dg-dialog';
import { MEDialogComponent } from './me-dialog';
import { PTDialogComponent } from './pt-dialog';
import { MTDialogComponent } from './mt-dialog';
import { SOEDialogComponent } from './soe-dialog';
import { SGDialogComponent } from './sg-dialog';
import { MoreInfoComponent } from './more-info';
import { NOMinatedTargetComponent } from './nt-dialog';
import { BRAinRegionNetworkComponent } from './brn-dialog';
import { SimilarGenesNetworkComponent } from './sgn-dialog';
import { RNADialogComponent } from './rna-dialog';
import { SIMilarPageDialogComponent } from './sp-dialog';
import { CCDialogComponent } from './cc-dialog';

import { DialogsService } from './services';

@NgModule({
    imports: [
        // Shared and route modules
        AppSharedModule
    ],
    declarations: [
        MoreInfoComponent,
        BPDialogComponent,
        BRDialogComponent,
        MEDialogComponent,
        PTDialogComponent,
        MTDialogComponent,
        SGDialogComponent,
        SOEDialogComponent,
        DRUggabilityComponent,
        NOMinatedTargetComponent,
        BRAinRegionNetworkComponent,
        SimilarGenesNetworkComponent,
        RNADialogComponent,
        SIMilarPageDialogComponent,
        CCDialogComponent
    ],
    exports: [
        MoreInfoComponent,
        BPDialogComponent,
        BRDialogComponent,
        MEDialogComponent,
        PTDialogComponent,
        MTDialogComponent,
        SGDialogComponent,
        SOEDialogComponent,
        DRUggabilityComponent,
        NOMinatedTargetComponent,
        BRAinRegionNetworkComponent,
        SimilarGenesNetworkComponent,
        RNADialogComponent,
        SIMilarPageDialogComponent,
        CCDialogComponent
    ],
    providers: [
        DialogsService
    ]
})
// Changed the name so it does not conflict with primeng module
export class DialogsModule {}
