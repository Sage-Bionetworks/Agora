import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// PrimeNG modules
import { SharedModule } from 'primeng/shared';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenubarModule } from 'primeng/menubar';
import { CheckboxModule } from 'primeng/checkbox';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { DownloadComponent } from './components/download';
import { LoadingComponent } from './components/loading';
import { LoadingPageComponent } from './components/loading-page';

import {
    AlertComponent,
    FocusDirective
} from './directives';

import { AlertService } from './services';

import { NumbersPipe, ArraySortPipe, OrderBy } from './pipes';

@NgModule({
    declarations: [
        AlertComponent,
        DownloadComponent,
        LoadingComponent,
        LoadingPageComponent,
        FocusDirective,
        NumbersPipe,
        ArraySortPipe,
        OrderBy
    ],
    imports: [
        // Angular modules
        CommonModule,
        FormsModule,
        HttpClientModule,
        RouterModule,
        // PrimeNG modules
        SharedModule,
        ButtonModule,
        SplitButtonModule,
        CheckboxModule,
        OverlayPanelModule,
        DialogModule,
        ToastModule,
        MenubarModule,
        PanelModule,
        TableModule,
        TabMenuModule,
        PanelMenuModule,
        ProgressBarModule,
        MultiSelectModule,
        ProgressSpinnerModule
    ],
    exports: [
        // Angular modules
        CommonModule,
        FormsModule,
        HttpClientModule,
        RouterModule,
        // PrimeNG modules
        SharedModule,
        ButtonModule,
        SplitButtonModule,
        CheckboxModule,
        OverlayPanelModule,
        DialogModule,
        ToastModule,
        MenubarModule,
        PanelModule,
        TableModule,
        TabMenuModule,
        PanelMenuModule,
        ProgressBarModule,
        MultiSelectModule,
        ProgressSpinnerModule,
        // Other declarations
        AlertComponent,
        DownloadComponent,
        LoadingComponent,
        LoadingPageComponent,
        FocusDirective,
        NumbersPipe,
        ArraySortPipe,
        OrderBy
    ]
})
// Changed the name so it does not conflict with primeng module
export class AppSharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AppSharedModule,
            providers: [
                AlertService
            ]
        };
    }
}
