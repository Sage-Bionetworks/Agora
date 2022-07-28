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
import { HttpErrorInterceptor } from './interceptors';

// -------------------------------------------------------------------------- //
// Components
// -------------------------------------------------------------------------- //
import { HeaderComponent, FooterComponent } from './components';

// -------------------------------------------------------------------------- //
// Module
// -------------------------------------------------------------------------- //
@NgModule({
  declarations: [HeaderComponent, FooterComponent],
  imports: [SharedModule, GenesModule],
  exports: [HeaderComponent, FooterComponent],
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
      useClass: HttpErrorInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
