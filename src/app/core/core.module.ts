// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { NgModule, ErrorHandler } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// -------------------------------------------------------------------------- //
// Modules
// -------------------------------------------------------------------------- //
import { SharedModule } from '../shared';
import { GenesModule } from '../features/genes';
import { TeamsModule } from '../features/teams';

// -------------------------------------------------------------------------- //
// Services
// -------------------------------------------------------------------------- //
import {
  ApiService,
  ErrorService,
  HelperService,
  RollbarService,
  rollbarFactory,
  SynapseApiService,
} from './services';

// -------------------------------------------------------------------------- //
// Interceptors
// -------------------------------------------------------------------------- //
import { ApiInterceptor, HttpErrorInterceptor } from './interceptors';

// -------------------------------------------------------------------------- //
// Components
// -------------------------------------------------------------------------- //
import { HeaderComponent, FooterComponent } from './components';

import {
  AboutPageComponent,
  HomePageComponent,
  NewsPageComponent,
  NominationFormPageComponent,
  PageNotFoundComponent,
  TeamsPageComponent,
} from './pages';

// -------------------------------------------------------------------------- //
// Module
// -------------------------------------------------------------------------- //
@NgModule({
  declarations: [
    // Components
    HeaderComponent,
    FooterComponent,

    // Pages
    AboutPageComponent,
    HomePageComponent,
    NewsPageComponent,
    NominationFormPageComponent,
    PageNotFoundComponent,
    TeamsPageComponent,
  ],
  imports: [SharedModule, GenesModule, TeamsModule],
  exports: [
    // Components
    HeaderComponent,
    FooterComponent,

    // Pages
    AboutPageComponent,
    HomePageComponent,
    NewsPageComponent,
    NominationFormPageComponent,
    PageNotFoundComponent,
    TeamsPageComponent,
  ],
  providers: [
    ApiService,
    HelperService,
    SynapseApiService,
    {
      provide: RollbarService,
      useFactory: rollbarFactory,
    },
    { provide: ErrorHandler, useClass: ErrorService },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
