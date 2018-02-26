import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TargetsViewComponent } from './targets-view';

const routes: Routes = [
    { path: '', component: TargetsViewComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TargetsRoutingModule { }
