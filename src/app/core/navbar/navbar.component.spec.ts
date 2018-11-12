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

describe('NavbarComponent', () => {
    let component: NavbarComponent;
    let navService: NavigationServiceStub;
    let fixture: ComponentFixture<NavbarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                NavbarComponent
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
});
