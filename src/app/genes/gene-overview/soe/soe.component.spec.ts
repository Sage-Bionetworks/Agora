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
    mockInfo1,
    mockGene1
} from '../../../testing';

import { SOEComponent } from './soe.component';

import { MoreInfoComponent } from 'app/dialogs/more-info';

import { GeneService } from '../../../core/services';

import { MockComponent } from 'ng-mocks';

import { Table } from 'primeng/table';

describe('Component: SOE', () => {
    let component: SOEComponent;
    let fixture: ComponentFixture<SOEComponent>;
    let geneService: GeneServiceStub;
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
                { provide: GeneService, useValue: new GeneServiceStub() }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(SOEComponent);

        // Get the injected instances
        geneService = fixture.debugElement.injector.get(GeneService);
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
        expect(component.summary.length).toEqual(10);
        expect(idSpy.calls.any()).toEqual(true);
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
