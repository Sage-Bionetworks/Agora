import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';

import { HelpComponent } from './help.component';

import {
    RouterStub,
    DataServiceStub,
    GeneServiceStub
} from '../../testing';

import { DataService, GeneService } from '../services';

import { MockComponent } from 'ng-mocks';

import { Button } from 'primeng/button';

describe('NavbarComponent', () => {
    let component: HelpComponent;
    let fixture: ComponentFixture<HelpComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                MockComponent(Button),
                HelpComponent
            ],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: DataService, useValue: new DataServiceStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                TitleCasePipe
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(HelpComponent);
        component = fixture.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
