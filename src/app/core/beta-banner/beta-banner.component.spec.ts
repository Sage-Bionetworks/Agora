import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TitleCasePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { BetaBannerComponent } from './beta-banner.component';

import {
    ActivatedRouteStub,
    RouterStub,
    DataServiceStub,
    GeneServiceStub
} from '../../testing';

import { DataService, GeneService } from '../services';

import { MockComponent } from 'ng-mocks';

import { Button } from 'primeng/button';

describe('NavbarComponent', () => {
    let component: BetaBannerComponent;
    let fixture: ComponentFixture<BetaBannerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                MockComponent(Button),
                BetaBannerComponent
            ],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: DataService, useValue: new DataServiceStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                TitleCasePipe
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(BetaBannerComponent);
        component = fixture.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
