import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';

import { NavbarComponent } from './navbar.component';

import {
    RouterStub,
    DataServiceStub,
    GeneServiceStub,
    NavigationServiceStub
} from '../../testing';

import { DataService, GeneService, NavigationService } from '../services';

import { MockComponent } from 'ng-mocks';

import { SplitButton } from 'primeng/splitbutton';
import { TabMenu } from 'primeng/tabmenu';

describe('Component: Navbar', () => {
    let component: NavbarComponent;
    let navService: NavigationServiceStub;
    let fixture: ComponentFixture<NavbarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                NavbarComponent,
                MockComponent(TabMenu),
                MockComponent(SplitButton)
            ],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: DataService, useValue: new DataServiceStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                { provide: NavigationService, useValue: new NavigationServiceStub() },
                TitleCasePipe
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(NavbarComponent);
        navService = fixture.debugElement.injector.get(NavigationService);
        component = fixture.componentInstance;

        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a desktop menu', fakeAsync(() => {
        component.showDesktopMenu = true;
        component.showMobileMenu = false;
        fixture.detectChanges();

        const el = fixture.debugElement.query(By.css('p-tabMenu'));
        expect(el).not.toBeNull();
    }));

    it('should have a mobile menu', () => {
        component.showDesktopMenu = false;
        component.showMobileMenu = true;
        fixture.detectChanges();

        const el = fixture.debugElement.query(By.css('p-splitButton'));
        expect(el).not.toBeNull();
    });
});
