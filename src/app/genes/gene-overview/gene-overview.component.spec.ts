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
    let navService: NavigationServiceStub;
    let activatedRoute: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GeneOverviewComponent,
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
                { provide: NavigationService, useValue: new NavigationServiceStub() }
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
        navService = fixture.debugElement.injector.get(NavigationService);
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

    it('should activate the mobile menu', fakeAsync(() => {
        const ammSpy = spyOn(component, 'activateMobileMenu').and.callThrough();
        component.dataLoaded = true;
        component.mobileOpen = false;
        component.showDesktopMenu = false;
        component.showMobileMenu = true;
        tick();
        fixture.detectChanges();
        component.activateMobileMenu();

        expect(component.mobileOpen).toEqual(true);
        expect(ammSpy.calls.any()).toEqual(true);
    }));

    it('should activate the menu with all cases', fakeAsync(() => {
        const amSpy = spyOn(component, 'activateMenu').and.callThrough();
        const gtiSpy = spyOn(navService, 'getOvMenuTabIndex').and.callThrough();
        const stiSpy = spyOn(navService, 'setOvMenuTabIndex').and.callThrough();
        component.dataLoaded = true;
        component.neverActivated = true;
        component.disableMenu = false;
        component.populateTabMenu();
        component.menu.activeItem = null;

        tick();
        fixture.detectChanges();
        component.activateMenu(null);
        // No disabled property in this following test
        expect(component.activeItem).toEqual({label: component.getFirstMenuTabName()});
        expect(component.activeItem.label).toEqual(component.getFirstMenuTabName());
        expect(navService.getOvMenuTabIndex()).toEqual(0);

        component.menu.activeItem = null;
        component.activateMenu({target: {textContent: 'SUMMARY'}});
        expect(component.activeItem).toEqual({label: 'SUMMARY'});
        expect(component.activeItem.label).toEqual('SUMMARY');
        expect(navService.getOvMenuTabIndex()).toEqual(1);

        component.menu.activeItem = null;
        component.activateMenu({target: {textContent: 'EVIDENCE'}});
        expect(component.activeItem).toEqual({label: 'EVIDENCE'});
        expect(component.activeItem.label).toEqual('EVIDENCE');
        expect(navService.getOvMenuTabIndex()).toEqual(2);

        component.menu.activeItem = null;
        component.activateMenu({target: {textContent: 'DRUGGABILITY'}});
        expect(component.activeItem).toEqual({label: 'DRUGGABILITY'});
        expect(component.activeItem.label).toEqual('DRUGGABILITY');
        expect(navService.getOvMenuTabIndex()).toEqual(3);

        component.menu.activeItem = null;
        component.activateMenu({target: {textContent: 'TEST'}});
        expect(component.activeItem).toEqual({label: 'TEST'});
        expect(component.activeItem.label).toEqual('TEST');
        expect(navService.getOvMenuTabIndex()).toEqual(0);

        expect(amSpy.calls.any()).toEqual(true);
        expect(gtiSpy.calls.any()).toEqual(true);
        expect(stiSpy.calls.any()).toEqual(true);
    }));

    it('should show the loading component while loading', fakeAsync(() => {
        component.dataLoaded = false;
        tick();
        fixture.detectChanges();

        const el = fixture.debugElement.query(By.css('loading-page'));
        expect(el).toBeDefined();

        const aEl = fixture.debugElement.queryAll(By.css('loading-page'));
        expect(aEl.length).toEqual(1);
    }));

    it('should show the gene full information if we have the gene info', fakeAsync(() => {
        component.geneInfo = mockInfo1;
        tick();
        fixture.detectChanges();

        const el = fixture.debugElement.query(By.css('.go-info-header'));
        expect(el).toBeDefined();

        const aEl = fixture.debugElement.queryAll(By.css('.go-info-header'));
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
