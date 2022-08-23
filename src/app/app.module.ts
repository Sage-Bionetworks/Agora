// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import {
  NgxGoogleAnalyticsModule,
  NgxGoogleAnalyticsRouterModule,
} from 'ngx-google-analytics';
import { APP_BASE_HREF } from '@angular/common';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { environment } from '../environments/environment';
import { SharedModule } from './shared';
import { CoreModule } from './core';
import { GenesModule } from './features/genes';
import { ChartsModule } from './features/charts';
import { TeamsModule } from './features/teams';
import { AppRoutingModule } from './app.routing';

// -------------------------------------------------------------------------- //
// Components
// -------------------------------------------------------------------------- //
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    // External
    BrowserModule,
    BrowserAnimationsModule,

    // Internal
    SharedModule,
    CoreModule,
    GenesModule,
    ChartsModule,
    TeamsModule,

    // Rounting
    AppRoutingModule,

    NgxGoogleAnalyticsModule.forRoot(environment.ga),
    NgxGoogleAnalyticsRouterModule,
  ],
  providers: [CookieService, { provide: APP_BASE_HREF, useValue: '/' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
