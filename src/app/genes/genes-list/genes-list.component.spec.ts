import {
    async,
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import {
    ActivatedRouteStub,
    RouterStub,
    RouterOutletStubComponent,
    DataServiceStub,
    GeneServiceStub,
    mockGene1
} from '../../../app/testing';

import { GenesListComponent } from './genes-list.component';

import { DataService, GeneService } from '../../core/services';

import { Observable } from 'rxjs/Observable';

describe('Component: GenesList', () => {
    let component: GenesListComponent;
    let fixture: ComponentFixture<GenesListComponent>;
    let router: RouterStub;
    let location: any;
    let dataService: DataServiceStub;
    let geneService: GeneServiceStub;
    let activatedRoute: any;
    const locationStub: any = jasmine.createSpyObj('location', ['back', 'subscribe']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GenesListComponent,
                RouterOutletStubComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: DataService, useValue: new DataServiceStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                { provide: Location, useValue: locationStub }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(GenesListComponent);

        // Get the injected instances
        router = fixture.debugElement.injector.get(Router);
        location = fixture.debugElement.injector.get(Location);
        dataService = fixture.debugElement.injector.get(DataService);
        geneService = fixture.debugElement.injector.get(GeneService);
        activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
        activatedRoute.setParamMap({ id: mockGene1.hgnc_symbol });

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load the table', fakeAsync(() => {
        const res = { items: [mockGene1] };
        const loadEvent = {
            filters: {},
            first: 0,
            globalFilter: null,
            multiSortMeta: undefined,
            rows: 14,
            sortField: undefined,
            sortOrder: 1
        };

        const dsSpy = spyOn(dataService, 'getTableData').and.returnValue(
            Observable.of(res)
        );
        spyOn(component, 'loadGenesLazy').and.callThrough(); // mock event object to load the table
        component.loadGenesLazy(loadEvent);
        fixture.detectChanges();
        tick(1);
        expect(component.datasource).toEqual(res.items);
        expect(dsSpy.calls.any()).toEqual(true);
    }));

    it('should tell ROUTER to navigate when selecting gene', fakeAsync(() => {
        const dsSpy = spyOn(dataService, 'getGene').and.returnValue(
            Observable.of(mockGene1)
        );
        spyOn(router, 'navigate').and.callThrough();

        component.onRowSelect({ data: mockGene1 }); // trigger click on row
        fixture.detectChanges();
        expect(component.selectedInfo).toEqual(mockGene1);
        expect(dsSpy.calls.any()).toEqual(true);

        // Expecting to navigate to hgnc_symbol of the selected gene
        expect(router.navigate).toHaveBeenCalledWith(
            [
                '../gene-details',
                component.selectedInfo.ensembl_gene_id
            ],
            { relativeTo: activatedRoute }
        );
    }));

    it('should unselect gene', fakeAsync(() => {
        const gsSpy = spyOn(geneService, 'setCurrentGene');

        component.onRowUnselect({ data: mockGene1 }); // trigger click on row
        fixture.detectChanges();
        expect(gsSpy.calls.any()).toEqual(true);
    }));

    it ('goBack() function test', () => {
        component.goBack();
        expect(location.back).toHaveBeenCalled();
    });
});
