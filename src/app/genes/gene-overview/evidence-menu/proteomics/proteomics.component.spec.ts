import {
    async,
    ComponentFixture, fakeAsync,
    TestBed, tick
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import {
    GeneServiceStub,
    ChartServiceStub,
    ApiServiceStub
} from '../../../../testing';

import { ProteomicsComponent } from './proteomics.component';

import { ApiService, GeneService } from '../../../../core/services';

import { ChartService } from '../../../../charts/services';
import { By } from '@angular/platform-browser';

describe('Component: Proteomics', () => {
    let component: ProteomicsComponent;
    let fixture: ComponentFixture<ProteomicsComponent>;
    let chartService: ChartServiceStub;
    let apiService: ApiServiceStub;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ProteomicsComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: ChartService, useValue: new ChartServiceStub() },
                { provide: ApiService, useValue: new ApiServiceStub() },
                { provide: GeneService, useValue: new GeneServiceStub() }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(ProteomicsComponent);

        chartService = fixture.debugElement.injector.get(ChartService);
        apiService = fixture.debugElement.injector.get(ApiService);

        component = fixture.componentInstance; // Component test instance
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not have charts after initial loading', () => {
        const bpEl = fixture.debugElement.query(By.css('box-plot'));
        expect(bpEl).toEqual(null);
    });

    it('should have the chart if we have a gene', () => {
        component.isEmptyGene = false;
        fixture.detectChanges();

        const bpEl = fixture.debugElement.query(By.css('box-plot'));
        expect(bpEl).toBeDefined();
    });

    it('should initialize the chart', fakeAsync(() => {
        const rcdSpy = spyOn(component, 'initData').and.callThrough();
        component.dataLoaded = false;
        component.initData();

        tick();
        fixture.detectChanges();
        expect(rcdSpy.calls.any()).toEqual(true);
        expect(chartService.filteredData).not.toEqual(null);
        expect(component.dataLoaded).toEqual(true);
    }));

    it('should get the dropdown icon string', () => {
        const gdiSpy = spyOn(component, 'getDropdownIcon').and.callThrough();
        const iconString = component.getDropdownIcon();

        expect(gdiSpy.calls.any()).toEqual(true);
        expect(iconString).toEqual('fa fa-caret-down');
    });
});
