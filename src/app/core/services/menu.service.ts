import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable()
export class MenuService {
    // Observable string sources
    omReadySource = new Subject<boolean>();
    emReadySource = new Subject<boolean>();

    // Observable string streams
    omReady$ = this.omReadySource.asObservable();
    emReady$ = this.emReadySource.asObservable();

    overviewMenuReady() {
        this.omReadySource.next(true);
    }

    evidenceMenuReady() {
        this.emReadySource.next(true);
    }
}
