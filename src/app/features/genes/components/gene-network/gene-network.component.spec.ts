// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GeneNetworkComponent } from './';
import { GeneService } from '../../services';
import { ApiService } from '../../../../core/services';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene Network', () => {
  let fixture: ComponentFixture<GeneNetworkComponent>;
  let component: GeneNetworkComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneNetworkComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [GeneService, ApiService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GeneNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
