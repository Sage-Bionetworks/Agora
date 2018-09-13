import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import {
    RouterOutletStubComponent
} from '../../testing';

import { GenesViewComponent } from './';

describe('Component: GenesView', () => {
    let component: GenesViewComponent;
    let fixture: ComponentFixture<GenesViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GenesViewComponent,
                RouterOutletStubComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(GenesViewComponent);

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
