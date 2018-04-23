import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';

const routes: Routes = [
    { path: 'genes', loadChildren: '../genes#GenesModule'},
    { path: 'about', component: AboutComponent },
    { path: '', redirectTo: '/genes', pathMatch: 'full' },
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
