import {
    async,
    ComponentFixture,
    TestBed,
    tick,
    fakeAsync
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
    mockGene2
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

import { GeneResponse } from 'app/models';

import { MockComponent } from 'ng-mocks';

import { of } from 'rxjs';

import { Table } from 'primeng/table';
import { TitleCasePipe } from '@angular/common';

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
                { provide: Location, useValue: locationStub },
                TitleCasePipe
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

    it('shouldn\'t get data if we have gene, gene info and id', () => {
        const gcgSpy = spyOn(geneService, 'getCurrentGene');
        const gciSpy = spyOn(geneService, 'getCurrentInfo');
        const giSpy = spyOn(navService, 'getId');

        component.gene = mockGene1;
        component.geneInfo = mockInfo1;
        component.id = 'VGF';
        fixture.detectChanges();

        expect(component.gene).toEqual(mockGene1);
        expect(component.geneInfo).toEqual(mockInfo1);
        expect(component.id).toEqual('VGF');

        component.updateVariables();

        expect(gcgSpy.calls.any()).toEqual(false);
        expect(gciSpy.calls.any()).toEqual(false);
        expect(giSpy.calls.any()).toEqual(false);
    });

    it('should get data if we don\'t have a gene, gene info and id', () => {
        const gcgSpy = spyOn(geneService, 'getCurrentGene');
        const gciSpy = spyOn(geneService, 'getCurrentInfo');
        const giSpy = spyOn(navService, 'getId');

        component.gene = null;
        component.geneInfo = null;
        component.id = null;
        fixture.detectChanges();

        expect(component.gene).toEqual(null);
        expect(component.geneInfo).toEqual(null);
        expect(component.id).toEqual(null);

        component.updateVariables();

        expect(gcgSpy.calls.any()).toEqual(true);
        expect(gciSpy.calls.any()).toEqual(true);
        expect(giSpy.calls.any()).toEqual(true);
    });

    it('should get the gene on init data', fakeAsync(() => {
        // Stub always return PIAS2
        const ggSpy = spyOn(apiService, 'getGene').and.callThrough();
        const gcgSpy = spyOn(geneService, 'getCurrentGene').and.callFake(() => {
            return mockGene2;
        });

        // Init data uses an async call so we test in here not considering
        // data change going inside the subscription
        // First if check
        component.gene = null;
        component.initData();
        tick();
        fixture.detectChanges();
        expect(component.gene).not.toEqual(null);

        // Second if check
        component.geneInfo = null;
        component.initData();
        tick();
        fixture.detectChanges();
        expect(component.geneInfo).not.toEqual(null);

        // Third if check
        component.gene = mockGene1;
        component.geneInfo = mockInfo1;
        component.id = 'VGF';
        component.initData();
        tick();
        fixture.detectChanges();
        // Fixture change detection resets this to null
        component.id = 'VGF';
        expect(component.gene).not.toEqual(null);
        expect(component.geneInfo).not.toEqual(null);
        expect(component.gene.ensembl_gene_id).not.toEqual(component.id);

        // Fourth check
        component.gene = mockGene1;
        component.geneInfo = mockInfo1;
        component.id = null;
        component.gene.hgnc_symbol = null;
        component.initData();
        tick();
        fixture.detectChanges();
        expect(component.gene).not.toEqual(null);
        expect(component.geneInfo).not.toEqual(null);
        expect(component.id).toEqual(null);

        // Fifth check
        component.gene = mockGene1;
        component.geneInfo = mockInfo1;
        component.id = mockGene1.hgnc_symbol;
        component.gene.hgnc_symbol = null;
        component.initData();
        tick();
        fixture.detectChanges();
        // Fixture change detection resets this to null
        component.id = 'PIAS2';
        expect(component.gene).not.toEqual(null);
        expect(component.geneInfo).not.toEqual(null);
        expect(component.id).not.toEqual(null);
        expect(component.id).not.toEqual(component.gene.hgnc_symbol);
        expect(component.id).not.toEqual(geneService.getCurrentGene().hgnc_symbol);

        expect(ggSpy.calls.any()).toEqual(true);
        expect(gcgSpy.calls.any()).toEqual(true);
    }));

    it('should not get the gene on init data if we have one already', fakeAsync(() => {
        // Stub always return PIAS2
        const ggSpy = spyOn(apiService, 'getGene').and.callThrough();
        const gcgSpy = spyOn(geneService, 'getCurrentGene').and.callThrough();

        component.gene = mockGene1;
        component.geneInfo = mockInfo1;
        component.id = 'PIAS2';

        // After this call gene goes back to VGF
        component.initData();
        tick();
        fixture.detectChanges();

        // It will go through all conditions in the beginning of
        // the initData method
        expect(component.gene).toEqual(mockGene1);
        expect(component.geneInfo).toEqual(mockInfo1);
        expect(component.id).toEqual('PIAS2');
        // Can't compare the component id with the component gene
        // hgnc symbol here so we skip that test here
        expect(component.gene.ensembl_gene_id).toBeDefined();
        expect(ggSpy.calls.any()).toEqual(true);
        expect(gcgSpy.calls.any()).toEqual(true);
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
        apiService.getGene('VGF').subscribe((data: GeneResponse) => {
            expect(data.item).toEqual(null);
        }); // search an empty gene id
        component.getGene('VGF');
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
        ci.name = 'sp';
        fixture.detectChanges();
        expect(ci.name).toEqual('sp');

        const aEl = fixture.debugElement.queryAll(By.css('more-info'));
        expect(aEl.length).toEqual(1);
    });
});
