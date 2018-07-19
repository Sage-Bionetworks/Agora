import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { routes } from '../genes-routing.module';

import {
    RouterStub,
    RouterOutletStubComponent,
    RouterLinkStubDirective
} from '../../testing';

import { GenesViewComponent } from './genes-view.component';

describe('Component: GenesView', () => {
    let component: GenesViewComponent;
    let fixture: ComponentFixture<GenesViewComponent>;
    let router: RouterStub;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GenesViewComponent,
                RouterOutletStubComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(GenesViewComponent);

        // Get the injected instances
        router = fixture.debugElement.injector.get(Router);

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
