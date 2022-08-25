// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { AccordionModule } from 'primeng/accordion';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { InputSwitchModule } from 'primeng/inputswitch';

import { MessageService } from 'primeng/api';

// -------------------------------------------------------------------------- //
// Components
// -------------------------------------------------------------------------- //
import {
  SvgIconComponent,
  LoadingIconComponent,
  LoadingOverlayComponent,
  WikiComponent,
  ModalLinkComponent,
  OverlayPanelLinkComponent,
  DownloadDomImageComponent,
} from './components';

// -------------------------------------------------------------------------- //
// Routes
// -------------------------------------------------------------------------- //
// N/A

@NgModule({
  declarations: [
    SvgIconComponent,
    LoadingIconComponent,
    LoadingOverlayComponent,
    WikiComponent,
    ModalLinkComponent,
    OverlayPanelLinkComponent,
    DownloadDomImageComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    //
    AccordionModule,
    DropdownModule,
    TableModule,
    OverlayPanelModule,
    TooltipModule,
    CheckboxModule,
    ButtonModule,
    DialogModule,
    RadioButtonModule,
    MultiSelectModule,
    ToastModule,
    InputSwitchModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    //
    AccordionModule,
    DropdownModule,
    TableModule,
    OverlayPanelModule,
    TooltipModule,
    CheckboxModule,
    ButtonModule,
    DialogModule,
    RadioButtonModule,
    MultiSelectModule,
    ToastModule,
    InputSwitchModule,
    //
    SvgIconComponent,
    LoadingIconComponent,
    LoadingOverlayComponent,
    WikiComponent,
    ModalLinkComponent,
    OverlayPanelLinkComponent,
    DownloadDomImageComponent,
  ],
  providers: [MessageService],
})
export class SharedModule {}
