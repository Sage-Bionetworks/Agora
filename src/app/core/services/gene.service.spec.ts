import {
    async,
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ReflectiveInjector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
    RouterStub,
    GeneServiceStub,
    mockInfo1
} from '../../testing';

import { GeneService } from '../../core/services';

describe('Service: Gene: TestBed', () => {
    let geneService: GeneServiceStub;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: GeneService, useValue: new GeneServiceStub() }
            ]
        });

        geneService = TestBed.get(GeneService);
    });

    it('should create an instance', () => {
        expect(geneService).toBeDefined();
    });
});
