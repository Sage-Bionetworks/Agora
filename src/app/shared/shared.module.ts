import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';

import {
    AlertComponent,
    FocusDirective
} from './directives';

import { fakeBackendProvider } from "./helpers";

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
        FormsModule,
        HttpClientModule,
        RouterModule
    ],
    exports: [
        AlertComponent,
        FocusDirective,
        NumbersPipe,
        // Angular modules
        CommonModule,
        FormsModule,
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
                AlertService,

                // providers used to create fake backend
                fakeBackendProvider,
                MockBackend,
                BaseRequestOptions
            ]
        };
    }
}
