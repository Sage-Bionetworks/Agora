import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';

import { ContribTeamsPageComponent } from './contrib-teams.component';
import { LoadingComponent } from '../../shared/components/loading';

import {
    RouterStub,
    ApiServiceStub,
    GeneServiceStub,
    NavigationServiceStub,
    mockTeam1,
    mockTeam2
} from '../../testing';
import { TeamInfo } from '../../models';

import { ApiService, GeneService, NavigationService } from '../services';
import { OrderBy } from '../../shared/pipes';

import { MockComponent } from 'ng-mocks';

import { of } from 'rxjs';

describe('Component: ContribTeamsPage', () => {
    let component: ContribTeamsPageComponent;
    let fixture: ComponentFixture<ContribTeamsPageComponent>;
    let apiService: ApiServiceStub;

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
                { provide: NavigationService, useValue: new NavigationServiceStub() },
                TitleCasePipe
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(ContribTeamsPageComponent);

        // Get the injected instances
        apiService = fixture.debugElement.injector.get(ApiService);

        component = fixture.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load the teams', () => {
        const gatSpy = spyOn(apiService, 'getAllTeams').and.returnValue(of(
            [mockTeam1, mockTeam2]
        ));
        const ltSpy = spyOn(component, 'loadTeams').and.callThrough();

        component.loadTeams();
        fixture.detectChanges();
        component.obsTeams.subscribe((data) => {
            // Both mock teamInfos we set above
            expect(data.length).toEqual(2);

        });

        expect(gatSpy).toHaveBeenCalled();
        expect(ltSpy).toHaveBeenCalled();
    });

    it('should find the primary investigator index', () => {
        const rpiSpy = spyOn(component, 'findPrimaryIndex').and.callThrough();

        // const piIndex = component.findPrimaryIndex(mockTeam1.members);
        expect(component.findPrimaryIndex(mockTeam1.members)).toEqual(2);
        fixture.detectChanges();
        expect(rpiSpy).toHaveBeenCalled();
    });

    it('should reorder the team info', () => {
        const rtiSpy = spyOn(component, 'reorderTeamInfo').withArgs(mockTeam1)
            .and.callThrough();
        const rpiSpy = spyOn(component, 'reorderPrimaryInvestigator').and.callThrough();
        const fpiSpy = spyOn(component, 'findPrimaryIndex').and.returnValue(2);

        const mt = mockTeam1;
        component.reorderTeamInfo(mt);
        fixture.detectChanges();

        // The mockTeam1 is the Duke team
        expect(rtiSpy).toHaveBeenCalled();
        expect(rpiSpy).toHaveBeenCalled();
        expect(fpiSpy).toHaveBeenCalled();

        expect(rpiSpy).toHaveBeenCalledWith(mockTeam1.members, 2, 0);
    });

    it('should reorder the primary investigator', () => {
        const rpiSpy = spyOn(component, 'reorderPrimaryInvestigator').and.callThrough();

        const mt = mockTeam1;
        component.reorderPrimaryInvestigator(mt.members, 2, 0);
        fixture.detectChanges();
        // The mockTeam1 is the Duke team
        expect(rpiSpy).toHaveBeenCalled();
        expect(rpiSpy).toHaveBeenCalledWith(mockTeam1.members, 2, 0);
        expect(mt.members[0].name).toBe('Rima Kaddurah-Daouk');
    });
});
