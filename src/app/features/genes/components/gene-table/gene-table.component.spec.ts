// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Location } from '@angular/common';
import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GeneTableComponent } from './';
import { HelperService } from '../../../../core/services';
import { geneMock1, geneMock2 } from '../../../../testing';
import { routes } from '../../../../app.routing';

// -------------------------------------------------------------------------- //
// Tests
// -------------------------------------------------------------------------- //
describe('Component: Gene Table', () => {
  let fixture: ComponentFixture<GeneTableComponent>;
  let component: GeneTableComponent;
  let element: HTMLElement;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneTableComponent],
      imports: [RouterTestingModule.withRoutes(routes)],
      providers: [HelperService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(GeneTableComponent);
    component = fixture.componentInstance;
    location = TestBed.get(Location);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have table', () => {
    expect(element.querySelector('p-table')).toBeTruthy();
  });

  it('should have controls', () => {
    expect(element.querySelector('.gene-table-header-controls')).toBeTruthy();
  });

  it('should have data', () => {
    component.genes = [geneMock1, geneMock2];
    fixture.detectChanges();
    expect(component.table._totalRecords).not.toEqual(0);
  });

  it('should navigate when clicking gene', fakeAsync(() => {
    component.genes = [geneMock1, geneMock2];
    fixture.detectChanges();

    const row = element.querySelector('table tr:first-child td') as HTMLElement;
    expect(row).toBeTruthy();

    row.click();
    tick();
    fixture.detectChanges();

    expect(location.path()).toBe('/genes/' + geneMock1.ensembl_gene_id);
  }));
});
