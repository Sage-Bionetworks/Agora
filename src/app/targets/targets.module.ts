import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TargetsRoutingModule } from './targets-routing.module';
import { ChartsModule } from '../charts';
import { AppSharedModule } from '../shared';

import { SharedModule } from 'primeng/shared';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';

import { TargetsViewComponent } from './targets-view';
import { TargetsListComponent } from './targets-list';
import { GeneSearchComponent } from './gene-search';
import { GeneDetailsViewComponent } from './gene-details/gene-details-view';
import { GeneOverviewComponent } from './gene-details/gene-overview';
import { GeneRNASeqDEComponent } from './gene-details/gene-rnaseq-de';

import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [
        TargetsViewComponent,
        TargetsListComponent,
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
        TargetsRoutingModule,
        ChartsModule,
        // PrimeNG modules
        SharedModule,
        PanelModule,
        ButtonModule,
        TableModule,
        CardModule,
        TabViewModule,
        ProgressBarModule,
        // Other third party modules
        NgSelectModule
    ]
})
// Changed the name so it does not conflict with primeng module
export class TargetsModule {}
