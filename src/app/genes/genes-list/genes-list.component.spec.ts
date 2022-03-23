import {
    async,
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
    ActivatedRouteStub,
    ApiServiceStub,
    GeneServiceStub,
    NavigationServiceStub,
    mockInfo1,
    DataServiceStub
} from '../../testing';

import { GenesListComponent } from './genes-list.component';
import { MoreInfoComponent } from 'app/dialogs/more-info';
import { NOMinatedTargetComponent } from '../../dialogs/nt-dialog';

import { ApiService, GeneService, DataService, NavigationService } from '../../core/services';
import { GeneResponse } from 'app/models';

import { MockComponent } from 'ng-mocks';

import { of } from 'rxjs';

import { Table } from 'primeng/table';

describe('Component: GenesList', () => {
    let component: GenesListComponent;
    let fixture: ComponentFixture<GenesListComponent>;
    let apiService: ApiServiceStub;
    let geneService: GeneServiceStub;
    let dataService: DataServiceStub;
    let navService: NavigationServiceStub;
    let activatedRoute: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GenesListComponent,
                MockComponent(MoreInfoComponent),
                MockComponent(Table),
                MockComponent(NOMinatedTargetComponent)
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: ApiService, useValue: new ApiServiceStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                { provide: DataService, useValue: new DataServiceStub() },
                { provide: NavigationService, useValue: new NavigationServiceStub() },
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(GenesListComponent);

        // Get the injected instances
        apiService = fixture.debugElement.injector.get(ApiService);
        geneService = fixture.debugElement.injector.get(GeneService);
        dataService = fixture.debugElement.injector.get(DataService);
        navService = fixture.debugElement.injector.get(NavigationService);
        activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
        activatedRoute.setParamMap({ id: mockInfo1.ensembl_gene_id });

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a table', () => {
        const el = fixture.debugElement.query(By.css('p-table'));
        expect(el).toBeDefined();

        const aEl = fixture.debugElement.queryAll(By.css('p-table'));
        expect(aEl.length).toEqual(1);
    });

    it('should load the table', fakeAsync(() => {
        const res = { items: [mockInfo1] };

        const dsSpy = spyOn(apiService, 'getTableData').and.returnValue(
            of(res)
        );
        spyOn(component, 'ngOnInit').and.callThrough(); // mock event object to load the table
        fixture.detectChanges();
        tick(1);
        expect(component.dataSource).toEqual(res.items);
        expect(dsSpy.calls.any()).toEqual(true);
    }));

    it('should get the gene if we don\'t have one', fakeAsync(() => {
        const dsSpy = spyOn(apiService, 'getGene').and.returnValue(
            of(mockInfo1)
        );
        const gcgSpy = spyOn(geneService, 'getCurrentGene').and.returnValue(
            null
        );
        spyOn(navService.testRouter, 'navigate').and.callThrough();

        component.onRowSelect({ data: mockInfo1 }); // trigger click on row
        tick();
        fixture.detectChanges();
        expect(gcgSpy.calls.any()).toEqual(true);
        expect(component.selectedInfo).toEqual(mockInfo1);
        expect(dsSpy.calls.any()).toEqual(true);

        expect(navService.testRouter.navigate).toHaveBeenCalled();
    }));

    it('should tell ROUTER to navigate when selecting gene', fakeAsync(() => {
        const dsSpy = spyOn(apiService, 'getGene').and.returnValue(
            of(mockInfo1)
        );
        spyOn(navService.testRouter, 'navigate').and.callThrough();

        component.onRowSelect({ data: mockInfo1 }); // trigger click on row
        tick();
        fixture.detectChanges();
        expect(component.selectedInfo).toEqual(mockInfo1);
        expect(dsSpy.calls.any()).toEqual(true);

        expect(navService.testRouter.navigate).toHaveBeenCalled();
    }));

    it('should redirect when getting invalid gene', fakeAsync(() => {
        const ggSpy = spyOn(apiService, 'getGene').and.returnValue(
            of({ item: null })
        );
        spyOn(navService.testRouter, 'navigate').and.callThrough();

        component.selectedInfo = mockInfo1;
        apiService.getGene('ENSG00000128564').subscribe((data: GeneResponse) => {
            expect(data.item).toEqual(null);
        }); // search an empty gene id
        component.getGene('ENSG00000128564');
        tick();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(navService.testRouter.navigate).toHaveBeenCalledWith(['/genes']);
        });

        expect(ggSpy.calls.any()).toEqual(true);
    }));

    it('should unselect gene', fakeAsync(() => {
        const gsSpy = spyOn(geneService, 'setCurrentGene');

        component.ngOnInit();
        fixture.detectChanges();
        component.onRowUnselect({ data: mockInfo1 }); // trigger click on row
        fixture.detectChanges();
        expect(gsSpy.calls.any()).toEqual(true);
    }));

    it('should have extra info component', () => {
        const el = fixture.debugElement.query(By.css('more-info'));
        expect(el).toBeDefined();

        // When using ng-mocks, we need to pick the component instance,
        // pass in the input value so we can assert it after
        const ci = el.componentInstance as MoreInfoComponent;
        ci.name = 'nt';
        fixture.detectChanges();
        expect(ci.name).toEqual('nt');

        const aEl = fixture.debugElement.queryAll(By.css('more-info'));
        expect(aEl.length).toEqual(1);
    });
});
