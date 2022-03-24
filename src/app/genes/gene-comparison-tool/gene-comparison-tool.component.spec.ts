import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { Observable } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FilterService } from 'primeng/api';

import {
    RouterStub,
    ApiServiceStub
} from '../../testing';

import {
    GeneComparisonToolComponent,
    GeneComparisonToolDetailsPanelComponent,
    GeneComparisonToolFilterListComponent,
    GeneComparisonToolFilterPanelComponent
} from '.';

import { ApiService } from '../../core/services';

class ActivatedRouteStub {
    queryParams = new Observable(observer => {
        const urlParams = {}
        observer.next(urlParams);
        observer.complete();
    });
}

fdescribe('Component: GeneComparisonToolComponent', () => {
    let component: GeneComparisonToolComponent;
    let fixture: ComponentFixture<GeneComparisonToolComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GeneComparisonToolComponent,
                GeneComparisonToolDetailsPanelComponent,
                GeneComparisonToolFilterListComponent,
                GeneComparisonToolFilterPanelComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: ApiService, useValue: new ApiServiceStub() },
                { provide: FilterService, useValue: new FilterService() },
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(GeneComparisonToolComponent);
        component = fixture.componentInstance; // Component test instance
    }));

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should have 3 tables', () => {
        const el = fixture.debugElement.queryAll(By.css('p-table'));
        expect(el).toBeDefined();
        expect(el.length).toEqual(3);
    });

    it('should have 1 filter list', () => {
        const el = fixture.debugElement.queryAll(By.css('.gct-filter-list'));
        expect(el).toBeDefined();
        expect(el.length).toEqual(1);
    });

    it('should have 1 filter panel', () => {
        const el = fixture.debugElement.queryAll(By.css('.gct-details-panel'));
        expect(el).toBeDefined();
        expect(el.length).toEqual(2);
    });

    it('should have 1 details panel', () => {
        const el = fixture.debugElement.queryAll(By.css('.gct-filter-panel'));
        expect(el).toBeDefined();
        expect(el.length).toEqual(1);
    });
});
