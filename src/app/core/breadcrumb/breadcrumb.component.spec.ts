import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { routes } from '../core-routing.module';

import { AboutComponent } from '../about/about.component';
import { NoContentComponent } from '../no-content/no-content.component';
import { BreadcrumbComponent } from './breadcrumb.component';

import { BreadcrumbService } from '../services/breadcrumb.service';

import { BreadcrumbModule } from 'primeng/breadcrumb';

describe('NavbarComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [
            BreadcrumbComponent,
            AboutComponent,
            NoContentComponent
        ],
        imports: [
            RouterTestingModule.withRoutes(routes),
            BreadcrumbModule
        ],
        providers: [ BreadcrumbService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
