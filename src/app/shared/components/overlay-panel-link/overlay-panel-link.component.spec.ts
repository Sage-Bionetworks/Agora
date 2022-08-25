// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { OverlayPanelLinkComponent } from './';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Modal Link', () => {
  let fixture: ComponentFixture<OverlayPanelLinkComponent>;
  let component: OverlayPanelLinkComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OverlayPanelLinkComponent],
      imports: [RouterTestingModule, BrowserAnimationsModule],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(OverlayPanelLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have overlay', () => {
    expect(element.querySelector('p-overlaypanel.p-element')).toBeTruthy();
  });

  it('should open overlay on click', () => {
    const toggle = element.querySelector('.overlay-link-inner') as HTMLElement;

    expect(toggle).toBeTruthy();

    toggle.click();
    fixture.detectChanges();

    expect(document.querySelector('.overlay-panel')).toBeTruthy();
  });
});
