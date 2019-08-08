import {
    async,
    ComponentFixture,
    TestBed,
    tick,
    fakeAsync
} from '@angular/core/testing';
import { SpyLocation } from '@angular/common/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import {
    ApiServiceStub,
    RouterStub,
    ChartServiceStub,
    GeneServiceStub
} from '../../../../../testing';

import { GeneRNASeqDEComponent } from './gene-rnaseq-de.component';

import { MoreInfoComponent } from 'app/dialogs/more-info';

import {
    ApiService,
    GeneService
} from '../../../../../core/services';

import { ChartService } from '../../../../../charts/services';

import { MockComponent } from 'ng-mocks';

import { ArraySortPipe } from '../../../../../shared/pipes';

describe('Component: GeneRNASeqDE', () => {
    let component: GeneRNASeqDEComponent;
    let fixture: ComponentFixture<GeneRNASeqDEComponent>;
    let router: RouterStub;
    let apiService: ApiServiceStub;
    let chartService: ChartServiceStub;
    let geneService: GeneServiceStub;
    let location: SpyLocation;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GeneRNASeqDEComponent,
                MockComponent(MoreInfoComponent),
                ArraySortPipe
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: ApiService, useValue: new ApiServiceStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                { provide: ChartService, useValue: new ChartServiceStub() },
                { provide: SpyLocation, useValue: new SpyLocation() }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(GeneRNASeqDEComponent);

        // Get the injected instances
        router = fixture.debugElement.injector.get(Router);
        apiService = fixture.debugElement.injector.get(ApiService);
        geneService = fixture.debugElement.injector.get(GeneService);
        chartService = fixture.debugElement.injector.get(ChartService);
        location = fixture.debugElement.injector.get(SpyLocation);

        component = fixture.componentInstance; // Component test instance

        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not have charts after initial loading', () => {
        const bpEl = fixture.debugElement.query(By.css('box-plot'));
        expect(bpEl).toEqual(null);
        const rcEl = fixture.debugElement.query(By.css('row-chart'));
        expect(rcEl).toEqual(null);
        const mcEl = fixture.debugElement.query(By.css('median-chart'));
        expect(mcEl).toEqual(null);
        const smEl = fixture.debugElement.query(By.css('select-menu'));
        expect(smEl).toEqual(null);
    });

    it('should have all charts if we have a gene', () => {
        component.isEmptyGene = false;
        fixture.detectChanges();

        const bpEl = fixture.debugElement.query(By.css('box-plot'));
        expect(bpEl).toBeDefined();
        const rcEl = fixture.debugElement.query(By.css('row-chart'));
        expect(rcEl).toBeDefined();
        const mcEl = fixture.debugElement.query(By.css('median-chart'));
        expect(mcEl).toBeDefined();
        const smEl = fixture.debugElement.query(By.css('select-menu'));
        expect(smEl).toBeDefined();
    });

    it('should have extra info component', () => {
        component.dataLoaded = true;
        fixture.detectChanges();

        const el = fixture.debugElement.query(By.css('more-info'));
        expect(el).toBeDefined();

        // When using ng-mocks, we need to pick the component instance,
        // pass in the input value so we can assert it after
        const ci = el.componentInstance as MoreInfoComponent;
        ci.name = 'bp';
        fixture.detectChanges();
        expect(ci.name).toEqual('bp');

        const aEl = fixture.debugElement.queryAll(By.css('more-info'));
        expect(aEl.length).toEqual(1);
    });

    it('should refresh the charts data', fakeAsync(() => {
        const rcdSpy = spyOn(component, 'refreshChartsData').and.callThrough();
        component.dataLoaded = false;
        component.refreshChartsData();

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
