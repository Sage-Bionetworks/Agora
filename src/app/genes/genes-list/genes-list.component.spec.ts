import {
    async,
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
    ActivatedRouteStub,
    RouterStub,
    RouterOutletStubComponent,
    ApiServiceStub,
    GeneServiceStub,
    mockInfo1
} from '../../testing';

import { AboutComponent } from '../../core/about';
import { HelpComponent } from '../../core/help';
import { TermsComponent } from '../../core/terms';
import { ContribTeamsPageComponent } from '../../core/contrib-teams';
import { SynapseAccountComponent } from '../../core/synapse-account';
import { NoContentComponent } from '../../core/no-content';
import { GenesListComponent } from './genes-list.component';

import { ApiService, GeneService } from '../../core/services';
import { OrderBy } from '../../shared/pipes';

import { of } from 'rxjs';

describe('Component: GenesList', () => {
    let component: GenesListComponent;
    let fixture: ComponentFixture<GenesListComponent>;
    let router: RouterStub;
    let apiService: ApiServiceStub;
    let geneService: GeneServiceStub;
    let activatedRoute: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AboutComponent,
                HelpComponent,
                TermsComponent,
                ContribTeamsPageComponent,
                SynapseAccountComponent,
                NoContentComponent,
                GenesListComponent,
                RouterOutletStubComponent,
                OrderBy
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: ApiService, useValue: new ApiServiceStub() },
                { provide: GeneService, useValue: new GeneServiceStub() }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(GenesListComponent);

        // Get the injected instances
        router = fixture.debugElement.injector.get(Router);
        apiService = fixture.debugElement.injector.get(ApiService);
        geneService = fixture.debugElement.injector.get(GeneService);
        activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
        activatedRoute.setParamMap({ id: mockInfo1.hgnc_symbol });

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load the table', fakeAsync(() => {
        const res = { items: [mockInfo1] };

        const dsSpy = spyOn(apiService, 'getTableData').and.returnValue(
            of(res)
        );
        spyOn(component, 'ngOnInit').and.callThrough(); // mock event object to load the table
        fixture.detectChanges();
        tick(1);
        expect(component.datasource).toEqual(res.items);
        expect(dsSpy.calls.any()).toEqual(true);
    }));

    it('should tell ROUTER to navigate when selecting gene', fakeAsync(() => {
        const dsSpy = spyOn(apiService, 'getGene').and.returnValue(
            of(mockInfo1)
        );
        const spy = spyOn(router, 'navigate').and.callThrough();

        component.onRowSelect({ data: mockInfo1 }); // trigger click on row
        tick();
        fixture.detectChanges();
        expect(component.selectedInfo).toEqual(mockInfo1);
        expect(dsSpy.calls.any()).toEqual(true);

        expect(router.navigate).toHaveBeenCalled();

        // Expecting to navigate to hgnc_symbol of the selected gene
        /*expect(router.navigate).toHaveBeenCalledWith(
            [
                '../gene-details',
                component.selectedInfo.ensembl_gene_id
            ],
            { relativeTo: activatedRoute }
        );*/
    }));

    it('should unselect gene', fakeAsync(() => {
        const gsSpy = spyOn(geneService, 'setCurrentGene');

        component.onRowUnselect({ data: mockInfo1 }); // trigger click on row
        fixture.detectChanges();
        expect(gsSpy.calls.any()).toEqual(true);
    }));
});
