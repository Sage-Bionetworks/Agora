// Angular modules
import { NgModule } from '@angular/core';
import { BrowserModule, HammerGestureConfig } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

// Our other developed modules
import { AppSharedModule } from './shared';
import { CoreModule } from './core';

// Third-party modules
import { NgxWebstorageModule } from 'ngx-webstorage';

// Platform and Environment providers
import { environment } from 'environments/environment';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';

// Sub-components
import { AppComponent } from './app.component';

// State related imports
import { AppState, InternalStateType } from './app.service';

import { CookieService } from 'ngx-cookie-service';

// Application wide providers
const APP_PROVIDERS = [
    ...APP_RESOLVER_PROVIDERS,
    AppState
];

interface StoreType {
    state: InternalStateType;
    restoreInputValues: () => void;
    disposeOldHosts: () => void;
}

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule,
        AppSharedModule.forRoot(),
        NgxWebstorageModule.forRoot(),
        CoreModule
    ],
    /**
     * Expose our Services and Providers into Angular's dependency injection.
     */
    providers: [
        environment.ENV_PROVIDERS,
        APP_PROVIDERS,
        HammerGestureConfig,
        CookieService
    ]
})
export class AppModule {}
