import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
    ActivatedRouteStub,
    GeneServiceStub
} from '../../../testing';

import { GeneDruggabilityComponent } from './gene-druggability.component';

import { GeneService } from '../../../core/services';

import { Table } from 'primeng/table';

import { MockComponent } from 'ng-mocks';

describe('Component: GeneDruggability', () => {
    let component: GeneDruggabilityComponent;
    let fixture: ComponentFixture<GeneDruggabilityComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GeneDruggabilityComponent,
                MockComponent(Table),
                MockComponent(GeneDruggabilityComponent)
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: GeneService, useValue: new GeneServiceStub() }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(GeneDruggabilityComponent);

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a table', () => {
        const el = fixture.debugElement.query(By.css('p-table'));
        expect(el).toBeDefined();

        const aEl = fixture.debugElement.queryAll(By.css('p-table'));
        expect(aEl.length).toEqual(1);
    });
});
