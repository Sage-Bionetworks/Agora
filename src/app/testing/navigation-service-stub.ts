import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

import { RouterStub } from './router-stub';

import { ActivatedRouteStub } from './activated-route-stub';

@Injectable()
export class NavigationServiceStub {
    id: string = 'ENSG00000128564';
    // The menu tab that we route to when loading the overview component.
    // Defaults to the first one
    ovMenuTabIndex: number = 0;
    evidenceMenuTabIndex: number = 0;
    testRouter?: RouterStub;
    testRoute?: ActivatedRouteStub;

    constructor() {
        this.testRouter = new RouterStub();
        this.testRoute = new ActivatedRouteStub();
    }

    goToRoute(path: string, outlets?: any, extras?: NavigationExtras) {
        this.testRouter.navigate([path, outlets], extras);
    }

    goToRouteRelative(path: string, outlets?: any) {
        this.testRouter.navigate([path, outlets], { relativeTo: new ActivatedRoute() });
    }

    getRouter(): Router | RouterStub {
        return this.testRouter;
    }

    getRoute(): ActivatedRoute | ActivatedRouteStub {
        return this.testRoute;
    }

    getId(): string {
        return this.id;
    }

    getOvMenuTabIndex(): number {
        return this.ovMenuTabIndex;
    }

    setOvMenuTabIndex(index: number) {
        this.ovMenuTabIndex = index;
    }

    getEvidenceMenuTabIndex(): number {
        return this.evidenceMenuTabIndex;
    }

    setEvidenceMenuTabIndex(index: number) {
        this.evidenceMenuTabIndex = index;
    }
}
