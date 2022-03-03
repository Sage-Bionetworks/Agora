import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
    ActivatedRouteStub,
    RouterStub,
    GeneServiceStub,
    ApiServiceStub,
    mockInfo1,
    mockGene1,
} from '../../../testing';

import { SOEComponent } from './soe.component';

import { MoreInfoComponent } from 'app/dialogs/more-info';

import { ApiService, GeneService } from '../../../core/services';

import { MockComponent } from 'ng-mocks';

import { Table } from 'primeng/table';

describe('Component: SOE', () => {
    let component: SOEComponent;
    let fixture: ComponentFixture<SOEComponent>;
    let geneService: GeneServiceStub;
    let apiService: ApiServiceStub;
    let activatedRoute: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SOEComponent,
                MockComponent(MoreInfoComponent),
                MockComponent(Table)
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                { provide: ApiService, useValue: new ApiServiceStub() }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(SOEComponent);

        // Get the injected instances
        geneService = fixture.debugElement.injector.get(GeneService);
        apiService = fixture.debugElement.injector.get(ApiService);
        activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
        activatedRoute.setParamMap({ id: mockInfo1.hgnc_symbol });

        component = fixture.componentInstance; // Component test instance

        component.geneInfo = mockInfo1;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should init the data', () => {
        const idSpy = spyOn(component, 'initData').and.callThrough();
        component.initData();
        expect(component.cols.length).toEqual(2);
        expect(component.summary.length).toEqual(5);
        expect(idSpy.calls.any()).toEqual(true);
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

    it('should have a table', () => {
        const el = fixture.debugElement.query(By.css('p-table'));
        expect(el).toBeDefined();

        const aEl = fixture.debugElement.queryAll(By.css('p-table'));
        expect(aEl.length).toEqual(1);
    });

    it('should open a new window when needed', () => {
        const woSpy = spyOn(window, 'open').and.callThrough();

        component.gene = mockGene1;
        component.openExternalLink('http://www.google.com/');

        expect(woSpy.calls.any()).toEqual(true);
    });
});
