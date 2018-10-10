import {
    async,
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
    ApiServiceStub,
    ActivatedRouteStub,
    RouterStub,
    DataServiceStub,
    ForceServiceStub,
    GeneServiceStub,
    mockInfo1
} from '../../../testing';

import { GeneOverviewComponent } from './gene-overview.component';

import { ApiService, DataService, ForceService, GeneService } from '../../../core/services';

import { Button } from 'primeng/button';

import { MockComponent } from 'ng-mocks';

describe('Component: GeneOverview', () => {
    let component: GeneOverviewComponent;
    let fixture: ComponentFixture<GeneOverviewComponent>;
    let router: RouterStub;
    let apiService: ApiServiceStub;
    let geneService: GeneServiceStub;
    let dataService: DataServiceStub;
    let forceService: ForceServiceStub;
    let activatedRoute: any;
    const locationStub: any = jasmine.createSpyObj('location', ['back', 'subscribe']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GeneOverviewComponent,
                MockComponent(Button),
                MockComponent(GeneOverviewComponent)
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: ApiService, useValue: new ApiServiceStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: DataService, useValue: new DataServiceStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                { provide: ForceService, useValue: new ForceServiceStub() },
                { provide: Location, useValue: locationStub }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(GeneOverviewComponent);

        // Get the injected instances
        router = fixture.debugElement.injector.get(Router);
        apiService = fixture.debugElement.injector.get(ApiService);
        geneService = fixture.debugElement.injector.get(GeneService);
        dataService = fixture.debugElement.injector.get(DataService);
        forceService = fixture.debugElement.injector.get(ForceService);
        activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
        activatedRoute.setParamMap({ id: mockInfo1.hgnc_symbol });

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get correct text', () => {
        const gtSpy = spyOn(component, 'getText').and.callThrough();
        let text;
        const trueText = 'True';
        const falseText = 'False';
        const noDataText = 'No data';

        text = component.getText(true);
        fixture.detectChanges();

        expect(gtSpy).toHaveBeenCalledWith(true);
        expect(text).toEqual(trueText);

        text = component.getText(false);
        fixture.detectChanges();

        expect(gtSpy).toHaveBeenCalledWith(false);
        expect(text).toEqual(falseText);

        text = component.getText(undefined);
        fixture.detectChanges();

        expect(gtSpy).toHaveBeenCalledWith(undefined);
        expect(text).toEqual(noDataText);
    });

    it('should get correct text color class', () => {
        const gtcSpy = spyOn(component, 'getTextColorClass').and.callThrough();
        let textColorClass;
        const normalGreen = { 'green-text': true, 'normal-heading': true };
        const italicGreen = { 'green-text': true, 'italic-heading': true };
        const normalRed = { 'red-text': true, 'normal-heading': true };
        const italicRed = { 'red-text': true, 'italic-heading': true };

        textColorClass = component.getTextColorClass(true, true);
        fixture.detectChanges();

        expect(gtcSpy).toHaveBeenCalledWith(true, true);
        expect(textColorClass).toEqual(normalGreen);

        textColorClass = component.getTextColorClass(true, false);
        fixture.detectChanges();

        expect(gtcSpy).toHaveBeenCalledWith(true, false);
        expect(textColorClass).toEqual(italicGreen);

        textColorClass = component.getTextColorClass(false, true);
        fixture.detectChanges();

        expect(gtcSpy).toHaveBeenCalledWith(false, true);
        expect(textColorClass).toEqual(normalRed);

        textColorClass = component.getTextColorClass(false, false);
        fixture.detectChanges();

        expect(gtcSpy).toHaveBeenCalledWith(false, false);
        expect(textColorClass).toEqual(italicRed);
    });

    it('should save the loaded genes state', fakeAsync(() => {
        const dsSpy = spyOn(dataService, 'loadGenes').and.callFake(() =>
            Promise.resolve(true)
        );

        spyOn(component, 'initDetails').and.callThrough();
        const hgcSpy = spyOn(geneService, 'hasGeneChanged');
        hgcSpy.and.callFake(() => {
            return true;
        });
        component.initDetails();
        tick(500);

        fixture.detectChanges();
        expect(component.dataLoaded).toEqual(true);
        expect(dsSpy.calls.any()).toEqual(true);

        component.dataLoaded = false;
        fixture.detectChanges();
        expect(component.dataLoaded).toEqual(false);

        hgcSpy.and.callFake(() => {
            return false;
        });
        component.initDetails();
        tick(500);

        fixture.detectChanges();
        expect(component.dataLoaded).toEqual(true);
        expect(dsSpy.calls.count()).toEqual(2);
    }));
});
