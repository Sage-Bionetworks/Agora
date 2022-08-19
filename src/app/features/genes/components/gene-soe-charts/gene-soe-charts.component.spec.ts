// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GeneSoeChartsComponent } from './';
import { GeneService } from '../../services';
import { ApiService } from '../../../../core/services';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene SOE Charts', () => {
  let fixture: ComponentFixture<GeneSoeChartsComponent>;
  let component: GeneSoeChartsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneSoeChartsComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [GeneService, ApiService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GeneSoeChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
