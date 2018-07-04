import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';

export const routes: Routes = [
    { path: '', loadChildren: '../genes#GenesModule'},
    { path: 'about', component: AboutComponent },
    { path: '**', component: NoContentComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        useHash: Boolean(history.pushState) === false,
        preloadingStrategy: PreloadAllModules,
        onSameUrlNavigation: 'reload',
        enableTracing: true
    })],
    exports: [RouterModule]
})
export class CoreRoutingModule {}
