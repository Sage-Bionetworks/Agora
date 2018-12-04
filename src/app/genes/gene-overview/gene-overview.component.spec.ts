import {
    async,
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

import {
    ApiServiceStub,
    ActivatedRouteStub,
    RouterStub,
    DataServiceStub,
    ForceServiceStub,
    GeneServiceStub,
    NavigationServiceStub,
    mockInfo1
} from '../../testing';

import { GeneOverviewComponent } from './gene-overview.component';
import { LoadingComponent } from '../../shared/components/loading';

import {
    ApiService,
    DataService,
    ForceService,
    GeneService,
    NavigationService
} from '../../core/services';

import { TabMenu } from 'primeng/tabmenu';

import { MockComponent } from 'ng-mocks';

describe('Component: GeneOverview', () => {
    let component: GeneOverviewComponent;
    let fixture: ComponentFixture<GeneOverviewComponent>;
    let router: RouterStub;
    let apiService: ApiServiceStub;
    let geneService: GeneServiceStub;
    let dataService: DataServiceStub;
    let forceService: ForceServiceStub;
    let activatedRoute: any;
    const locationStub: any = jasmine.createSpyObj('location', ['back', 'subscribe']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GeneOverviewComponent,
                MockComponent(GeneOverviewComponent),
                MockComponent(TabMenu),
                MockComponent(LoadingComponent)
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: ApiService, useValue: new ApiServiceStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: DataService, useValue: new DataServiceStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                { provide: ForceService, useValue: new ForceServiceStub() },
                { provide: NavigationService, useValue: new NavigationServiceStub() },
                { provide: Location, useValue: locationStub }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(GeneOverviewComponent);

        // Get the injected instances
        router = fixture.debugElement.injector.get(Router);
        apiService = fixture.debugElement.injector.get(ApiService);
        geneService = fixture.debugElement.injector.get(GeneService);
        dataService = fixture.debugElement.injector.get(DataService);
        forceService = fixture.debugElement.injector.get(ForceService);
        activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
        activatedRoute.setParamMap({ id: mockInfo1.hgnc_symbol });

        component = fixture.componentInstance; // Component test instance

        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should save the loaded genes state', fakeAsync(() => {
        const dsSpy = spyOn(dataService, 'loadGenes').and.callFake(() =>
            Promise.resolve(true)
        );

        component.items = [
            { label: 'NOMINATION DETAILS', disabled: this.disableMenu },
            { label: 'SUMMARY', disabled: this.disableMenu },
            { label: 'EVIDENCE',
                disabled: this.disableMenu,
                items: [
                    {
                        label: 'RNA'
                    },
                    {
                        label: 'Protein'
                    },
                    {
                        label: 'Metabolomics'
                    },
                    {
                        label: 'Single Cell RNA-Seq'
                    },
                    {
                        label: 'Genomic'
                    }
            ]
            },
            { label: 'DRUGGABILITY', disabled: this.disableMenu }
        ];

        spyOn(component, 'initDetails').and.callThrough();
        const hgcSpy = spyOn(geneService, 'hasGeneChanged');
        hgcSpy.and.callFake(() => {
            return true;
        });
        component.initDetails();
        tick(500);

        fixture.detectChanges();
        expect(component.dataLoaded).toEqual(true);
        expect(dsSpy.calls.any()).toEqual(true);

        component.dataLoaded = false;
        fixture.detectChanges();
        expect(component.dataLoaded).toEqual(false);

        hgcSpy.and.callFake(() => {
            return false;
        });
        component.initDetails();
        tick(500);

        fixture.detectChanges();
        expect(component.dataLoaded).toEqual(true);
        expect(dsSpy.calls.count()).toEqual(1);
    }));

    it('should have a tab menu element for desktop', fakeAsync(() => {
        component.dataLoaded = true;
        component.showDesktopMenu = true;
        component.showMobileMenu = false;
        tick();
        fixture.detectChanges();
        const el = fixture.debugElement.query(By.css('p-tabMenu'));
        expect(el).toBeDefined();

        const aEl = fixture.debugElement.queryAll(By.css('p-tabMenu'));
        expect(aEl.length).toEqual(1);
    }));

    it('should have a tab menu element for mobile', fakeAsync(() => {
        component.dataLoaded = true;
        component.showDesktopMenu = false;
        component.showMobileMenu = true;
        tick();
        fixture.detectChanges();
        const el = fixture.debugElement.query(By.css('p-tabMenu'));
        expect(el).toBeDefined();

        const aEl = fixture.debugElement.queryAll(By.css('p-tabMenu'));
        expect(aEl.length).toEqual(1);
    }));

    it('should show the loading component while loading', fakeAsync(() => {
        component.dataLoaded = false;
        tick();
        fixture.detectChanges();

        const el = fixture.debugElement.query(By.css('loading'));
        expect(el).toBeDefined();

        const aEl = fixture.debugElement.queryAll(By.css('loading'));
        expect(aEl.length).toEqual(1);
    }));

    it('should show the gene full information if we have the gene info', fakeAsync(() => {
        component.geneInfo = mockInfo1;
        tick();
        fixture.detectChanges();

        const el = fixture.debugElement.query(By.css('.info-header'));
        expect(el).toBeDefined();

        const aEl = fixture.debugElement.queryAll(By.css('.info-header'));
        expect(aEl.length).toEqual(1);

        const dEl = fixture.debugElement.query(By.css('.overview-desc'));
        expect(dEl).toBeDefined();

        const dAEl = fixture.debugElement.queryAll(By.css('.overview-desc'));
        expect(dAEl.length).toEqual(1);
    }));

    it('update the menu variables depending on window size', fakeAsync(() => {
        component.showDesktopMenu = true;
        component.showMobileMenu = false;
        let width = 800;
        const rSpy = spyOn(component, 'updateVars').and.callThrough();
        const wSpy = spyOnProperty(window, 'innerWidth').and.returnValue(width);

        component.updateVars();
        tick();
        fixture.detectChanges();
        expect(window.innerWidth).toEqual(width);
        expect(component.showMobileMenu).toEqual(false);
        expect(component.showDesktopMenu).toEqual(true);

        width = 500;
        wSpy.and.returnValue(width);

        tick();
        fixture.detectChanges();
        expect(window.innerWidth).toEqual(width);
        component.updateVars();
        tick();
        fixture.detectChanges();
        expect(component.showMobileMenu).toEqual(true);
        expect(component.showDesktopMenu).toEqual(false);

        expect(wSpy.calls.any()).toEqual(true);
        expect(rSpy.calls.any()).toEqual(true);
    }));
});
