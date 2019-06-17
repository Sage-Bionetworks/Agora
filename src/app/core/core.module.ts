import { NgModule, Optional, SkipSelf } from '@angular/core';
import { DecimalPipe, TitleCasePipe } from '@angular/common';

import { AppSharedModule } from '../shared';
import { CoreRoutingModule } from './core-routing.module';

import {
    ApiService,
    AuthGuardService,
    AuthenticationService,
    GeneService,
    DataService,
    ForceService,
    NavigationService,
    MenuService
} from './services';

import { AboutComponent } from './about';
import { NewsComponent } from './news';
import { HelpComponent } from './help';
import { TermsComponent } from './terms';
import { SynapseAccountComponent } from './synapse-account';
import { NavbarComponent } from './navbar';
import { MenubarComponent } from './menubar';
import { FooterComponent } from './footer';
import { NoContentComponent } from './no-content';
import { ContribTeamsPageComponent } from './contrib-teams';

import '../../styles/styles.scss';
import '../../styles/headings.scss';

@NgModule({
    imports: [
        // Shared and route modules
        AppSharedModule,
        CoreRoutingModule
    ],
    declarations: [
        NavbarComponent,
        MenubarComponent,
        FooterComponent,
        NoContentComponent,
        AboutComponent,
        NewsComponent,
        HelpComponent,
        TermsComponent,
        ContribTeamsPageComponent,
        SynapseAccountComponent
    ],
    exports: [
        // Exported components
        NavbarComponent,
        MenubarComponent,
        FooterComponent,
        NoContentComponent,
        AboutComponent,
        HelpComponent,
        TermsComponent,
        ContribTeamsPageComponent,
        SynapseAccountComponent
    ],
    providers: [
        ApiService,
        AuthenticationService,
        AuthGuardService,
        DataService,
        GeneService,
        ForceService,
        NavigationService,
        MenuService,
        DecimalPipe,
        TitleCasePipe
    ]
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() core: CoreModule) {
        if (core) {
            throw new Error('Attempt to import CoreModule more than once!');
        }
    }
}
