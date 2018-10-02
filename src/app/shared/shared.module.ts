import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// PrimeNG modules
import { SharedModule } from 'primeng/shared';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { BlockUIModule } from 'primeng/blockui';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { CheckboxModule } from 'primeng/checkbox';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

import { DownloadComponent } from './components/download';
import { LoadingComponent } from './components/loading';

import {
    AlertComponent,
    FocusDirective
} from './directives';

import { AlertService } from './services';

import { NumbersPipe, ArraySortPipe } from './pipes';

@NgModule({
    declarations: [
        AlertComponent,
        DownloadComponent,
        LoadingComponent,
        FocusDirective,
        NumbersPipe,
        ArraySortPipe
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
        CheckboxModule,
        OverlayPanelModule,
        DialogModule,
        ToastModule,
        SplitButtonModule,
        MenuModule,
        MenubarModule,
        TieredMenuModule,
        PanelMenuModule,
        CheckboxModule,
        PanelModule,
        TableModule,
        DialogModule,
        CardModule,
        TabViewModule,
        ProgressBarModule,
        MultiSelectModule,
        BlockUIModule
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
        CheckboxModule,
        OverlayPanelModule,
        DialogModule,
        ToastModule,
        SplitButtonModule,
        MenuModule,
        MenubarModule,
        TieredMenuModule,
        PanelMenuModule,
        CheckboxModule,
        PanelModule,
        TableModule,
        DialogModule,
        CardModule,
        TabViewModule,
        ProgressBarModule,
        MultiSelectModule,
        BlockUIModule,
        // Other declarations
        AlertComponent,
        DownloadComponent,
        LoadingComponent,
        FocusDirective,
        NumbersPipe,
        ArraySortPipe
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
