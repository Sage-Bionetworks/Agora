import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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

import { TabMenu } from 'primeng/tabmenu';

describe('Component: Navbar', () => {
    let component: NavbarComponent;
    let navService: NavigationServiceStub;
    let fixture: ComponentFixture<NavbarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                NavbarComponent,
                MockComponent(TabMenu)
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
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a tab menu', () => {
        const el = fixture.debugElement.query(By.css('p-tabMenu'));
        expect(el).toBeDefined();

        const aEl = fixture.debugElement.queryAll(By.css('p-tabMenu'));
        expect(aEl.length).toEqual(1);
    });
});
