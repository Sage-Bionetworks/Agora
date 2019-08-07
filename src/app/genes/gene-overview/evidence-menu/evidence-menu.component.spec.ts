import {
    async,
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TitleCasePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import {
    ChartServiceStub,
    NavigationServiceStub,
    GeneServiceStub
} from '../../../testing';

import { EvidenceMenuComponent } from './evidence-menu.component';

import { GeneService, NavigationService } from '../../../core/services';
import { ChartService } from '../../../charts/services';

import { TabMenu } from 'primeng/tabmenu';

import { MockComponent } from 'ng-mocks';

describe('Component: EvidenceMenu', () => {
    let component: EvidenceMenuComponent;
    let fixture: ComponentFixture<EvidenceMenuComponent>;
    let geneService: GeneServiceStub;
    let chartService: ChartServiceStub;
    let navService: NavigationServiceStub;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                EvidenceMenuComponent,
                MockComponent(TabMenu)
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: ChartService, useValue: new ChartServiceStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                { provide: NavigationService, useValue: new NavigationServiceStub() },
                TitleCasePipe
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(EvidenceMenuComponent);

        // Get the injected instances
        geneService = fixture.debugElement.injector.get(GeneService);
        chartService = fixture.debugElement.injector.get(ChartService);
        navService = fixture.debugElement.injector.get(NavigationService);

        component = fixture.componentInstance; // Component test instance

        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a tab menu element for desktop', fakeAsync(() => {
        tick();
        fixture.detectChanges();
        const el = fixture.debugElement.query(By.css('p-tabMenu'));
        expect(el).toBeDefined();

        const aEl = fixture.debugElement.queryAll(By.css('p-tabMenu'));
        expect(aEl.length).toEqual(1);
    }));

    it('should activate the menu with all cases', fakeAsync(() => {
        const amSpy = spyOn(component, 'activateMenu').and.callThrough();
        const gtiSpy = spyOn(navService, 'getEvidenceMenuTabIndex').and.callThrough();
        const stiSpy = spyOn(navService, 'setEvidenceMenuTabIndex').and.callThrough();
        component.neverActivated = true;
        component.disableMenu = false;
        component.ngOnInit();
        component.menu.activeItem = null;

        tick();
        fixture.detectChanges();
        component.activateMenu(null);
        // No disabled property in this following test
        expect(component.activeItem).toEqual({label: 'RNA', disabled: false});
        expect(component.activeItem.label).toEqual('RNA');
        expect(navService.getEvidenceMenuTabIndex()).toEqual(0);

        component.menu.activeItem = null;
        component.activateMenu({target: {textContent: 'Protein', disabled: false}});
        expect(component.activeItem).toEqual({label: 'Protein', disabled: false});
        expect(component.activeItem.label).toEqual('Protein');
        expect(navService.getEvidenceMenuTabIndex()).toEqual(1);

        component.menu.activeItem = null;
        component.activateMenu({target: {textContent: 'Metabolomics', disabled: false}});
        expect(component.activeItem).toEqual({label: 'Metabolomics', disabled: false});
        expect(component.activeItem.label).toEqual('Metabolomics');
        expect(navService.getEvidenceMenuTabIndex()).toEqual(2);

        component.menu.activeItem = null;
        component.activateMenu({target: {textContent: 'TEST', disabled: false}});
        expect(component.activeItem).toEqual({label: 'TEST', disabled: false});
        expect(component.activeItem.label).toEqual('TEST');
        expect(navService.getEvidenceMenuTabIndex()).toEqual(0);

        expect(amSpy.calls.any()).toEqual(true);
        expect(gtiSpy.calls.any()).toEqual(true);
        expect(stiSpy.calls.any()).toEqual(true);
    }));
});
