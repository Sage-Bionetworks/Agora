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

    const el = element.querySelector('#target-enabling-resources-header');
    
    expect(el).toBe(null);
  });

  it('should display TREAT-AD resource section if is_tep or is_adi is true', () => {
    const expected = 'Target Enabling Resources';

    component.gene = geneMock1;
    component.gene.is_adi = false;
    component.gene.is_tep = true;
    
    fixture.detectChanges();

    let el = element.querySelector('#target-enabling-resources-header') as HTMLElement;
    
    expect(el.textContent).toBe(expected);

    component.gene = geneMock1;
    component.gene.is_adi = true;
    component.gene.is_tep = false;
    
    fixture.detectChanges();

    el = element.querySelector('#target-enabling-resources-header') as HTMLElement;
    
    expect(el.textContent).toBe(expected);
  });
});
