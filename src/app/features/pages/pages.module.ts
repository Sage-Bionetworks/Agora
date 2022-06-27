// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { NgModule } from '@angular/core';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { SharedModule } from '../../shared';
import { GenesModule } from '../genes';

// -------------------------------------------------------------------------- //
// Components
// -------------------------------------------------------------------------- //
import {
  AboutPageComponent,
  HelpPageComponent,
  HomePageComponent,
  NewsPageComponent,
  NominationFormPageComponent,
  PageNotFoundComponent,
} from './components';

// -------------------------------------------------------------------------- //
// Modules
// -------------------------------------------------------------------------- //
@NgModule({
  declarations: [
    AboutPageComponent,
    HelpPageComponent,
    HomePageComponent,
    NewsPageComponent,
    NominationFormPageComponent,
    PageNotFoundComponent,
  ],
  imports: [SharedModule, GenesModule],
  exports: [],
  providers: [],
})
export class PagesModule {}
