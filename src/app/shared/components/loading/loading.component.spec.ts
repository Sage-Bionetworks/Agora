import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { LoadingComponent } from './';

describe('Component: Loading', () => {
    let component: LoadingComponent;
    let fixture: ComponentFixture<LoadingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                LoadingComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(LoadingComponent);

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have the video object', inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
        fixture.detectChanges();

        expect(component.videoTag).not.toEqual(undefined);
    }));
});
