// Angular modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Our other developed modules
import { CoreModule } from './core';
import { TargetsModule } from './targets';

// Platform and Environment providers
import { environment } from 'environments/environment';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';

// Sub-components
import { AppComponent }  from './app.component';

// State related imports
import { AppState, InternalStateType } from './app.service';

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
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CoreModule
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
