import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// PrimeNG modules
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { OverlayPanelModule } from 'primeng/overlaypanel';

import { DownloadComponent } from './components/download';

import {
    AlertComponent,
    FocusDirective
} from './directives';

import { AlertService, ForceService } from './services';

import { NumbersPipe, MyArraySortPipe } from './pipes';

@NgModule({
    declarations: [
        AlertComponent,
        DownloadComponent,
        FocusDirective,
        NumbersPipe,
        MyArraySortPipe
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
        OverlayPanelModule
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
        FocusDirective,
        NumbersPipe,
        MyArraySortPipe
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
