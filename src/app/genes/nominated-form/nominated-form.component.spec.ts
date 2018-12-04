import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';

import {
    RouterOutletStubComponent,
    RouterStub,
    ActivatedRouteStub,
    mockInfo1
} from '../../testing';

import { NominatedFormComponent } from './nominated-form.component';

describe('Component: NominatedForm', () => {
    let component: NominatedFormComponent;
    let fixture: ComponentFixture<NominatedFormComponent>;
    let router: RouterStub;
    let activatedRoute: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                NominatedFormComponent,
                RouterOutletStubComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(NominatedFormComponent);

        // Get the injected instances
        router = fixture.debugElement.injector.get(Router);
        activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
        activatedRoute.setParamMap({ id: mockInfo1.hgnc_symbol });

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
