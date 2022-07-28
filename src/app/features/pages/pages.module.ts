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
