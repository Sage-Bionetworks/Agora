import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TermsComponent } from './terms.component';

describe('Component: BPDialog', () => {
    let component: TermsComponent;
    let fixture: ComponentFixture<TermsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TermsComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(TermsComponent);

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
