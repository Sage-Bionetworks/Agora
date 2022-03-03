import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
    ApiServiceStub,
    ActivatedRouteStub,
    RouterStub,
    DataServiceStub,
    ForceServiceStub,
    GeneServiceStub,
    NavigationServiceStub,
    mockInfo1
} from '../../../../../testing';

import { GeneNetworkComponent } from './gene-network.component';

import {
    ApiService,
    DataService,
    ForceService,
    GeneService,
    NavigationService
} from '../../../../../core/services';

import { MoreInfoComponent } from 'app/dialogs/more-info';

import { MockComponent } from 'ng-mocks';

import { ArraySortPipe } from '../../../../../shared/pipes';

describe('Component: GeneNetwork', () => {
    let component: GeneNetworkComponent;
    let fixture: ComponentFixture<GeneNetworkComponent>;
    let router: RouterStub;
    let apiService: ApiServiceStub;
    let forceService: ForceServiceStub;
    let activatedRoute: any;
    const locationStub: any = jasmine.createSpyObj('location', ['back', 'subscribe']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GeneNetworkComponent,
                MockComponent(MoreInfoComponent),
                MockComponent(GeneNetworkComponent),
                ArraySortPipe
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
                { provide: NavigationService, useValue: new NavigationServiceStub() },
                { provide: Location, useValue: locationStub }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(GeneNetworkComponent);

        // Get the injected instances
        router = fixture.debugElement.injector.get(Router);
        apiService = fixture.debugElement.injector.get(ApiService);
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

        // with default modifier
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

        // with explicit true modifier
        text = component.getText(true, true);
        fixture.detectChanges();

        expect(gtSpy).toHaveBeenCalledWith(true, true);
        expect(text).toEqual(trueText);

        text = component.getText(false, true);
        fixture.detectChanges();

        expect(gtSpy).toHaveBeenCalledWith(false, true);
        expect(text).toEqual(falseText);

        text = component.getText(undefined, true);
        fixture.detectChanges();

        expect(gtSpy).toHaveBeenCalledWith(undefined, true);
        expect(text).toEqual(noDataText);

        // with false modifier
        text = component.getText(true, false);
        fixture.detectChanges();

        expect(gtSpy).toHaveBeenCalledWith(true, false);
        expect(text).toEqual(noDataText);

        text = component.getText(false, false);
        fixture.detectChanges();

        expect(gtSpy).toHaveBeenCalledWith(false, false);
        expect(text).toEqual(noDataText);

        text = component.getText(undefined, false);
        fixture.detectChanges();

        expect(gtSpy).toHaveBeenCalledWith(undefined, false);
        expect(text).toEqual(noDataText);
    });

    it('should get correct text color class', () => {
        const gtcSpy = spyOn(component, 'getTextColorClass').and.callThrough();
        let textColorClass;
        const normalGreen = { 'green-text': true, 'normal-heading': true };
        const italicGreen = { 'green-text': true, 'italic-heading': true };
        const normalRed = { 'red-text': true, 'normal-heading': true };
        const italicRed = { 'red-text': true, 'italic-heading': true };
        const normalBlack = { 'normal-heading': true };
        const italicBlack = { 'italic-heading': true };

        // with default modifier
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

        // with explicit true modifier
        textColorClass = component.getTextColorClass(true, true, true);
        fixture.detectChanges();

        expect(gtcSpy).toHaveBeenCalledWith(true, true, true);
        expect(textColorClass).toEqual(normalGreen);

        textColorClass = component.getTextColorClass(true, false, true);
        fixture.detectChanges();

        expect(gtcSpy).toHaveBeenCalledWith(true, true, true);
        expect(textColorClass).toEqual(italicGreen);

        textColorClass = component.getTextColorClass(false, true, true);
        fixture.detectChanges();

        expect(gtcSpy).toHaveBeenCalledWith(false, true, true);
        expect(textColorClass).toEqual(normalRed);

        textColorClass = component.getTextColorClass(false, false, true);
        fixture.detectChanges();

        expect(gtcSpy).toHaveBeenCalledWith(false, true, true);
        expect(textColorClass).toEqual(italicRed);

        // with false modifier
        textColorClass = component.getTextColorClass(true, true, false);
        fixture.detectChanges();

        expect(gtcSpy).toHaveBeenCalledWith(true, true, true);
        expect(textColorClass).toEqual(normalBlack);

        textColorClass = component.getTextColorClass(true, false, false);
        fixture.detectChanges();

        expect(gtcSpy).toHaveBeenCalledWith(true, true, true);
        expect(textColorClass).toEqual(italicBlack);

        textColorClass = component.getTextColorClass(false, true, false);
        fixture.detectChanges();

        expect(gtcSpy).toHaveBeenCalledWith(false, true, true);
        expect(textColorClass).toEqual(normalBlack);

        textColorClass = component.getTextColorClass(false, false, false);
        fixture.detectChanges();

        expect(gtcSpy).toHaveBeenCalledWith(false, true, true);
        expect(textColorClass).toEqual(italicBlack);
    });

    /*it('should have extra info components', () => {
        component.dataLoaded = true;
        component.noData = false;
        fixture.detectChanges();

        const els = fixture.debugElement.queryAll(By.css('more-info'));
        els.forEach((el) => {
            expect(el).toBeDefined();
        });

        // When using ng-mocks, we need to pick the component instance,
        // pass in the input value so we can assert it after
        const ci = els[0].componentInstance as MoreInfoComponent;
        ci.name = 'brn';
        const ci2 = els[1].componentInstance as MoreInfoComponent;
        ci2.name = 'sgn';
        fixture.detectChanges();
        expect(ci.name).toEqual('brn');
        expect(ci2.name).toEqual('sgn');

        const aEl = fixture.debugElement.queryAll(By.css('more-info'));
        expect(aEl.length).toEqual(2);
    });*/
});
