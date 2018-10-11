import {
    async,
    ComponentFixture,
    TestBed,
    fakeAsync
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import {
    RouterStub,
    ApiServiceStub,
    GeneServiceStub,
    mockInfo1
} from '../../testing';

import { GeneSearchComponent } from './gene-search.component';

import { ApiService, GeneService } from '../../core/services';

import { of, empty, Observable } from 'rxjs';

import { MockComponent } from 'ng-mocks';

describe('Component: GeneSearch', () => {
    let component: GeneSearchComponent;
    let fixture: ComponentFixture<GeneSearchComponent>;
    let apiService: ApiServiceStub;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GeneSearchComponent,
                MockComponent(GeneSearchComponent)
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: ApiService, useValue: new ApiServiceStub() },
                { provide: GeneService, useValue: new GeneServiceStub() }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(GeneSearchComponent);

        // Get the injected instances
        apiService = fixture.debugElement.injector.get(ApiService);

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should focus search list', () => {
        const sfSpy = spyOn(component, 'focusSearchList').and.callThrough();
        component.focusSearchList(true);
        fixture.detectChanges();

        expect(component.hasFocus).toEqual(true);
        expect(sfSpy.calls.any()).toEqual(true);
    });

    it('should close search list', () => {
        const csSpy = spyOn(component, 'closeSearchList').and.callThrough();
        component.hasFocus = false;
        fixture.detectChanges();
        component.closeSearchList(null);
        fixture.detectChanges();

        expect(component.hasFocus).toEqual(false);
        expect(csSpy.calls.any()).toEqual(true);
        expect(component.results).toEqual([]);
    });

    it('should not search for an empty gene string', fakeAsync(() => {
        const emptyObs = empty() as Observable<Response>;

        const dsSpy = spyOn(apiService, 'getInfosMatchId');

        spyOn(component, 'search').and.callThrough();
        component.search('').subscribe((data) => {
            expect(data).toEqual(emptyObs);
            expect(dsSpy.calls.any()).toEqual(false);
        }); // search an empty gene id
    }));

    it('should search for a typed gene', fakeAsync(() => {
        const dsSpy = spyOn(apiService, 'getInfosMatchId').and.returnValue(
            of([mockInfo1])
        );

        spyOn(component, 'search').and.callThrough();
        component.search(mockInfo1.hgnc_symbol).subscribe((data) => {
            expect(dsSpy.calls.any()).toEqual(true);
            expect(data).toEqual([mockInfo1]);
        }); // search a gene id
    }));
});
