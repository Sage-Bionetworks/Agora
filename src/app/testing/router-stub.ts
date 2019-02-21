import { Injectable } from '@angular/core';
import {
    NavigationExtras,
    Event,
    ActivationEnd,
    ActivatedRouteSnapshot,
    NavigationEnd,
    NavigationStart
} from '@angular/router';

import { Observable, of, Subject } from 'rxjs';

@Injectable()
export class RouterStub {
    url: string;
    events: Observable<Event> = of(new ActivationEnd(
        new ActivatedRouteSnapshot()
    ));
    asObs?: Observable<NavigationStart> = of(new NavigationStart(
        0,
        'http://localhost:8080/genes'
    ));
    aeObs?: Observable<NavigationEnd> = of(new NavigationEnd(
        0,
        'http://localhost:8080/genes',
        'http://localhost:8080/genes'
    ));

    navigate(commands: any[], extras?: NavigationExtras) {
        // Empty comment so tslint does not complain about empty block
        this.url = commands[0];
        const ne = new NavigationEnd(0, this.url, null);
        const subject = new Subject();
        subject.next(ne);
    }
}
