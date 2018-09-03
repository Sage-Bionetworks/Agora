import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// PrimeNG modules
import { ButtonModule } from 'primeng/button';
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

import { AlertService, ForceService } from './services';

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
        ButtonModule,
        CheckboxModule,
        OverlayPanelModule,
        DialogModule,
        ToastModule
    ],
    exports: [
        // Angular modules
        CommonModule,
        FormsModule,
        HttpClientModule,
        RouterModule,
        // PrimeNG modules
        CheckboxModule,
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
                AlertService,
                ForceService
            ]
        };
    }
}
