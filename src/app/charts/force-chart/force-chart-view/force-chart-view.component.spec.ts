import {
    async,
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
    flush,
    discardPeriodicTasks
} from '@angular/core/testing';
import { SpyLocation } from '@angular/common/testing';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import {
    RouterStub,
    GeneServiceStub,
    MockElementRef,
    mockGene1
} from '../../../testing';

import { ForceChartViewComponent } from './force-chart-view.component';

import { GeneNetwork, GeneLink } from 'app/models';

import { GeneService } from '../../../core/services';

import * as d3 from 'd3';

describe('Component: ForceChartView', () => {
    let component: ForceChartViewComponent;
    let fixture: ComponentFixture<ForceChartViewComponent>;
    let router: RouterStub;
    let geneService: GeneServiceStub;
    let location: SpyLocation;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ForceChartViewComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                { provide: SpyLocation, useValue: new SpyLocation() },
                { provide: ElementRef, useClass: MockElementRef }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(ForceChartViewComponent);

        // Get the injected instances
        router = fixture.debugElement.injector.get(Router);
        geneService = fixture.debugElement.injector.get(GeneService);
        location = fixture.debugElement.injector.get(SpyLocation);

        component = fixture.componentInstance; // Component test instance

        const parent = document.createElement('div');
        const child = document.createElement('div');
        const mockNode1 = {
            brainregions: ['CBE', 'DLPFC', 'FP', 'IFG', 'PHG', 'STG', 'TCX'],
            ensembl_gene_id: 'ENSG00000128564',
            group: 38,
            hgnc_symbol: 'VGF',
            id: 'ENSG00000128564',
            index: 0,
            vx: 0.6383193392459895,
            vy: -4.464810585759529,
            x: 365.1162545134067,
            y: 609.1416686229836
        };
        const mockNode2 = {
            brainregions: ['DLPFC'],
            ensembl_gene_id: 'ENSG00000169436',
            group: 2,
            hgnc_symbol: 'COL22A1',
            id: 'ENSG00000169436',
            index: 1,
            vx: 0.6383193392459895,
            vy: -4.464810585759529,
            x: 365.1162545134067,
            y: 609.1416686229836
        };
        parent.appendChild(child);

        component.networkData = {
            filterLvl: 5,
            nodes: [mockNode1, mockNode2],
            links: [
                {
                    brainregions: ['DLPFC'],
                    geneIdA: 'VGF',
                    geneIdB: 'COL22A1',
                    source: mockNode1,
                    target: mockNode2,
                    value: 1
                } as GeneLink
            ],
            origin: mockGene1
        } as GeneNetwork;
        component.forceChart = new ElementRef(child);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should remove chart on navigation start', () => {
        const rsSpy = spyOn(component, 'removeSelf').and.callThrough();
        const rnSpy = spyOn(router, 'navigate').and.callThrough();
        router.events = router.asObs;
        component.ngOnInit();
        router.navigate(['/']);
        expect(rsSpy).toHaveBeenCalled();
        expect(rnSpy).toHaveBeenCalled();
    });

    it('should remove chart on location pop state', () => {
        const rsSpy = spyOn(component, 'removeSelf').and.callThrough();
        location.subscribe((value: any) => {
            // Since onPopState from PlatformLocation is not triggered
            // we manually remove the charts if we receive a popstate
            expect(value.type).toEqual('popstate');
            if (value.type === 'popstate') {
                component.removeSelf();
            }

            expect(rsSpy).toHaveBeenCalled();
        });
        location.simulateUrlPop('/genes');
    });

    // Use it as the last test
    it('should reset the simulation if we have one already', fakeAsync(() => {
        const rsSpy = spyOn(component, 'removeSelf').and.callThrough();
        const ngAISpy = spyOn(component, 'ngAfterViewInit').and.callThrough();
        const rcSpy = spyOn(component, 'renderChart').and.callThrough();

        component.loaded = true;
        fixture.detectChanges();

        setTimeout(() => {
            component.removeSelf();
            expect(component.textElements).toEqual([]);
            expect(component.nodeElements).toEqual([]);
            expect(component.linkElements).toEqual([]);
            expect(component.loaded).toEqual(false);
            expect(rsSpy.calls.any()).toEqual(true);
            expect(rcSpy.calls.any()).toEqual(true);
            expect(ngAISpy.calls.any()).toEqual(true);
            component.simulation.stop();
            discardPeriodicTasks();
        }, 300);

        tick(350);
        expect(component.simulation).not.toEqual(undefined);
    }));
});
