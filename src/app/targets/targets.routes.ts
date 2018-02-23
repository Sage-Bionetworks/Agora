import { TargetsViewComponent } from './targets-view';

export const routes = [
    { path: 'targets', children: [
        { path: '', component: TargetsViewComponent }
    ]}
];
