import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';

import {
    AlertComponent,
    FocusDirective
} from './_directives';

import {
    fakeBackendProvider
} from "./_helpers";

import {
    AlertService,
    AuthenticationService,
    BreadcrumbService,
    GeneService
} from './_services';

import {
    // PrimeNG modules
    SplitButtonModule,
    MenuModule,
    MenubarModule,
    ToolbarModule,
    BreadcrumbModule,
    PanelModule,
    FieldsetModule,
    InputMaskModule,
    MessagesModule,
    DataTableModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    InputTextareaModule,
    FileUploadModule,
    DataGridModule,
    OverlayPanelModule,
    DataScrollerModule,
    SharedModule,
    StepsModule,
    GalleriaModule,
    GrowlModule,
    TabViewModule,
    CodeHighlighterModule,
    SelectButtonModule,
    PickListModule,
    LightboxModule,
    SlideMenuModule
} from 'primeng/primeng';

import {
    TableModule
} from 'primeng/table';

import '../../styles/styles.scss';
import '../../styles/headings.css';

@NgModule({
    declarations: [
        AlertComponent,
        FocusDirective
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        // PrimeNG modules
        SplitButtonModule,
        MenuModule,
        MenubarModule,
        ToolbarModule,
        BreadcrumbModule,
        PanelModule,
        FieldsetModule,
        InputMaskModule,
        MessagesModule,
        DataTableModule,
        DialogModule,
        InputTextModule,
        ButtonModule,
        InputTextareaModule,
        FileUploadModule,
        DataGridModule,
        OverlayPanelModule,
        DataScrollerModule,
        SharedModule,
        StepsModule,
        GalleriaModule,
        GrowlModule,
        TabViewModule,
        CodeHighlighterModule,
        SelectButtonModule,
        PickListModule,
        LightboxModule,
        SlideMenuModule,
        TableModule
    ],
    exports: [
        AlertComponent,
        // PrimeNG modules
        SplitButtonModule,
        MenuModule,
        MenubarModule,
        ToolbarModule,
        BreadcrumbModule,
        PanelModule,
        FieldsetModule,
        InputMaskModule,
        MessagesModule,
        DataTableModule,
        DialogModule,
        InputTextModule,
        ButtonModule,
        InputTextareaModule,
        FileUploadModule,
        DataGridModule,
        OverlayPanelModule,
        DataScrollerModule,
        SharedModule,
        StepsModule,
        GalleriaModule,
        GrowlModule,
        TabViewModule,
        CodeHighlighterModule,
        SelectButtonModule,
        PickListModule,
        LightboxModule,
        SlideMenuModule,
        TableModule
    ]
})
// Changed the name so it does not conflict with primeng module
export class AppSharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AppSharedModule,
            providers: [
                AlertService,
                AuthenticationService,
                BreadcrumbService,

                // providers used to create fake backend
                fakeBackendProvider,
                MockBackend,
                BaseRequestOptions,
                GeneService
            ]
        };
    }
}
