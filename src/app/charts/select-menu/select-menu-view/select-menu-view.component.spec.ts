import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { SpyLocation } from '@angular/common/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
    RouterStub,
    GeneServiceStub,
    ChartServiceStub,
    ActivatedRouteStub,
    ApiServiceStub,
    mockInfo1
} from '../../../testing';

import { SelectMenuViewComponent } from './select-menu-view.component';

import {
    GeneService,
    ApiService
} from '../../../core/services';
import { ChartService } from '../../services';

import * as d3 from 'd3';
import * as dc from 'dc';

describe('Component: SelectMenuView', () => {
    let component: SelectMenuViewComponent;
    let fixture: ComponentFixture<SelectMenuViewComponent>;
    let router: RouterStub;
    let geneService: GeneServiceStub;
    let chartService: ChartServiceStub;
    let apiService: ApiServiceStub;
    let activatedRoute: any;
    let location: SpyLocation;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SelectMenuViewComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: ApiService, useValue: new ApiServiceStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                { provide: ChartService, useValue: new ChartServiceStub() },
                { provide: SpyLocation, useValue: new SpyLocation() }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(SelectMenuViewComponent);

        // Get the injected instances
        router = fixture.debugElement.injector.get(Router);
        apiService = fixture.debugElement.injector.get(ApiService);
        geneService = fixture.debugElement.injector.get(GeneService);
        chartService = fixture.debugElement.injector.get(ChartService);
        activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
        activatedRoute.setParamMap({ id: mockInfo1.hgnc_symbol });
        location = fixture.debugElement.injector.get(SpyLocation);

        component = fixture.componentInstance; // Component test instance
        component.columnName = '';
        component.defaultValue = '';
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get label and call init if there is no label', () => {
        const oiSpy = spyOn(component, 'ngOnInit').and.callThrough();
        const icSpy = spyOn(component, 'initChart').and.callThrough();

        expect(component.label).not.toBe('select-menu');
        component.ngOnInit();
        fixture.detectChanges();
        expect(oiSpy).toHaveBeenCalled();
        expect(icSpy).toHaveBeenCalled();
    });

    it('should call init if a label is present', () => {
        const oiSpy = spyOn(component, 'ngOnInit').and.callThrough();
        const icSpy = spyOn(component, 'initChart').and.callThrough();

        component.label = 'select-menu';
        component.ngOnInit();
        fixture.detectChanges();

        expect(oiSpy).toHaveBeenCalled();
        expect(icSpy).toHaveBeenCalled();
    });

    it('should remove chart on navigation start', () => {
        const rsSpy = spyOn(component, 'removeSelf').and.callThrough();
        const rnSpy = spyOn(router, 'navigate').and.callThrough();
        router.events = router.asObs;
        component.ngOnInit();
        router.navigate(['/']);
        fixture.detectChanges();
        expect(rsSpy).toHaveBeenCalled();
        expect(rnSpy).toHaveBeenCalled();
    });

    it('should remove chart on location pop state', () => {
        const rsSpy = spyOn(component, 'removeSelf').and.callThrough();

        component.ngOnInit();
        location.subscribe((value: any) => {
            // Since onPopState from PlatformLocation is not triggered
            // we manually remove the charts if we receive a popstate
            expect(value.type).toEqual('popstate');
            if (value.type === 'popstate') {
                component.removeSelf();
            }

            expect(rsSpy).toHaveBeenCalled();
        });
        fixture.detectChanges();
        location.simulateUrlPop('/genes');
    });

    it('should not remove chart if there is no chart', () => {
        const csrcSpy = spyOn(chartService, 'removeChart').and.callThrough();
        const csrcnSpy = spyOn(chartService, 'removeChartName').and.callThrough();
        const gsspgSpy = spyOn(geneService, 'setPreviousGene').and.callThrough();
        const rcSpy = spyOn(component, 'removeChart').and.callThrough();
        component.chart = null;
        component.removeChart();
        fixture.detectChanges();
        expect(rcSpy).toHaveBeenCalled();
        expect(csrcSpy).not.toHaveBeenCalled();
        expect(csrcnSpy).not.toHaveBeenCalled();
        expect(gsspgSpy).not.toHaveBeenCalled();
    });

    // Two tests here not to copy this wall of text below
    it('should render the second select, and update the filter when a change occurs', async(() => {
        component.label = 'select-model';
        component.defaultValue = 'AD Diagnosis (males and females)';
        component.columnName = 'select-column-model';
        chartService.filteredData = [
            { key: 'AD Diagnosis (males and females)', value: 12 },
            { key: 'AD Diagnosis x AOD (males and females)', value: 0 },
            { key: 'AD Diagnosis x Sex (females only)', value: 0 },
            { key: 'AD Diagnosis x Sex (males only)', value: 0 }
        ];

        const smDim = {
            filter: (f, e) => {
                if (f) {
                    //
                }
            },
            filterAll: () => {
                //
            }
        };

        const smGroup = {
            all() {
                return chartService.filteredData;
            },
            order() {
                //
            },
            top() {
                //
            }
        };

        const gcpSpy = spyOn(component, 'getChartPromise').and.callFake(() => {
            component.dim = smDim;
            component.group = smGroup;

            return Promise.resolve(dc.selectMenu(component.selectMenu.nativeElement)
                .dimension(component.dim)
                .group(component.group)
                .controlsUseVisibility(true)
                .title((d) => {
                    return d.key;
                })
                .filterDisplayed(() => {
                    return true;
                })
                .on('filtered', (chart, filter) => {
                    if (component.label === 'select-tissue') {
                        if (filter instanceof Array) {
                            geneService.setCurrentTissue(filter[0][0]);
                        } else {
                            geneService.setCurrentTissue(filter);
                        }
                    }
                    if (component.label === 'select-model') {
                        if (filter instanceof Array) {
                            geneService.setCurrentModel(filter[0][0]);
                        } else {
                            geneService.setCurrentModel(filter);
                        }
                    }

                    component.isDisabled = (filter) ? false : true;
                })
            );
        });

        const gcp = component.getChartPromise();
        fixture.detectChanges();
        gcp.then(async (chartInst) => {
            component.chart = chartInst;

            expect(component.chart).toBeDefined();
            expect(component.chart.group).toBeDefined();
            expect(component.chart.group().all()[0].value).toEqual(12);

            component.initFilterHandler(component.chart);

            chartInst.render();
            fixture.detectChanges();

            chartService.filteredData = [
                { key: 'AD Diagnosis (males and females)', value: 0 },
                { key: 'AD Diagnosis x AOD (males and females)', value: 14 },
                { key: 'AD Diagnosis x Sex (females only)', value: 0 },
                { key: 'AD Diagnosis x Sex (males only)', value: 0 }
            ];
            component.isActive = true;

            component.menuSelection = d3.select(component.selectMenu.nativeElement)
                .select('select.dc-select-menu');
            expect(component.menuSelection).toBeDefined();

            // Select the second entry for testing, the second 1 index is
            // the option clicked
            const options = component.menuSelection.selectAll('option');
            expect(options).toBeDefined();
            // Before removing the first option
            expect(options['_groups'][0].length).toEqual(5);
            options['_groups'][0][1]['selected'] = 'selected';
            await component.menuSelection.dispatch('change');

            fixture.detectChanges();
            expect(component.chart.group().all()[0].value).toEqual(0);
            expect(component.chart.group().all()[1].value).toEqual(14);

            component.filterAll();
            fixture.detectChanges();
            expect(component.isDisabled).toEqual(true);
            expect(gcpSpy).toHaveBeenCalled();
        });
    }));
});
