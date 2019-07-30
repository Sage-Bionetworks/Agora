import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import {
    RouterOutletStubComponent
} from '../../testing';

import { NominatedFormComponent } from './nominated-form.component';

describe('Component: NominatedForm', () => {
    let component: NominatedFormComponent;
    let fixture: ComponentFixture<NominatedFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                NominatedFormComponent,
                RouterOutletStubComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(NominatedFormComponent);

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have the form iframe', () => {
        const el = fixture.debugElement.query(By.css('iframe'));
        expect(el).toBeDefined();

        expect(el.nativeElement.src).toEqual('https://docs.google.com/forms/d/e/1FAIpQLScoml' +
            '5Z_RZqb1M7e9RMLepn_pMsVXfm8uEjJ5KpFWLG18Sr2Q/viewform?embedded=true');
    });
});
