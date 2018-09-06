import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';

import { FooterComponent } from './footer.component';

import {
    RouterStub,
    DataServiceStub,
    GeneServiceStub
} from '../../testing';

import { DataService, GeneService } from '../services';

describe('NavbarComponent', () => {
    let component: FooterComponent;
    let fixture: ComponentFixture<FooterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FooterComponent
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

        fixture = TestBed.createComponent(FooterComponent);
        component = fixture.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
