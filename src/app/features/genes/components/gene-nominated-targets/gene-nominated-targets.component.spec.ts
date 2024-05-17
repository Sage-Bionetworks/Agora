// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GeneNominatedTargetsComponent } from './';
import { ApiService, HelperService } from '../../../../core/services';
import { Gene, GenesResponse } from '../../../../models';
import { geneMock1, targetNominationMock1 } from '../../../../testing/gene-mocks';
import { of } from 'rxjs';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene Nominated Targets', () => {
  let fixture: ComponentFixture<GeneNominatedTargetsComponent>;
  let component: GeneNominatedTargetsComponent;
  let element: HTMLElement;
  let mockApiService: ApiService;

  const COLUMN_INDICES = {
    'cohort_study': 4
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneNominatedTargetsComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [ApiService, HelperService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GeneNominatedTargetsComponent);
    component = fixture.componentInstance;
  });

  const setUp = (genes: Gene[]) => {
    const genesResponse: GenesResponse = {
      items: genes
    };
    mockApiService = TestBed.inject(ApiService);
    spyOn(mockApiService, 'getNominatedGenes').and.returnValue(
      of(genesResponse)
    );
    fixture.detectChanges();
    element = fixture.nativeElement;

    expect(mockApiService.getNominatedGenes).toHaveBeenCalled();

    const table = element.querySelector('table');
    expect(table).not.toBeNull();

    const rows = Array.from(
      table?.querySelectorAll('tbody tr') || []
    ) as HTMLTableRowElement[];

    return { rows };
  };

  it('should create', () => {
    setUp([geneMock1]);
    expect(component).toBeTruthy();
  });

  it('should not show null study values', () => {
    const gene: Gene = {
      ...geneMock1,
      target_nominations: [
        { ...targetNominationMock1, study: null },
        { ...targetNominationMock1, study: 'XYZ Study, ABC Study' },
        { ...targetNominationMock1, study: '' },
        { ...targetNominationMock1, study: 'Study 123, Study 456' },
      ],
    };
    const { rows } = setUp([gene]);
    expect(rows.length).toBe(1);

    const cols = rows[0].cells;
    expect(cols.length).toBeGreaterThan(COLUMN_INDICES.cohort_study);

    expect(cols[COLUMN_INDICES.cohort_study].textContent?.trim()).toEqual(
      'ABC Study, Study 123, Study 456, XYZ Study'
    );
  });

  it('should display sorted, unique study values', () => {
    const expectedStudyString = 'ACT, Banner, BLSA, Kronos, MSBB, ROSMAP';
    const { rows } = setUp([geneMock1]);

    expect(rows.length).toBe(1);

    const cols = rows[0].cells;
    expect(cols.length).toBeGreaterThan(COLUMN_INDICES.cohort_study);

    expect(cols[COLUMN_INDICES.cohort_study].textContent?.trim()).toEqual(
      expectedStudyString
    );
  });

  it('should correctly flatten comma separated arrays', () => {
    setUp([]);

    expect(component.commaFlattenArray([])).toEqual([]);

    expect(
      component.commaFlattenArray(['ACT, BLSA, Banner', 'ACT, BLSA, Banner'])
    ).toEqual(['ACT', 'BLSA', 'Banner', 'ACT', 'BLSA', 'Banner']);

    expect(component.commaFlattenArray(['A, B, C', 'D', 'E, F, G, H'])).toEqual(
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    );

    expect(component.commaFlattenArray(['A', 'B', 'C'])).toEqual([
      'A',
      'B',
      'C',
    ]);
  });

  it('should correctly format display values', () => {
    setUp([]);

    expect(
      component.getCommaSeparatedStringOfUniqueSortedValues([])
    ).toEqual('');

    expect(
      component.getCommaSeparatedStringOfUniqueSortedValues([
        'ACT',
        'BLSA',
        'Banner',
        'ACT',
        'BLSA',
        'Banner',
      ])
    ).toEqual('ACT, Banner, BLSA');

    expect(
      component.getCommaSeparatedStringOfUniqueSortedValues([
        'Z',
        'Y',
        'X',
        'A',
        'B',
        'C',
        'B',
        'C',
      ])
    ).toEqual('A, B, C, X, Y, Z');
  });
});
