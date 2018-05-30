import {
    async,
    ComponentFixture,
    TestBed,
    inject,
    fakeAsync,
    tick
} from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { routes } from '../genes-routing.module';

import {
    ActivatedRouteStub,
    RouterStub,
    RouterOutletStubComponent,
    RouterLinkStubDirective,
    DataServiceStub,
    GeneServiceStub,
    mockGene1
} from '../../../app/testing';

import { Gene } from '../../models';

import { GenesListComponent } from './genes-list.component';

import { DataService, GeneService } from '../../core/services';

import { Observable } from 'rxjs/Observable';

describe('Component: GenesList', () => {
    let component: GenesListComponent;
    let fixture: ComponentFixture<GenesListComponent>;
    let router: RouterStub;
    let location: any;
    let dataService: DataServiceStub;
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
        activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
        activatedRoute.setParamMap({ id: mockGene1.hgnc_symbol });

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should tell ROUTER to navigate when selecting gene', fakeAsync(() => {
        const dsSpy = spyOn(dataService, 'getGene').and.returnValue(
            Observable.of(mockGene1)
        );

        spyOn(router, 'navigate').and.callThrough();

        component.onRowSelect({ data: mockGene1 }); // trigger click on row
        fixture.detectChanges();
        expect(component.selectedGene).toEqual(mockGene1);
        expect(dsSpy.calls.any()).toEqual(true);

        // Expecting to navigate to hgnc_symbol of the selected gene
        expect(router.navigate).toHaveBeenCalledWith(
            [
                '../gene-details',
                component.selectedGene.hgnc_symbol
            ],
            { relativeTo: activatedRoute }
        );
    }));

    it ('goBack() function test', () => {
        component.goBack();
        expect(location.back).toHaveBeenCalled();
    });
});
