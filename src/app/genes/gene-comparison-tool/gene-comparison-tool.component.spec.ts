import {
    fakeAsync,
    ComponentFixture,
    TestBed,
    tick
} from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Checkbox } from 'primeng/checkbox';

import {
    RouterStub,
    ApiServiceStub,
    ChartServiceStub,
    mockComparisonData
} from '../../testing';

import {
    GeneComparisonToolComponent,
    GeneComparisonToolDetailsPanelComponent,
    GeneComparisonToolFilterListComponent,
    GeneComparisonToolFilterPanelComponent
} from '.';

import { ApiService } from '../../core/services';
import { ChartService } from '../../charts/services';

class ActivatedRouteStub {
    queryParams = new Observable(observer => {
        const urlParams = {
            pinned: ['ENSG00000147065']
        };
        observer.next(urlParams);
        observer.complete();
    });
}

describe('Component: GeneComparisonToolComponent', () => {
    let component: GeneComparisonToolComponent;
    let fixture: ComponentFixture<GeneComparisonToolComponent>;
    let apiService: ApiServiceStub;

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                GeneComparisonToolComponent,
                GeneComparisonToolDetailsPanelComponent,
                GeneComparisonToolFilterListComponent,
                GeneComparisonToolFilterPanelComponent,
                Table,
                Checkbox
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: ApiService, useValue: new ApiServiceStub() },
                { provide: ChartService, useValue: new ChartServiceStub() },
                { provide: MessageService, useValue: new MessageService() },
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(GeneComparisonToolComponent);
        component = fixture.componentInstance; // Component test instance
        apiService = fixture.debugElement.injector.get(ApiService);
    }));

    it('should have 3 tables', () => {
        const el = fixture.debugElement.queryAll(By.css('p-table'));
        expect(el).toBeDefined();
        expect(el.length).toEqual(3);
    });

    it('should have 1 filter list', () => {
        const el = fixture.debugElement.queryAll(By.css('.gct-filter-list'));
        expect(el).toBeDefined();
        expect(el.length).toEqual(1);
    });

    it('should have 1 filter panel', () => {
        const el = fixture.debugElement.queryAll(By.css('.gct-details-panel'));
        expect(el).toBeDefined();
        expect(el.length).toEqual(2);
    });

    it('should have 1 details panel', () => {
        const el = fixture.debugElement.queryAll(By.css('.gct-filter-panel'));
        expect(el).toBeDefined();
        expect(el.length).toEqual(1);
    });

    it('should load the data', fakeAsync(() => {
        spyOn(component, 'ngOnInit').and.callThrough();
        fixture.detectChanges();
        tick();
        expect(component.pinnedGenes).toEqual([mockComparisonData[0]]);
        expect(component.pinnedGeneTable._totalRecords).toEqual(1);
        expect(component.availableGenes).toEqual([mockComparisonData[1], mockComparisonData[2]]);
        expect(component.availableGeneTable._totalRecords).toEqual(2);
        expect(component.tissues.length).toEqual(mockComparisonData[0].tissues.length);
        expect(component.filters.find(filter => filter.name === 'nominations').options.length).toEqual(1);
        expect(component.filters.find(filter => filter.name === 'year_first_nominated').options.length).toEqual(1);
        expect(component.filters.find(filter => filter.name === 'teams').options.length).toEqual(4);
        expect(component.filters.find(filter => filter.name === 'studies').options.length).toEqual(6);
        expect(component.filters.find(filter => filter.name === 'input_datas').options.length).toEqual(4);
    }));

    it('should search', fakeAsync(() => {
        spyOn(component, 'ngOnInit').and.callThrough();
        fixture.detectChanges();
        tick();

        const input = fixture.debugElement.nativeElement.querySelector('.gct-search input');
        input.value = 'PLEC';
        input.dispatchEvent(new Event('input'));

        fixture.detectChanges();
        tick();

        expect(component.availableGeneTable._totalRecords).toEqual(1);
    }));

    it('should filter', fakeAsync(() => {
        spyOn(component, 'ngOnInit').and.callThrough();
        fixture.detectChanges();
        tick();

        const filterPanel = fixture.debugElement.nativeElement.querySelector('.gct-filter-panel');
        const filterPanelButton = fixture.debugElement.nativeElement.querySelector('.gct-header-left button');
        filterPanelButton.click();
        fixture.detectChanges();
        tick();
        expect(filterPanel?.classList?.contains('open')).toEqual(true);

        const filterPanelTeam = fixture.debugElement.nativeElement.querySelector(
            '.gct-filter-panel-pane:nth-child(2)'
        );
        const filterPanelTeamButton = fixture.debugElement.nativeElement.querySelector(
            '.gct-filter-panel-main-menu li:nth-child(2) button'
        );
        filterPanelTeamButton.click();
        fixture.detectChanges();
        tick();
        expect(filterPanelTeam?.classList?.contains('open')).toEqual(true);

        // Not working, come back to it later
        // const filterPanelTeamFirstCheckbox = filterPanelTeam.querySelector('li:first-child .ui-chkbox-box');
        // filterPanelTeamFirstCheckbox.click();
        component.filters.find(filter => filter.name === 'teams').options[0].selected = true;
        component.filter();
        fixture.detectChanges();
        tick();

        expect(component.availableGeneTable._totalRecords).toEqual(1);
    }));

    it('should pin/upin gene', fakeAsync(() => {
        spyOn(component, 'ngOnInit').and.callThrough();
        fixture.detectChanges();
        tick();

        expect(component.availableGeneTable._totalRecords).toEqual(2);
        expect(component.pinnedGeneTable._totalRecords).toEqual(1);

        component.pinGene(component.availableGenes[0], true, false);
        fixture.detectChanges();
        tick();

        expect(component.availableGeneTable._totalRecords).toEqual(1);
        expect(component.pinnedGeneTable._totalRecords).toEqual(2);

        component.unpinGene(component.pinnedGenes[0], true, false);
        fixture.detectChanges();
        tick();

        expect(component.availableGeneTable._totalRecords).toEqual(2);
        expect(component.pinnedGeneTable._totalRecords).toEqual(1);
    }));

    it('should clear pinned genes', fakeAsync(() => {
        spyOn(component, 'ngOnInit').and.callThrough();
        fixture.detectChanges();
        tick();

        component.clearPinned(true, false);
        fixture.detectChanges();
        tick();

        expect(component.availableGeneTable._totalRecords).toEqual(3);
        expect(component.pinnedGeneTable._totalRecords).toEqual(0);
    }));
});
