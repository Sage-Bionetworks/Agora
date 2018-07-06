import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe, TitleCasePipe } from '@angular/common';

import { AppSharedModule } from '../shared';
import { CoreRoutingModule } from './core-routing.module';

// PrimeNG modules
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TieredMenuModule } from 'primeng/tieredmenu';

import {
    AuthGuardService,
    AuthenticationService,
    GeneService,
    DataService
} from './services';

import { AboutComponent } from './about';
import { NavbarComponent } from './navbar';
import { MenubarComponent } from './menubar';
import { FooterComponent } from './footer';
import { NoContentComponent } from './no-content';

import '../../styles/styles.scss';
import '../../styles/headings.css';

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        CommonModule,
        CoreRoutingModule,
        // PrimeNG modules
        SplitButtonModule,
        MenuModule,
        MenubarModule,
        TieredMenuModule,
        PanelMenuModule
    ],
    declarations: [
        AboutComponent,
        NavbarComponent,
        MenubarComponent,
        FooterComponent,
        NoContentComponent
    ],
    exports: [
        // Exported components
        AboutComponent,
        NavbarComponent,
        MenubarComponent,
        FooterComponent
    ],
    providers: [
        AuthenticationService,
        AuthGuardService,
        DataService,
        GeneService,
        DecimalPipe,
        TitleCasePipe
    ]
})
export class CoreModule { }
