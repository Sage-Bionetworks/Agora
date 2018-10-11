import {
    async,
    ComponentFixture,
    TestBed,
    fakeAsync
} from '@angular/core/testing';
import { TitleCasePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
    ActivatedRouteStub,
    RouterStub,
    ApiServiceStub,
    GeneServiceStub
} from '../../../testing';

import { TeamsPageComponent } from './teams-page.component';

import { ApiService, GeneService } from '../../../core/services';

import { MockComponent } from 'ng-mocks';

describe('Component: TeamsPage', () => {
    let component: TeamsPageComponent;
    let fixture: ComponentFixture<TeamsPageComponent>;
    let apiService: ApiServiceStub;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TeamsPageComponent,
                MockComponent(TeamsPageComponent)
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: ApiService, useValue: new ApiServiceStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
                TitleCasePipe
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(TeamsPageComponent);

        // Get the injected instances
        apiService = fixture.debugElement.injector.get(ApiService);

        component = fixture.componentInstance; // Component test instance
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
