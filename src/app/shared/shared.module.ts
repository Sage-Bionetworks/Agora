import { NgModule, ModuleWithProviders, InjectionToken, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// PrimeNG modules

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
import { AccordionModule } from 'primeng/accordion';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ContextMenuModule } from 'primeng/contextmenu';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';

import { MessageService } from 'primeng/api';

import { DownloadComponent } from './components/download';
import { LoadingComponent } from './components/loading';
import { LoadingPageComponent } from './components/loading-page';
import { HttpErrorInterceptor } from './http-error';
import { WikiComponent } from './components/wiki/wiki.component';
import { PlotlyWrapperComponent } from './components/plotly-wrapper/plotly-wrapper.component';

import {
    AlertComponent,
    FocusDirective
} from './directives';

import { AlertService, ErrorHandlerService, PlotHelperService } from './services';

import { NumbersPipe, ArraySortPipe, OrderBy } from './pipes';

import * as Rollbar from 'rollbar';
import { RadioButtonModule } from 'primeng';

const rollbarConfig = {
    accessToken: 'e788198867474855a996485580b08d03',
    captureUncaught: true,
    captureUnhandledRejections: true
};

export function rollbarFactory() {
    return new Rollbar(rollbarConfig);
}

export const RollbarService = new InjectionToken<Rollbar>('rollbar');

@NgModule({
    declarations: [
        AlertComponent,
        DownloadComponent,
        LoadingComponent,
        LoadingPageComponent,
        FocusDirective,
        NumbersPipe,
        ArraySortPipe,
        OrderBy,
        WikiComponent,
        PlotlyWrapperComponent,
    ],
    imports: [
        // Angular modules
        CommonModule,
        FormsModule,
        HttpClientModule,
        RouterModule,
        // PrimeNG modules

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
        AccordionModule,
        ContextMenuModule,
        InputTextModule,
        DropdownModule,
        MenuModule,
        TooltipModule,
        ContextMenuModule,
        RadioButtonModule
    ],
    exports: [
        // Angular modules
        CommonModule,
        FormsModule,
        HttpClientModule,
        RouterModule,
        // PrimeNG modules
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
        AccordionModule,
        ContextMenuModule,
        InputTextModule,
        DropdownModule,
        MenuModule,
        TooltipModule,
        ContextMenuModule,
        // Other declarations
        AlertComponent,
        DownloadComponent,
        LoadingComponent,
        LoadingPageComponent,
        FocusDirective,
        NumbersPipe,
        ArraySortPipe,
        OrderBy,
        WikiComponent,
        PlotlyWrapperComponent,
    ]
})
// Changed the name so it does not conflict with primeng module
export class AppSharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AppSharedModule,
            providers: [
                AlertService,
                MessageService,
                PlotHelperService,
                {
                    provide: RollbarService,
                    useFactory: rollbarFactory
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: HttpErrorInterceptor,
                    multi: true
                },
                {
                    provide: ErrorHandler,
                    useClass: ErrorHandlerService,
                }
            ]
        };
    }
}
