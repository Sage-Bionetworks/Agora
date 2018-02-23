import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';

export const ROUTES: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'targets', loadChildren: './targets#TargetsModule'},
    { path: 'about', component: AboutComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**',    component: NoContentComponent }
];
