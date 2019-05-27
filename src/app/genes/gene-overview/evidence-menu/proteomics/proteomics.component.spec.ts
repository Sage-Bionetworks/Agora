import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import {
    GeneServiceStub,
    ChartServiceStub,
    ApiServiceStub
} from '../../../../testing';

import { ProteomicsComponent } from './proteomics.component';
import { MoreInfoComponent } from '../../../../dialogs/more-info';

import { ApiService, GeneService } from '../../../../core/services';

import { ChartService } from '../../../../charts/services';

import { MockComponent } from 'ng-mocks';

describe('Component: Proteomics', () => {
    let component: ProteomicsComponent;
    let fixture: ComponentFixture<ProteomicsComponent>;
    let chartService: ChartServiceStub;
    let apiService: ApiServiceStub;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ProteomicsComponent,
                MockComponent(ProteomicsComponent)
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: ChartService, useValue: new ChartServiceStub() },
                { provide: ApiService, useValue: new ApiServiceStub() },
                { provide: GeneService, useValue: new GeneServiceStub() }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(ProteomicsComponent);

        chartService = fixture.debugElement.injector.get(ChartService);
        apiService = fixture.debugElement.injector.get(ApiService);

        component = fixture.componentInstance; // Component test instance
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
