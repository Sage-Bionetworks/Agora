import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { AboutComponent } from './about';
import { HelpComponent } from './help';
import { NoContentComponent } from './no-content';
import { SynapseAccountComponent } from './synapse-account';
import { ContribTeamsPageComponent } from './contrib-teams';
import { NewsComponent } from './news';

export const routes: Routes = [
    { path: '', loadChildren: '../genes/genes.module#GenesModule'},
    { path: 'about', component: AboutComponent },
    { path: 'news', component: NewsComponent },
    { path: 'help', component: HelpComponent },
    { path: 'teams-contributing', component: ContribTeamsPageComponent },
    { path: 'synapse-account', component: SynapseAccountComponent },
    { path: 'no-content', component: NoContentComponent },
    { path: '**', component: NoContentComponent }
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
