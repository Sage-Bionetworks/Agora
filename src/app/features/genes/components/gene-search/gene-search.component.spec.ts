// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Location } from '@angular/common';
import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GeneSearchComponent } from './';
import { ApiService } from '../../../../core/services';
import { geneMock1 } from '../../../../testing';
import { routes } from '../../../../app.routing';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene Search', () => {
  let fixture: ComponentFixture<GeneSearchComponent>;
  let component: GeneSearchComponent;
  let element: HTMLElement;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneSearchComponent],
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
      ],
      providers: [ApiService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GeneSearchComponent);
    component = fixture.componentInstance;
    location = TestBed.get(Location);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have input', () => {
    expect(element.querySelector('input')).toBeTruthy();
  });

  it('should have icon', () => {
    expect(element.querySelector('.gene-search-bar-icon i')).toBeTruthy();
  });

  it('should have loading icon', () => {
    component.isLoading = true;
    expect(element.querySelectorAll('.fa-spinner')).toBeTruthy();
  });

  it('should have results dropdown', () => {
    component.results = [geneMock1];
    expect(element.querySelectorAll('.gene-search-results')).toBeTruthy();
  });

  it('should show error if search is < 2 characters', () => {
    component.search('M');
    expect(component.error).toEqual(component.errorMessages.notValidSearch);
  });

  it('should show error if not valid ENSG', () => {
    component.search('ENSG');
    expect(component.error).toEqual(component.errorMessages.notValidEnsemblId);
  });

  it('should show error if not found', () => {
    component.search('ENSG00000000000');
    component.setResults([]);
    expect(component.error).toEqual(component.errorMessages.ensemblIdNotFound);

    component.search('XXXXX');
    component.setResults([]);
    expect(component.error).toEqual(component.errorMessages.hgncSymbolNotFound);
  });

  it('should navigate when clicking gene', fakeAsync(() => {
    component.results = [geneMock1];
    component.showGeneResults = true;
    fixture.detectChanges();

    const link = element.querySelector(
      '.gene-search-results li:first-child'
    ) as HTMLElement;
    expect(link).toBeTruthy();

    link.click();
    tick();
    fixture.detectChanges();

    expect(location.path()).toBe('/genes/' + geneMock1.ensembl_gene_id);
  }));
});
