import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

@Injectable()
export class LocalStorageServiceStub {
    lsKeyValues?: Map<string, any> = new Map<string, boolean>();

    retrieve(key: string): any {
        return this.lsKeyValues.get(key);
    }

    store(key: string, value: any) {
        if (key && !this.lsKeyValues.has(key)) { this.lsKeyValues.set(key, value); }
    }

    observe(key: string): Observable<any> {
        return of(this.lsKeyValues.get(key));
    }
}
