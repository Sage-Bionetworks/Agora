import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { LoadingPageComponent } from './';
import { LoadingComponent } from '../loading/loading.component';

describe('Component: LoadingPage', () => {
    let component: LoadingPageComponent;
    let fixture: ComponentFixture<LoadingPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                LoadingPageComponent,
                LoadingComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(LoadingPageComponent);

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a loading component', () => {
        const el = fixture.debugElement.query(By.css('loading'));
        expect(el).toBeDefined();
    });
});
