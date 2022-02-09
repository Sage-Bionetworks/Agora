import {
    TestBed
} from '@angular/core/testing';

import {
    DialogsServiceStub
} from '../../testing';

import { DialogsService } from './';

describe('Service: Dialogs: TestBed', () => {
    let geneService: DialogsServiceStub;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: DialogsService, useValue: new DialogsServiceStub() }
            ]
        });

        geneService = TestBed.inject(DialogsService);
    });

    it('should create an instance', () => {
        expect(geneService).toBeDefined();
    });
});
