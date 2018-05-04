import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import {
    AlertComponent,
    FocusDirective
} from './directives';

import { fakeBackendProvider } from './helpers';

import { AlertService } from './services';

import { NumbersPipe } from './pipes';

@NgModule({
    declarations: [
        AlertComponent,
        FocusDirective,
        NumbersPipe
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule
    ],
    exports: [
        AlertComponent,
        FocusDirective,
        NumbersPipe,
        // Angular modules
        CommonModule,
        HttpClientModule,
        RouterModule
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
