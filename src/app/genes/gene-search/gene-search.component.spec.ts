import {
    async,
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
    discardPeriodicTasks
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

import {
    RouterStub,
    ApiServiceStub,
    GeneServiceStub,
    NavigationServiceStub,
    mockInfo1,
    mockGene1
} from '../../testing';

import { GeneSearchComponent } from './gene-search.component';

import { ApiService, GeneService, NavigationService } from '../../core/services';

import { GeneResponse } from 'app/models';

// Updating to rxjs 6 import statement
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of, empty, Observable, throwError } from 'rxjs';

import { ProgressSpinner } from 'primeng/progressspinner';

import { MockComponent } from 'ng-mocks';

describe('Component: GeneSearch', () => {
    let component: GeneSearchComponent;
    let fixture: ComponentFixture<GeneSearchComponent>;
    let apiService: ApiServiceStub;
    let geneService: GeneServiceStub;
    let navService: NavigationService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule
            ],
            declarations: [
                GeneSearchComponent,
                MockComponent(ProgressSpinner)
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: ApiService, useValue: new ApiServiceStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                { provide: NavigationService, useValue: new NavigationServiceStub() },
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(GeneSearchComponent);

        // Get the injected instances
        apiService = fixture.debugElement.injector.get(ApiService);
        geneService = fixture.debugElement.injector.get(GeneService);
        navService = fixture.debugElement.injector.get(NavigationService);

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a section', () => {
        const el = fixture.debugElement.query(By.css('section'));
        expect(el).toBeDefined();

        const aEl = fixture.debugElement.queryAll(By.css('section'));
        expect(aEl.length).toEqual(1);
    });

    it('should have a progress spinner element', fakeAsync(() => {
        component.isSearching = true;
        tick();
        fixture.detectChanges();
        const el = fixture.debugElement.query(By.css('p-progressSpinner'));
        expect(el).toBeDefined();

        const aEl = fixture.debugElement.queryAll(By.css('p-progressSpinner'));
        expect(aEl.length).toEqual(1);
    }));

    it('should have a input element', () => {
        const el = fixture.debugElement.query(By.css('input'));
        expect(el).toBeDefined();

        const aEl = fixture.debugElement.queryAll(By.css('input'));
        expect(aEl.length).toEqual(1);
    });

    it('should have a placeholder for the input', () => {
        const el = fixture.debugElement.query(By.css('input'));
        expect(el.nativeElement.placeholder).not.toBeNull();
        expect(el.nativeElement.placeholder).toEqual('Search Gene Symbol or Ensembl ID');
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

    it('should throw an error for invalid genes', fakeAsync(() => {
        const errorObj = {
            status: 404
        };
        const sSpy = spyOn(component, 'search').and.callFake((queryString: string) => {
            if (queryString === '!') {
                return throwError(errorObj);
            } else {
                of([mockInfo1]);
            }
        });
        const iqfSpy = spyOn(component, 'initQueryField').and.callThrough();
        component.initQueryField();
        component.queryField.valueChanges.subscribe(async (data) => {
            expect(data).toEqual('!');
            await component.search(data).subscribe((sd) => {
                // There shouldn't be anything here
            }, (error) => {
                expect(error).toEqual(errorObj);
                expect(sSpy).toHaveBeenCalled();
                expect(iqfSpy).toHaveBeenCalled();

                // Without this both subscriptions stay in queue, leading
                // to an error when testing
                discardPeriodicTasks();
            });
        }); // search an invalid gene id

        const el = fixture.debugElement.query(By.css('input'));
        el.nativeElement.value = '!';
        el.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
    }));

    it('should update the results on query change', fakeAsync(() => {
        const iqfSpy = spyOn(component, 'initQueryField').and.callThrough();
        const sSpy = spyOn(component, 'search').and.callThrough();
        fixture.detectChanges();

        const input = fixture.debugElement.query(By.css('input'));
        expect(input.nativeElement.value).toEqual('');

        input.nativeElement.focus();
        input.nativeElement.value = 'PIAS2';
        input.nativeElement.dispatchEvent(new Event('input'));
        tick(1000);
        fixture.detectChanges();

        expect(input.nativeElement.value).toEqual('PIAS2');
        expect(iqfSpy.calls.any()).toEqual(true);
        expect(sSpy.calls.any()).toEqual(true);
    }));

    it('should search for a non-empty gene', fakeAsync(() => {
        const dsSpy = spyOn(apiService, 'getInfosMatchId').and.returnValue(
            of({ items: [mockInfo1]})
        );

        spyOn(component, 'search').and.callThrough();
        component.search(mockInfo1.ensembl_gene_id).subscribe((data) => {
            expect(dsSpy.calls.any()).toEqual(true);
            expect(data).toEqual({ items: [mockInfo1]});
        }); // search a gene id
    }));

    it('should redirect if we try to get a gene with no info', fakeAsync(() => {
        const ggSpy = spyOn(component, 'getGene').and.callThrough();
        const sotSpy = spyOn(navService, 'setOvMenuTabIndex').and.callThrough();
        const gtrSpy = spyOn(navService, 'goToRoute').and.callThrough();
        const gcgSpy = spyOn(geneService, 'getCurrentGene').and.callThrough();
        const upgSpy = spyOn(geneService, 'updatePreviousGene').and.callThrough();
        const data = {
            item: mockGene1,
            info: mockInfo1
        } as GeneResponse;
        data.info = null;
        const aggSpy = spyOn(apiService, 'getGene').and.returnValue(of(data));

        component.getGene('VGF');
        expect(ggSpy.calls.any()).toEqual(true);
        expect(sotSpy.calls.any()).toEqual(false);
        expect(gtrSpy.calls.any()).toEqual(true);
        expect(aggSpy.calls.any()).toEqual(true);
        expect(gcgSpy.calls.any()).toEqual(false);
        expect(upgSpy.calls.any()).toEqual(false);
    }));

    it('should view a gene on click', fakeAsync(() => {
        const vgSpy = spyOn(component, 'viewGene').and.callThrough();
        const sotSpy = spyOn(navService, 'setOvMenuTabIndex').and.callThrough();
        const ggSpy = spyOn(apiService, 'getGene').and.callThrough();
        const gcgSpy = spyOn(geneService, 'getCurrentGene').and.callThrough();
        const upgSpy = spyOn(geneService, 'updatePreviousGene').and.callThrough();

        component.viewGene(mockInfo1);
        expect(vgSpy.calls.any()).toEqual(true);
        expect(sotSpy.calls.any()).toEqual(true);
        expect(ggSpy.calls.any()).toEqual(true);
        expect(gcgSpy.calls.any()).toEqual(true);
        expect(upgSpy.calls.any()).toEqual(true);
    }));
});
