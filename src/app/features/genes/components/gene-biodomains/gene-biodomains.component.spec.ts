// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GeneBioDomainsComponent } from './';
import { HelperService } from '../../../../core/services';
import { geneMock1 } from '../../../../testing';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene Biodomains', () => {
  let fixture: ComponentFixture<GeneBioDomainsComponent>;
  let component: GeneBioDomainsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneBioDomainsComponent],
      imports: [RouterTestingModule],
      providers: [HelperService]
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GeneBioDomainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return an empty string when getGeneName() is called with undefined gene', () => {
    component.gene = undefined;
    const result = component.getGeneName();
    expect(result).toBe('');
  });

  it('should return gene name when getGeneName() is called with undefined gene', () => {
    component.gene = geneMock1;
    const result = component.getGeneName();
    expect(result).toBe('MSN');
  });

  it('should return NO LINKING GO TERMS when getHeaderText() is called with no go terms', () => {
    component.goTerms = [];
    const result = component.getHeaderText();
    expect(result).toBe('NO LINKING GO TERMS');
  });
});
