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
        activatedRoute.setParamMap({ id: mockInfo1.ensembl_gene_id });

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
        let state;
        let isStateApplicable;

        state = true;
        text = component.getText(state);
        fixture.detectChanges();
        expect(gtSpy).toHaveBeenCalledWith(true);
        expect(text).toEqual(trueText);

        state = false;
        text = component.getText(state);
        fixture.detectChanges();
        expect(gtSpy).toHaveBeenCalledWith(false);
        expect(text).toEqual(falseText);

        state = undefined;
        text = component.getText(state);
        fixture.detectChanges();
        expect(gtSpy).toHaveBeenCalledWith(undefined);
        expect(text).toEqual(noDataText);

        state = true;
        isStateApplicable = true;
        text = component.getText(state, isStateApplicable);
        fixture.detectChanges();
        expect(gtSpy).toHaveBeenCalledWith(true, true);
        expect(text).toEqual(trueText);

        state = false;
        isStateApplicable = true;
        text = component.getText(state, isStateApplicable);
        fixture.detectChanges();
        expect(gtSpy).toHaveBeenCalledWith(false, true);
        expect(text).toEqual(falseText);

        state = undefined;
        isStateApplicable = true;
        text = component.getText(state, isStateApplicable);
        fixture.detectChanges();
        expect(gtSpy).toHaveBeenCalledWith(undefined, true);
        expect(text).toEqual(noDataText);

        state = true;
        isStateApplicable = false;
        text = component.getText(state, isStateApplicable);
        fixture.detectChanges();
        expect(gtSpy).toHaveBeenCalledWith(true, false);
        expect(text).toEqual(noDataText);

        state = false;
        isStateApplicable = false;
        text = component.getText(state, isStateApplicable);
        fixture.detectChanges();
        expect(gtSpy).toHaveBeenCalledWith(false, false);
        expect(text).toEqual(noDataText);

        state = undefined;
        isStateApplicable = false;
        text = component.getText(state, isStateApplicable);
        fixture.detectChanges();
        expect(gtSpy).toHaveBeenCalledWith(undefined, false);
        expect(text).toEqual(noDataText);
    });

    it('should get correct text color class', () => {
        const gtcSpy = spyOn(component, 'getTextColorClass').and.callThrough();
        let textColorClass;
        const greenText = { 'green-text': true };
        const redText = { 'red-text': true };
        const blackText = { };
        let state;
        let isStateApplicable;

        state = true;
        textColorClass = component.getTextColorClass(state);
        fixture.detectChanges();
        expect(gtcSpy).toHaveBeenCalledWith(true);
        expect(textColorClass).toEqual(greenText);

        state = false;
        textColorClass = component.getTextColorClass(state);
        fixture.detectChanges();
        expect(gtcSpy).toHaveBeenCalledWith(false);
        expect(textColorClass).toEqual(redText);

        state = true;
        isStateApplicable = true;
        textColorClass = component.getTextColorClass(state, isStateApplicable);
        fixture.detectChanges();
        expect(gtcSpy).toHaveBeenCalledWith(true, true);
        expect(textColorClass).toEqual(greenText);

        state = false;
        isStateApplicable = true;
        textColorClass = component.getTextColorClass(state, isStateApplicable);
        fixture.detectChanges();
        expect(gtcSpy).toHaveBeenCalledWith(false, true);
        expect(textColorClass).toEqual(redText);

        state = true;
        isStateApplicable = false;
        textColorClass = component.getTextColorClass(state, isStateApplicable);
        fixture.detectChanges();
        expect(gtcSpy).toHaveBeenCalledWith(true, false);
        expect(textColorClass).toEqual(blackText);

        state = false;
        isStateApplicable = false;
        textColorClass = component.getTextColorClass(state, isStateApplicable);
        fixture.detectChanges();
        expect(gtcSpy).toHaveBeenCalledWith(false, false);
        expect(textColorClass).toEqual(blackText);
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
