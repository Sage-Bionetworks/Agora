// Angular modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Our shared module, PrimeNG uses the SharedModule name
import { AppSharedModule } from './shared';
import { AppState, InternalStateType } from './app.service';

// Our other developed modules
import { TargetsModule } from './targets';

// Platform and Environment providers
import { environment } from 'environments/environment';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';

// Sub-components
import { AppComponent }  from './app.component';
import { AboutComponent } from './about';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { DashboardComponent } from './dashboard';
import { NavbarComponent } from './navbar/navbar.component';
import { NoContentComponent } from './no-content';

// Routes
import { ROUTES } from './app.routes';

// Application wide providers
const APP_PROVIDERS = [
    ...APP_RESOLVER_PROVIDERS,
    AppState
];

type StoreType = {
    state: InternalStateType,
    restoreInputValues: () => void,
    disposeOldHosts: () => void
};

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        AboutComponent,
        BreadcrumbComponent,
        DashboardComponent,
        NavbarComponent,
        NoContentComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,

        // Our shared module
        AppSharedModule.forRoot(),
        TargetsModule,
        // Other third party modules
        // Route module
        RouterModule.forRoot(ROUTES, {
            useHash: Boolean(history.pushState) === false,
            preloadingStrategy: PreloadAllModules
        })
    ],
    /**
     * Expose our Services and Providers into Angular's dependency injection.
     */
    providers: [
        environment.ENV_PROVIDERS,
        APP_PROVIDERS
    ]
})
export class AppModule {}
