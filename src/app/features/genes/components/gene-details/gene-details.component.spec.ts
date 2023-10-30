// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GeneDetailsComponent } from './';
import { GenesModule } from '../..';
import { GeneService } from '../../services';
import { TeamService } from '../../../teams/services';
import { ApiService, HelperService } from '../../../../core/services';
import { GeneServiceStub, geneMock1 } from '../../../../testing';

class ActivatedRouteStub {
  paramMap = new Observable((observer) => {
    const paramMap = {
      id: geneMock1.ensembl_gene_id,
    };
    observer.next(convertToParamMap(paramMap));
    observer.complete();
  });
  queryParams = new Observable((observer) => {
    const paramMap = {
      model: '',
    };
    observer.next(convertToParamMap(paramMap));
    observer.complete();
  });
}
// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene Details', () => {
  let fixture: ComponentFixture<GeneDetailsComponent>;
  let component: GeneDetailsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneDetailsComponent],
      imports: [
        GenesModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteStub(),
        },
        Location,
        ApiService,
        HelperService,
        TeamService,
        {
          provide: GeneService,
          useValue: new GeneServiceStub(),
        },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GeneDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have data', () => {
    const noiSpy = spyOn(component, 'ngOnInit').and.callThrough();

    component.ngOnInit();
    fixture.detectChanges();
    expect(noiSpy).toHaveBeenCalled();
    expect(component.gene).toEqual(geneMock1);
  });
});
