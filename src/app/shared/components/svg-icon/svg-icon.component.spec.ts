// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { SvgIconComponent } from './';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: SVG Icon', () => {
  let fixture: ComponentFixture<SvgIconComponent>;
  let component: SvgIconComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SvgIconComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(SvgIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
