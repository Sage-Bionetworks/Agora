import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import {
    GeneServiceStub
} from '../../../../testing';

import { ProteomicsComponent } from './proteomics.component';
import { MoreInfoComponent } from '../../../../dialogs/more-info';

import { GeneService } from '../../../../core/services';

import { MockComponent } from 'ng-mocks';

describe('Component: Proteomics', () => {
    let component: ProteomicsComponent;
    let fixture: ComponentFixture<ProteomicsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ProteomicsComponent
            ],
            // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized
            // elements and attributes
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: GeneService, useValue: new GeneServiceStub() }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(ProteomicsComponent);

        component = fixture.componentInstance; // Component test instance
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
