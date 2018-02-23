import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppSharedModule } from 'app/shared';

import { routes } from './targets.routes';

import { TargetsViewComponent } from './targets-view';
import { TargetsListComponent } from './targets-list';

@NgModule({
    declarations: [
        TargetsViewComponent,
        TargetsListComponent
    ],
    imports: [
        CommonModule,
        // Our shared module
        AppSharedModule,
        RouterModule.forChild(routes)
    ]
})
// Changed the name so it does not conflict with primeng module
export class TargetsModule {
    public static routes = routes;
}
