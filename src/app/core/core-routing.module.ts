import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { DashboardComponent } from './dashboard';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';

const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'targets', loadChildren: '../targets#TargetsModule'},
    { path: 'about', component: AboutComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**',    component: NoContentComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        useHash: Boolean(history.pushState) === false,
        preloadingStrategy: PreloadAllModules,
        onSameUrlNavigation: 'reload'
    })],
    exports: [RouterModule]
})
export class CoreRoutingModule {}
