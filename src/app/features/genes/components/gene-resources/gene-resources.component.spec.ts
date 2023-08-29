// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GeneResourcesComponent } from './';
import { ModalLinkComponent } from '../../../../shared/components/modal-link/modal-link.component';
import { GeneDruggabilityComponent } from '../gene-druggability/gene-druggability.component';
import { geneMock1 } from '../../../../testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService, HelperService } from '../../../../core/services';
import { GeneService } from '../../services';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene Resources', () => {
  let fixture: ComponentFixture<GeneResourcesComponent>;
  let component: GeneResourcesComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        GeneResourcesComponent, 
        ModalLinkComponent, 
        GeneDruggabilityComponent
      ],
      imports: [RouterTestingModule, HttpClientTestingModule, BrowserAnimationsModule],
      providers: [GeneService, ApiService, HelperService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GeneResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display TREAT-AD resource section if is_tep and is_adi is false', () => {
    component.gene = geneMock1;
    component.gene.is_adi = false;
    component.gene.is_tep = false;

    fixture.detectChanges();

    const header = element.querySelector('#target-enabling-resources-header');
    expect(header).toBe(null);

    const resource_url = element.querySelector('#target-enabling-resources-url');
    expect(resource_url).toBe(null);
  });

  it('should display TREAT-AD resource sections if is_tep or is_adi is true', () => {
    component.gene = geneMock1;
    component.gene.is_adi = false;
    component.gene.is_tep = true;
    
    fixture.detectChanges();
    
    let expected = 'Target Enabling Resources';
    let el = element.querySelector('#target-enabling-resources-header') as HTMLElement;
    expect(el.textContent).toBe(expected);

    expected = 'Target Enabling Resources';
    el = element.querySelector('#target-enabling-resources-card1') as HTMLElement;
    expect(el.textContent).toBe(expected);

    expected = 'Target Portfolio';
    el = element.querySelector('#target-enabling-resources-card2') as HTMLElement;
    expect(el.textContent).toBe(expected);

    // adi is false so card3 should be null
    const card3 = element.querySelector('#target-enabling-resources-card3');
    expect(card3).toBe(null);

    // switch the booleans on adi and tep
    component.gene = geneMock1;
    component.gene.is_adi = true;
    component.gene.is_tep = false;
    
    fixture.detectChanges();

    expected = 'Target Enabling Resources';
    el = element.querySelector('#target-enabling-resources-header') as HTMLElement;
    expect(el.textContent).toBe(expected);

    expected = 'Target Enabling Resources';
    el = element.querySelector('#target-enabling-resources-card1') as HTMLElement;
    expect(el.textContent).toBe(expected);

    // tep is false so card3 should be null
    expected = 'Target Portfolio';
    const card2 = element.querySelector('#target-enabling-resources-card2');
    expect(card2).toBe(null);

    expected = 'AD Informer Set';
    el = element.querySelector('#target-enabling-resources-card3') as HTMLElement;
    expect(el.textContent).toBe(expected);
  });
});
