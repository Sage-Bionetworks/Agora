import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GenesRoutingModule } from './genes-routing.module';
import { ChartsModule } from '../charts';
import { AppSharedModule } from '../shared';

import { SharedModule } from 'primeng/shared';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';

import { GenesViewComponent } from './genes-view';
import { GenesListComponent } from './genes-list';
import { GeneSearchComponent } from './gene-search';
import { GeneDetailsViewComponent } from './gene-details/gene-details-view';
import { GeneOverviewComponent } from './gene-details/gene-overview';
import { GeneRNASeqDEComponent } from './gene-details/gene-rnaseq-de';

@NgModule({
    declarations: [
        GenesViewComponent,
        GenesListComponent,
        GeneSearchComponent,
        GeneDetailsViewComponent,
        GeneOverviewComponent,
        GeneRNASeqDEComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AppSharedModule.forRoot(),
        GenesRoutingModule,
        ChartsModule,
        // PrimeNG modules
        SharedModule,
        PanelModule,
        ButtonModule,
        TableModule,
        CardModule,
        TabViewModule,
        ProgressBarModule
    ]
})
// Changed the name so it does not conflict with primeng module
export class GenesModule {}
