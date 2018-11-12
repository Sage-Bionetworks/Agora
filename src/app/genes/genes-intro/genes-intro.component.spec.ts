import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { GenesIntroComponent } from './genes-intro.component';
import { GeneSearchComponent } from '../gene-search';

import { Button } from 'primeng/button';

import { MockComponent } from 'ng-mocks';

describe('Component: GenesIntro', () => {
    let component: GenesIntroComponent;
    let fixture: ComponentFixture<GenesIntroComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                MockComponent(Button),
                MockComponent(GeneSearchComponent),
                GenesIntroComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(GenesIntroComponent);

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have search as child component', () => {
        const gsElement = fixture.debugElement
            .query(By.css('gene-search'))
            .componentInstance as GeneSearchComponent;

        expect(gsElement).toBeTruthy();
    });
});
