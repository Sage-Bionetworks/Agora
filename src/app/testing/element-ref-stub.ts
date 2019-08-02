import { Injectable, ElementRef } from '@angular/core';

@Injectable()
export class MockElementRef extends ElementRef {
    nativeElement: {};
    parentElement: MockElementRef;

    constructor() { super(null); }
}
