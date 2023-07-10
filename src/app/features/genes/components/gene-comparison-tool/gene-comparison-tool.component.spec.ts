import {
  fakeAsync,
  ComponentFixture,
  TestBed,
  tick,
  flush,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MessageService, SortEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Checkbox } from 'primeng/checkbox';

import {
  GeneComparisonToolComponent,
  GeneComparisonToolDetailsPanelComponent,
  GeneComparisonToolFilterListComponent,
  GeneComparisonToolFilterPanelComponent,
} from '.';

import { ApiService, HelperService } from '../../../../core/services';
import { GeneService } from '../../../../features/genes/services';
import { routes } from '../../../../app.routing';
import { comparisonGeneMock1, comparisonGeneMock2 } from '../../../../testing';

const DEFAULT_SIGNIFICANCE_THRESHOLD = 0.05;

class ActivatedRouteStub {
  queryParams = new Observable((observer) => {
    const urlParams = {
      pinned: ['ENSG00000147065'],
      significance: DEFAULT_SIGNIFICANCE_THRESHOLD,
    };
    observer.next(urlParams);
    observer.complete();
  });
}

describe('Component: GeneComparisonToolComponent', () => {
  let fixture: ComponentFixture<GeneComparisonToolComponent>;
  let component: GeneComparisonToolComponent;
  let element: HTMLElement;
  let route: ActivatedRoute;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        GeneComparisonToolComponent,
        GeneComparisonToolDetailsPanelComponent,
        GeneComparisonToolFilterListComponent,
        GeneComparisonToolFilterPanelComponent,
        Table,
        Checkbox,
      ],
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        GeneService,
        ApiService,
        HelperService,
        MessageService,
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
    }).compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(GeneComparisonToolComponent);
    component = fixture.componentInstance;
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have tables', () => {
    expect(element.querySelectorAll('p-table')?.length).toEqual(3);
  });

  it('should have filter list', () => {
    expect(element.querySelector('.gct-filter-list')).toBeTruthy();
  });

  it('should have filter panel', () => {
    expect(element.querySelectorAll('.gct-details-panel')?.length).toEqual(2);
  });

  it('should have details panel', () => {
    expect(element.querySelector('.gct-filter-panel')).toBeTruthy();
  });

  it('should init', fakeAsync(() => {
    component.initData([comparisonGeneMock1, comparisonGeneMock2]);
    fixture.detectChanges();

    expect(component.genes).toEqual([comparisonGeneMock1, comparisonGeneMock2]);
    expect(component.pinnedGenes).toEqual([comparisonGeneMock1]);
    flush();
  }));

  it('should search', () => {
    component.initData([comparisonGeneMock1, comparisonGeneMock2]);
    fixture.detectChanges();

    const input = element.querySelector(
      '.gct-search input'
    ) as HTMLInputElement;
    input.value = 'MSN';

    fixture.detectChanges();

    expect(component.genesTable._totalRecords).toEqual(1);
  });

  it('should filter', fakeAsync(() => {
    component.initData([comparisonGeneMock1, comparisonGeneMock2]);
    fixture.detectChanges();

    const filterPanel =
      fixture.debugElement.nativeElement.querySelector('.gct-filter-panel');
    const filterPanelButton = fixture.debugElement.nativeElement.querySelector(
      '.gct-header-left button'
    );
    filterPanelButton.click();
    fixture.detectChanges();
    tick();
    expect(filterPanel?.classList?.contains('open')).toEqual(true);

    const filterPanelTeam = fixture.debugElement.nativeElement.querySelector(
      '.gct-filter-panel-pane:nth-child(2)'
    );
    const filterPanelTeamButton =
      fixture.debugElement.nativeElement.querySelector(
        '.gct-filter-panel-main-menu li:nth-child(2) button'
      );
    filterPanelTeamButton.click();
    fixture.detectChanges();
    tick();
    expect(filterPanelTeam?.classList?.contains('open')).toEqual(true);

    // Not working, come back to it later
    // const filterPanelTeamFirstCheckbox = filterPanelTeam.querySelector('li:first-child .ui-chkbox-box');
    // filterPanelTeamFirstCheckbox.click();
    // component.filters.find(
    //   (filter) => filter.name === 'teams'
    // ).options[0].selected = true;
    component.filter();
    fixture.detectChanges();
    tick();

    expect(component.genesTable._totalRecords).toEqual(1);

    flush();
  }));

  it('should pin/upin gene', () => {
    component.initData([comparisonGeneMock1, comparisonGeneMock2]);
    fixture.detectChanges();

    component.clearPinnedGenes();
    fixture.detectChanges();
    expect(component.pinnedGenes.length).toEqual(0);

    component.pinGene(comparisonGeneMock1, true);
    fixture.detectChanges();
    expect(component.pinnedGenes.length).toEqual(1);

    component.unpinGene(comparisonGeneMock1, true);
    fixture.detectChanges();
    expect(component.pinnedGenes.length).toEqual(0);
  });

  it('should clear pinned genes', fakeAsync(() => {
    component.initData([comparisonGeneMock1, comparisonGeneMock2]);
    fixture.detectChanges();

    component.clearPinnedGenes();
    fixture.detectChanges();
    expect(component.pinnedGenes.length).toEqual(0);
    flush();
  }));

  it('should have a grid with 12 columns', () => {
    component.initData([comparisonGeneMock1, comparisonGeneMock2]);
    fixture.detectChanges();
    expect(component.columns.length).toEqual(12);
  });

  it('should have a grid with RISK SCORE being the 1st column', () => {
    component.initData([comparisonGeneMock1, comparisonGeneMock2]);
    fixture.detectChanges();
    expect(component.columns[0]).toEqual('RISK SCORE');
  });

  it('should have a grid with GENETIC being the 2nd column', () => {
    component.initData([comparisonGeneMock1, comparisonGeneMock2]);
    fixture.detectChanges();
    expect(component.columns[1]).toEqual('GENETIC');
  });

  it('should have a grid with MULTI-OMIC being the 3rd column', () => {
    component.initData([comparisonGeneMock1, comparisonGeneMock2]);
    fixture.detectChanges();
    expect(component.columns[2]).toEqual('MULTI-OMIC');
  });

  it('should have a grid with ACC being the 4th column', () => {
    component.initData([comparisonGeneMock1, comparisonGeneMock2]);
    fixture.detectChanges();
    expect(component.columns[3]).toEqual('ACC');
  });

  it('should have a grid with ACC being the 5th column', () => {
    component.initData([comparisonGeneMock1, comparisonGeneMock2]);
    fixture.detectChanges();
    expect(component.columns[4]).toEqual('CBE');
  });

  it('should have a grid with DLPFC being the 6th column', () => {
    component.initData([comparisonGeneMock1, comparisonGeneMock2]);
    fixture.detectChanges();
    expect(component.columns[5]).toEqual('DLPFC');
  });

  it('should have a grid with FP being the 7th column', () => {
    component.initData([comparisonGeneMock1, comparisonGeneMock2]);
    fixture.detectChanges();
    expect(component.columns[6]).toEqual('FP');
  });

  it('should have a grid with IFG being the 8th column', () => {
    component.initData([comparisonGeneMock1, comparisonGeneMock2]);
    fixture.detectChanges();
    expect(component.columns[7]).toEqual('IFG');
  });

  it('should have a grid with PCC being the 9th column', () => {
    component.initData([comparisonGeneMock1, comparisonGeneMock2]);
    fixture.detectChanges();
    expect(component.columns[8]).toEqual('PCC');
  });

  it('should have a grid with PHG being the 10th column', () => {
    component.initData([comparisonGeneMock1, comparisonGeneMock2]);
    fixture.detectChanges();
    expect(component.columns[9]).toEqual('PHG');
  });

  it('should have a grid with STG being the 11th column', () => {
    component.initData([comparisonGeneMock1, comparisonGeneMock2]);
    fixture.detectChanges();
    expect(component.columns[10]).toEqual('STG');
  });

  it('should have a grid with TCX being the 12th column', () => {
    component.initData([comparisonGeneMock1, comparisonGeneMock2]);
    fixture.detectChanges();
    expect(component.columns[11]).toEqual('TCX');
  });

  it('sortCallback() should sort increasing', () => {
    component.initData([comparisonGeneMock1, comparisonGeneMock2]);
    fixture.detectChanges();
    const event: SortEvent = {
      field: 'RISK SCORE',
      order: 1,
      data: [
        { target_risk_score: 1 },
        { target_risk_score: -2 },
        { target_risk_score: 3 }
      ],
    };
    component.sortCallback(event);
    if (!event.data)
      fail('Missing data');
    else {
      expect(event.data[0].target_risk_score).toEqual(-2);
      expect(event.data[1].target_risk_score).toEqual(1);
      expect(event.data[2].target_risk_score).toEqual(3);
    }
  });

  it('sortCallback() should sort null last for increasing', () => {
    component.initData([comparisonGeneMock1, comparisonGeneMock2]);
    fixture.detectChanges();
    const event: SortEvent = {
      field: 'RISK SCORE',
      order: 1,
      data: [
        { target_risk_score: null },
        { target_risk_score: 1 },
        { target_risk_score: -2 },
        { target_risk_score: 3 }
      ],
    };
    component.sortCallback(event);
    if (!event.data)
      fail('Missing data');
    else {
      expect(event.data[0].target_risk_score).toEqual(-2);
      expect(event.data[1].target_risk_score).toEqual(1);
      expect(event.data[2].target_risk_score).toEqual(3);
      expect(event.data[3].target_risk_score).toEqual(null);
    }
  });

  it('sortCallback() should sort decreasing', () => {
    component.initData([comparisonGeneMock1, comparisonGeneMock2]);
    fixture.detectChanges();
    const event: SortEvent = {
      field: 'RISK SCORE',
      order: -1,
      data: [
        { target_risk_score: 1 },
        { target_risk_score: -2 },
        { target_risk_score: 3 }
      ],
    };
    component.sortCallback(event);
    if (!event.data)
      fail('Missing data');
    else {
      expect(event.data[0].target_risk_score).toEqual(3);
      expect(event.data[1].target_risk_score).toEqual(1);
      expect(event.data[2].target_risk_score).toEqual(-2);
    }
  });

  it('sortCallback() should sort null last for decreasing', () => {
    component.initData([comparisonGeneMock1, comparisonGeneMock2]);
    fixture.detectChanges();
    const event: SortEvent = {
      field: 'RISK SCORE',
      order: -1,
      data: [
        { target_risk_score: null },
        { target_risk_score: 1 },
        { target_risk_score: -2 },
        { target_risk_score: 3 }
      ],
    };
    component.sortCallback(event);
    if (!event.data)
      fail('Missing data');
    else {
      expect(event.data[0].target_risk_score).toEqual(3);
      expect(event.data[1].target_risk_score).toEqual(1);
      expect(event.data[2].target_risk_score).toEqual(-2);
      expect(event.data[3].target_risk_score).toEqual(null);
    }
  });

  describe('significanceThreshold', () => {
    // constants
    const TOGGLE_CLASS = '.gct-significance-control-toggle';
    const CHICLET_CLASS = '.gct-filter-list-item';
    const CHICLET_TEXT_CLASS = '.gct-filter-list-item-text';

    // helpers
    const expectSignificanceThresholdIsApplied = (
      threshold = DEFAULT_SIGNIFICANCE_THRESHOLD
    ) => {
      expect(element.querySelector(CHICLET_CLASS)).toBeTruthy();
      expect(element.querySelector(CHICLET_TEXT_CLASS)?.textContent).toContain(
        `Significance ≤ ${threshold}`
      );
      expect(
        element.querySelector(TOGGLE_CLASS)?.querySelector('input')?.checked
      ).toBeTrue();
      expect(component.getUrlParam('significance')[0]).toEqual(
        threshold
      );
    };

    const expectSignificanceThresholdIsNotApplied = () => {
      expect(element.querySelector(CHICLET_CLASS)).toBeFalsy();
      expect(
        element.querySelector(TOGGLE_CLASS)?.querySelector('input')?.checked
      ).toBeFalse();
      expect(component.getUrlParam('significance')).toEqual(null);
    };

    // tests
    it('should show significance threshold filter when URL includes query param', fakeAsync(() => {
      component.initData([comparisonGeneMock1, comparisonGeneMock2]);
      fixture.detectChanges();

      expectSignificanceThresholdIsApplied();
      flush();
    }));

    it('should remove significance threshold filter and URL query param when significance threshold filter is removed', fakeAsync(() => {
      component.initData([comparisonGeneMock1, comparisonGeneMock2]);
      fixture.detectChanges();

      expectSignificanceThresholdIsApplied();

      const filterClearButton = element.querySelector(
        '.gct-filter-list-item-clear'
      ) as HTMLElement;
      filterClearButton.click();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expectSignificanceThresholdIsNotApplied();
      });
      flush();
    }));

    it('should remove significance threshold filter and URL query param when clear all button is clicked', fakeAsync(() => {
      component.initData([comparisonGeneMock1, comparisonGeneMock2]);
      fixture.detectChanges();

      expectSignificanceThresholdIsApplied();

      const clearAllButton = element.querySelector(
        '.gct-filter-list-clear-all'
      ) as HTMLElement;
      clearAllButton.click();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expectSignificanceThresholdIsNotApplied();
      });
      flush();
    }));

    it('should add significance threshold filter and add URL query param when significance threshold slider is toggled on', fakeAsync(() => {
      component.initData([comparisonGeneMock1, comparisonGeneMock2]);
      route.queryParams = of({});

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expectSignificanceThresholdIsNotApplied();

        const toggle = element.querySelector(TOGGLE_CLASS) as HTMLElement;
        toggle.click();

        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expectSignificanceThresholdIsApplied();
        });
      });
      flush();
    }));

    it('should remove significance threshold filter and remove URL query param when significance threshold slider is toggled off', fakeAsync(() => {
      component.initData([comparisonGeneMock1, comparisonGeneMock2]);
      fixture.detectChanges();

      expectSignificanceThresholdIsApplied();

      const toggle = element.querySelector(TOGGLE_CLASS) as HTMLElement;
      toggle.click();
      flush();

      fixture.detectChanges();
      expectSignificanceThresholdIsNotApplied();
    }));

    it('should update the significance threshold filter and URL query param when significance threshold is updated', fakeAsync(() => {
      component.initData([comparisonGeneMock1, comparisonGeneMock2]);
      fixture.detectChanges();

      const newValue = 0.95;
      const settingsButton = element.querySelector(
        '.gct-significance-control-settings'
      ) as HTMLElement;
      settingsButton.click();
      fixture.detectChanges();

      const settingsInput = element.querySelector(
        '.gct-significance-control-panel input'
      ) as HTMLInputElement;
      settingsInput.value = newValue.toString();
      settingsInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      flush();

      expectSignificanceThresholdIsApplied(newValue);
    }));
  });
});
