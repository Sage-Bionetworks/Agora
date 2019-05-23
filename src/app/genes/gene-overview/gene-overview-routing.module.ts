import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneOverviewComponent } from './gene-overview.component';

export const routes: Routes = [
    { path: '', component: GeneOverviewComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GeneOverviewRoutingModule { }
