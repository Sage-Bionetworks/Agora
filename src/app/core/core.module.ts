import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { TargetsModule } from '../targets';
import { ChartsModule } from '../charts';

import { CoreRoutingModule } from './core-routing.module';

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
import { NgSelectModule } from '@ng-select/ng-select';

// Backend modules and extra config
import { environment } from 'environments/environment';
import { AngularFireModule } from 'angularfire2';

export const firebaseConfig = environment.firebaseConfig;
import { AngularFirestoreModule } from 'angularfire2/firestore';

import {
    AuthGuardService,
    AuthenticationService,
    BreadcrumbService,
    ChartService,
    ColorService
} from './services';

import { AboutComponent } from './about';
import { BreadcrumbComponent } from './breadcrumb';
import { DashboardComponent } from './dashboard';
import { NavbarComponent } from './navbar';
import { NoContentComponent } from './no-content';
//import { LoginComponent } from './login/login.component';

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
        NgSelectModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFirestoreModule.enablePersistence(),
        // Feature Modules
        TargetsModule,
        ChartsModule
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
        // Exported components
        BreadcrumbComponent,
        NavbarComponent
    ],
    providers: [
        AuthenticationService,
        AuthGuardService,
        BreadcrumbService,
        ChartService,
        ColorService,
        DecimalPipe
    ]
})
export class CoreModule { }