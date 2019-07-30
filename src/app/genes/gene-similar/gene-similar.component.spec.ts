import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import {
    ApiServiceStub,
    RouterStub,
    ForceServiceStub,
    GeneServiceStub,
    DataServiceStub,
    mockGene1,
    mockInfo1,
    NavigationServiceStub,
    emptyGene
} from '../../testing';

import { GeneSimilarComponent } from './gene-similar.component';

import { MoreInfoComponent } from 'app/dialogs/more-info';

import {
    ApiService,
    NavigationService,
    ForceService,
    GeneService,
    DataService
} from '../../core/services';

import { MockComponent } from 'ng-mocks';

import { of } from 'rxjs';

import { Table } from 'primeng/table';

describe('Component: GeneSimilar', () => {
    let component: GeneSimilarComponent;
    let fixture: ComponentFixture<GeneSimilarComponent>;
    let router: RouterStub;
    let apiService: ApiServiceStub;
    let dataService: DataServiceStub;
    let navService: NavigationServiceStub;
    let forceService: ForceServiceStub;
    let geneService: GeneServiceStub;
    const locationStub: any = jasmine.createSpyObj('location', ['back', 'subscribe']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GeneSimilarComponent,
                MockComponent(MoreInfoComponent),
                MockComponent(Table)
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: ApiService, useValue: new ApiServiceStub() },
                { provide: NavigationService, useValue: new NavigationServiceStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                { provide: DataService, useValue: new DataServiceStub() },
                { provide: ForceService, useValue: new ForceServiceStub() },
                { provide: Location, useValue: locationStub }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(GeneSimilarComponent);

        // Get the injected instances
        router = fixture.debugElement.injector.get(Router);
        apiService = fixture.debugElement.injector.get(ApiService);
        navService = fixture.debugElement.injector.get(NavigationService);
        forceService = fixture.debugElement.injector.get(ForceService);
        dataService = fixture.debugElement.injector.get(DataService);
        geneService = fixture.debugElement.injector.get(GeneService);

        component = fixture.componentInstance; // Component test instance

        component.geneInfo = mockInfo1;
        component.gene = mockGene1;
        fixture.detectChanges();
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

    it('should have extra info component', () => {
        const el = fixture.debugElement.query(By.css('more-info'));
        expect(el).toBeDefined();

        // When using ng-mocks, we need to pick the component instance,
        // pass in the input value so we can assert it after
        const ci = el.componentInstance as MoreInfoComponent;
        ci.name = 'sp';
        fixture.detectChanges();
        expect(ci.name).toEqual('sp');

        const aEl = fixture.debugElement.queryAll(By.css('more-info'));
        expect(aEl.length).toEqual(1);
    });

    it('should get data if we don\'t have the gene or gene info', () => {
        const gcgSpy = spyOn(geneService, 'getCurrentGene').and.callThrough();
        const gciSpy = spyOn(geneService, 'getCurrentInfo').and.callThrough();
        const giSpy = spyOn(navService, 'getId').and.callThrough();

        component.gene = null;
        component.geneInfo = null;
        component.id = null;
        component.ngOnInit();
        fixture.detectChanges();

        expect(gcgSpy.calls.any()).toEqual(true);
        expect(gciSpy.calls.any()).toEqual(true);
        expect(giSpy.calls.any()).toEqual(true);
    });
});
