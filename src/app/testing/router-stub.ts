import { Injectable } from '@angular/core';
import { NavigationExtras, Event, ActivationEnd, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';

@Injectable()
export class RouterStub {
    url: string;
    events: Observable<Event> = of(new ActivationEnd(
        new ActivatedRouteSnapshot()
    ));

    navigate(commands: any[], extras?: NavigationExtras) {
        // Empty comment so tslint does not complain about empty block
    }
}
