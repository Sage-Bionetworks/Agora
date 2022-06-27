// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { NgModule, ErrorHandler } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// -------------------------------------------------------------------------- //
// Modules
// -------------------------------------------------------------------------- //
import { SharedModule } from '../shared';

// -------------------------------------------------------------------------- //
// Services
// -------------------------------------------------------------------------- //
import {
  ApiService,
  HelperService,
  SynapseApiService,
  ErrorService,
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
  imports: [SharedModule],
  exports: [HeaderComponent, FooterComponent],
  providers: [
    ApiService,
    HelperService,
    SynapseApiService,
    { provide: ErrorHandler, useClass: ErrorService },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
