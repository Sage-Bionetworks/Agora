import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';

import { ExpValidationComponent } from './exp-validation.component';
import { GeneServiceStub, mockExpValidation, RouterStub } from '../../../testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GeneService } from '../../../core/services';
import { Router } from '@angular/router';

describe('Component: ExpValidationComponent', () => {
    let component: ExpValidationComponent;
    let fixture: ComponentFixture<ExpValidationComponent>;
    let geneService: GeneServiceStub;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ExpValidationComponent
            ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: GeneService, useValue: new GeneServiceStub() },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ExpValidationComponent);
        geneService = fixture.debugElement.injector.get(GeneService);
        component = fixture.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should init the data', () => {
        const idSpy = spyOn(component, 'ngOnInit').and.callThrough();
        const gcevSpy = spyOn(geneService, 'getCurrentExpValidation').and.callThrough();
        const gctSpy = spyOn(geneService, 'getCurrentTeams').and.callThrough();

        component.ngOnInit();
        expect(idSpy.calls.any()).toEqual(true);
        expect(gcevSpy.calls.any()).toEqual(true);
        expect(gctSpy.calls.any()).toEqual(true);
    });

    it('should get the correct team', () => {
        const ltSpy = spyOn(component, 'LoadTeam').and.callThrough();

        component.ngOnInit();
        expect(ltSpy.calls.any()).toEqual(true);
        expect(component.teamInfo[0].team).toEqual('Duke');
    });

});
