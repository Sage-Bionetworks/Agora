// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GeneComparisonToolScorePanelComponent } from './';
import { HelperService } from '../../../../../../core/services';
import { gctScorePanelDataMock } from '../../../../../../testing';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene Comparison Tool - Details Panel', () => {
  let fixture: ComponentFixture<GeneComparisonToolScorePanelComponent>;
  let component: GeneComparisonToolScorePanelComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneComparisonToolScorePanelComponent],
      imports: [RouterTestingModule, BrowserAnimationsModule],
      providers: [HelperService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GeneComparisonToolScorePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.nativeElement;
    component.show(new Event('click'), JSON.parse(JSON.stringify(gctScorePanelDataMock)));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have data', () => {
    expect(component.data).toEqual(gctScorePanelDataMock);
  });

  it('should have links', () => {
    expect(element.querySelector('.gct-score-panel-links')).toBeTruthy();
  });
});
