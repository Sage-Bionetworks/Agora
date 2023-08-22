// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GeneHeroComponent } from './';
import { geneMock1, geneMock3 } from '../../../../testing';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene Hero', () => {
  let fixture: ComponentFixture<GeneHeroComponent>;
  let component: GeneHeroComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneHeroComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GeneHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add nomination and TEP text if nomination exists and is either is_tep or is_adi is true', () => {
    component.gene = geneMock1;
    fixture.detectChanges();
    
    const el = element.querySelector('.gene-hero-nominated') as HTMLElement;
    
    const expected = 'Nominated Target, Selected for Target Enabling Resource Development';
    expect(el.textContent).toBe(expected);
  });

  it('should only add TEP text if nominations is null and either is_tep or is_adi is true', () => {
    component.gene = geneMock3;
    fixture.detectChanges();
    
    const el = element.querySelector('.gene-hero-nominated') as HTMLElement;
    
    const expected = 'Selected for Target Enabling Resource Development';
    expect(el.textContent).toBe(expected);
  });

  it('should comma separate and order the biodomains alphabetically', () => {
    component.gene = geneMock1;
    const expected = 'Immune Response, Lipid Metabolism, Structural Stabilization, Synapse, Vasculature';
    expect(component.getBiodomains()).toBe(expected);
  });
});
