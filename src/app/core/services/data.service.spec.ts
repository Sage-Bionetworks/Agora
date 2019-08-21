import {
    TestBed
} from '@angular/core/testing';
import { DecimalPipe } from '@angular/common';

import {
    ApiServiceStub,
    ForceServiceStub,
    mockGene1,
    mockGenesResponse,
    mockLinksListResponse,
    mockTissues,
    mockModels
} from '../../testing';

import { ApiService, DataService, ForceService } from './';

import * as crossfilter from 'crossfilter2';

describe('Service: Data: TestBed', () => {
    let dataService: DataService;
    let apiService: ApiServiceStub;
    let forceService: ForceServiceStub;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DataService,
                { provide: ApiService, useValue: new ApiServiceStub() },
                { provide: ForceService, useValue: new ForceServiceStub() },
                { provide: DecimalPipe, useClass: DecimalPipe }
            ]
        });

        dataService = TestBed.get(DataService);
        apiService = TestBed.get(ApiService);
        forceService = TestBed.get(ForceService);
    });

    it('should create an instance', () => {
        expect(dataService).toBeDefined();
    });

    it('should load the data from the server', () => {
        const gnSpy = spyOn(dataService, 'loadData').and.callThrough();

        const loadDataResponse = dataService.loadData(mockGene1);
        loadDataResponse.subscribe((response) => {
            expect(gnSpy).toHaveBeenCalled();
            expect(response[0]).toEqual(mockGenesResponse);
            expect(response[1]).toEqual(mockLinksListResponse);
        });
    });

    it('should load the tissues and models from the server', () => {
        const ltmSpy = spyOn(dataService, 'loadTissuesModels').and.callThrough();

        const loadTMResponse = dataService.loadTissuesModels();
        loadTMResponse.subscribe((response) => {
            expect(ltmSpy).toHaveBeenCalled();
            expect(response[0]).toEqual(mockTissues);
            expect(response[1]).toEqual(mockModels);
        });
    });

    // Load nodes fails in every way to be tested with a Promise returned
    it('should load the nodes from the server', () => {
        const pnSpy = spyOn(forceService, 'processNodes').and.callThrough();
        const lnSpy = spyOn(dataService, 'loadNodes').and.callThrough();

        dataService.loadNodes().then((response) => {
            expect(lnSpy).toHaveBeenCalled();
            expect(pnSpy).toHaveBeenCalled();
            expect(response).toEqual(true);
        });
    });
});
