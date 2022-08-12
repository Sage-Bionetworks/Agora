// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { OverlayPanelLinkComponent } from './';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Overlay Panel Link', () => {
  let fixture: ComponentFixture<OverlayPanelLinkComponent>;
  let component: OverlayPanelLinkComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OverlayPanelLinkComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(OverlayPanelLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
