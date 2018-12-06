import {
    async,
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
    RouterStub,
    GeneServiceStub,
    DataServiceStub,
    ChartServiceStub,
    ActivatedRouteStub,
    ApiServiceStub,
    mockInfo1
} from '../../../testing';

import { SelectMenuViewComponent } from './select-menu-view.component';

import { GeneService, DataService, ApiService } from '../../../core/services';
import { ChartService } from '../../services';

import { of, empty, Observable } from 'rxjs';

import { MockComponent } from 'ng-mocks';

describe('Component: SelectMenuView', () => {
    let component: SelectMenuViewComponent;
    let fixture: ComponentFixture<SelectMenuViewComponent>;
    let router: RouterStub;
    let geneService: GeneServiceStub;
    let chartService: ChartServiceStub;
    let dataService: DataServiceStub;
    let apiService: ApiServiceStub;
    let activatedRoute: any;
    const locationStub: any = jasmine.createSpyObj('location', ['back', 'subscribe']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SelectMenuViewComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: ApiService, useValue: new ApiServiceStub() },
                { provide: DataService, useValue: new DataServiceStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                { provide: ChartService, useValue: new ChartServiceStub() },
                { provide: Location, useValue: locationStub }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(SelectMenuViewComponent);

        // Get the injected instances
        router = fixture.debugElement.injector.get(Router);
        apiService = fixture.debugElement.injector.get(ApiService);
        geneService = fixture.debugElement.injector.get(GeneService);
        dataService = fixture.debugElement.injector.get(DataService);
        chartService = fixture.debugElement.injector.get(ChartService);
        activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
        activatedRoute.setParamMap({ id: mockInfo1.hgnc_symbol });

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call init if a label is present', () => {
        const oiSpy = spyOn(component, 'ngOnInit').and.callThrough();
        const icSpy = spyOn(component, 'initChart').and.callThrough();

        expect(component.label).not.toBe('select-menu');
        component.ngOnInit();
        fixture.detectChanges();
        expect(oiSpy).toHaveBeenCalled();
        component.label = 'select-menu';

        component.ngOnInit();
        fixture.detectChanges();

        expect(oiSpy).toHaveBeenCalled();
        expect(icSpy).toHaveBeenCalled();
    });
});
