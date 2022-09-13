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
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
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

class ActivatedRouteStub {
  queryParams = new Observable((observer) => {
    const urlParams = {
      pinned: ['ENSG00000147065'],
    };
    observer.next(urlParams);
    observer.complete();
  });
}

describe('Component: GeneComparisonToolComponent', () => {
  let fixture: ComponentFixture<GeneComparisonToolComponent>;
  let component: GeneComparisonToolComponent;
  let element: HTMLElement;

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
});
