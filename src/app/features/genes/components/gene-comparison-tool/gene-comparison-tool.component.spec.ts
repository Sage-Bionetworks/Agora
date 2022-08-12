// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GeneComparisonToolComponent } from './';
import { GeneService } from '../../services';
import { ApiService, HelperService } from '../../../../core/services';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene Comparison Tool', () => {
  let fixture: ComponentFixture<GeneComparisonToolComponent>;
  let component: GeneComparisonToolComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneComparisonToolComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [GeneService, ApiService, HelperService, MessageService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GeneComparisonToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
