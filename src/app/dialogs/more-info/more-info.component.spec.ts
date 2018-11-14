import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import {
    DataServiceStub
} from '../../testing';

import { MoreInfoComponent } from './';

import {
    DialogsService
} from '../services';

describe('Component: MoreInfo', () => {
    let component: MoreInfoComponent;
    let fixture: ComponentFixture<MoreInfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                MoreInfoComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: DialogsService, useValue: new DataServiceStub() }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(MoreInfoComponent);

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a text to display', () => {
        expect(component.text).toEqual('View more information');
    });

    it('should have content to put the dialogs', () => {
        fixture.detectChanges();
        const el = fixture.debugElement.query(By.css('ng-content'));
        expect(el).toBeDefined();
    });
});
