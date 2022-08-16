// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { NominationFormPageComponent } from './';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Page - Nomination Form', () => {
  let fixture: ComponentFixture<NominationFormPageComponent>;
  let component: NominationFormPageComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NominationFormPageComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(NominationFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the form', () => {
    const el = element.querySelector('iframe');
    expect(el).toBeTruthy();
    expect(el?.src).toEqual(
      'https://docs.google.com/forms/d/e/1FAIpQLScoml' +
        '5Z_RZqb1M7e9RMLepn_pMsVXfm8uEjJ5KpFWLG18Sr2Q/viewform?embedded=true'
    );
  });
});
