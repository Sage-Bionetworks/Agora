import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';

import { ContribTeamsPageComponent } from './contrib-teams.component';
import { LoadingComponent } from '../../shared/components/loading';

import {
    RouterStub,
    ApiServiceStub,
    GeneServiceStub
} from '../../testing';

import { ApiService, GeneService } from '../services';
import { OrderBy } from '../../shared/pipes';

import { MockComponent } from 'ng-mocks';

describe('NavbarComponent', () => {
    let component: ContribTeamsPageComponent;
    let fixture: ComponentFixture<ContribTeamsPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                MockComponent(LoadingComponent),
                ContribTeamsPageComponent,
                OrderBy
            ],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: ApiService, useValue: new ApiServiceStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                TitleCasePipe
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(ContribTeamsPageComponent);
        component = fixture.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
