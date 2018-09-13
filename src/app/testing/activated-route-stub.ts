import { convertToParamMap, ParamMap, Params, ActivatedRouteSnapshot } from '@angular/router';
import { ReplaySubject } from 'rxjs';

/**
 * An ActivateRoute test double with a `paramMap` observable.
 * Use the `setParamMap()` method to add the next `paramMap` value.
 */
export class ActivatedRouteStub {
    /** The mock paramMap observable */
    readonly paramMap;

    // Use a ReplaySubject to share previous values with subscribers
    // and pump new values into the `paramMap` observable
    private subject = new ReplaySubject<ParamMap>();

    private snapshot: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();

    constructor(initialParams?: Params) {
        this.paramMap = this.subject.asObservable();
        this.setParamMap(initialParams);
    }

    /** Set the paramMap observables's next value */
    setParamMap(params?: Params) {
        this.subject.next(convertToParamMap(params));
    }
}
