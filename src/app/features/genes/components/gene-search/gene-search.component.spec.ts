// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GeneSearchComponent } from './';
import { ApiService } from '../../../../core/services';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene Search', () => {
  let fixture: ComponentFixture<GeneSearchComponent>;
  let component: GeneSearchComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneSearchComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [ApiService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GeneSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
