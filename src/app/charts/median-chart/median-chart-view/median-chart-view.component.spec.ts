import {
    async,
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import {
    RouterStub,
    GeneServiceStub,
    DataServiceStub,
    ChartServiceStub,
    mockInfo1
} from '../../../testing';

import { MedianChartViewComponent } from './median-chart-view.component';

import { GeneService, DataService } from '../../../core/services';
import { ChartService } from '../../services';

import { of, empty, Observable } from 'rxjs';

import { MockComponent } from 'ng-mocks';

describe('Component: MedianChartView', () => {
    let component: MedianChartViewComponent;
    let fixture: ComponentFixture<MedianChartViewComponent>;
    let router: RouterStub;
    let geneService: GeneServiceStub;
    let chartService: ChartServiceStub;
    let dataService: DataServiceStub;
    const locationStub: any = jasmine.createSpyObj('location', ['back', 'subscribe']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                MedianChartViewComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: DataService, useValue: new DataServiceStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                { provide: ChartService, useValue: new ChartServiceStub() },
                { provide: Location, useValue: locationStub }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(MedianChartViewComponent);

        // Get the injected instances
        router = fixture.debugElement.injector.get(Router);
        geneService = fixture.debugElement.injector.get(GeneService);
        dataService = fixture.debugElement.injector.get(DataService);
        chartService = fixture.debugElement.injector.get(ChartService);

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call init if the statistical model was already selected', () => {
        const oiSpy = spyOn(component, 'ngOnInit').and.callThrough();
        const icSpy = spyOn(component, 'initChart').and.callThrough();
        component.geneinfo = mockInfo1;
        chartService.chartsReadySource.next(true);

        component.ngOnInit();
        fixture.detectChanges();
        expect(oiSpy).toHaveBeenCalled();
        expect(icSpy).toHaveBeenCalled();
    });
});
