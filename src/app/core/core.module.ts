import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
//import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import {
    AuthGuardService,
    AuthenticationService,
    BreadcrumbService
} from './services';

import { AboutComponent } from './about';
import { BreadcrumbComponent } from './breadcrumb';
import { DashboardComponent } from './dashboard';
import { NavbarComponent } from './navbar';
import { NoContentComponent } from './no-content';

// PrimeNG modules
import {
    SplitButtonModule,
    MenuModule,
    MenubarModule,
    BreadcrumbModule,
    PanelModule,
    DataTableModule,
    ButtonModule,
    DataGridModule,
    SharedModule,
    GrowlModule,
    TabViewModule
} from 'primeng/primeng';

import {
    TableModule
} from 'primeng/table';

// Other third-party modules
import { PapaParseModule } from 'ngx-papaparse';

import '../../styles/styles.scss';
import '../../styles/headings.css';

@NgModule({
    imports: [
        CommonModule,
        CoreRoutingModule,
        // PrimeNG modules
        SplitButtonModule,
        MenuModule,
        MenubarModule,
        BreadcrumbModule,
        PanelModule,
        DataTableModule,
        ButtonModule,
        DataGridModule,
        SharedModule,
        GrowlModule,
        TabViewModule,
        TableModule,
        // Other third-party modules
        PapaParseModule
    ],
    declarations: [
        //LoginComponent,
        //HeaderComponent,
        //NotFoundComponent,
        AboutComponent,
        BreadcrumbComponent,
        DashboardComponent,
        NavbarComponent,
        NoContentComponent
    ],
    exports: [
        RouterModule,
        // PrimeNG modules
        SplitButtonModule,
        MenuModule,
        MenubarModule,
        BreadcrumbModule,
        PanelModule,
        DataTableModule,
        ButtonModule,
        DataGridModule,
        SharedModule,
        GrowlModule,
        TabViewModule,
        TableModule,
        // Other third-party modules
        PapaParseModule,
        // Exported components
        BreadcrumbComponent,
        NavbarComponent
    ],
    providers: [
        AuthenticationService,
        AuthGuardService,
        BreadcrumbService
    ]
})
export class CoreModule { }