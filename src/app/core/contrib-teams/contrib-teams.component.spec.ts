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
import { TeamMember, TeamInfo } from '../../models';

import { ApiService, GeneService, NavigationService } from '../services';
import { OrderBy } from '../../shared/pipes';

import { MockComponent } from 'ng-mocks';

import { of } from 'rxjs';

describe('Component: ContribTeamsPage', () => {
    let component: ContribTeamsPageComponent;
    let fixture: ComponentFixture<ContribTeamsPageComponent>;
    let apiService: ApiServiceStub;
    const findTeam: TeamInfo = JSON.parse(JSON.stringify(mockTeam1)) as TeamInfo;
    const reorderTeam: TeamInfo = JSON.parse(JSON.stringify(mockTeam1)) as TeamInfo;

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

    it('should find the primary investigator index', () => {
        const rpiSpy = spyOn(component, 'findPrimaryIndex').and.callThrough();

        const piIndex: number = component.findPrimaryIndex(findTeam.members);
        fixture.detectChanges();
        expect(piIndex).toEqual(2);
        expect(rpiSpy).toHaveBeenCalled();
    });

    // Had to add these two tests here almost duplicated, Jasmine won't
    // test the spy correctly
    it('should get the investigator css class', () => {
        const gicSpy = spyOn(component, 'getInvestigatorClass').and.callThrough();

        const memberClass = component.getInvestigatorClass(findTeam.members[0]);
        fixture.detectChanges();
        // The mockTeam1 is the Duke team
        expect(gicSpy).toHaveBeenCalledWith(findTeam.members[0]);
        expect(memberClass).toBe('');

        expect(gicSpy).toHaveBeenCalled();
    });

    it('should get an empty investigator css class', () => {
        // const auxTeam2: TeamInfo = JSON.parse(JSON.stringify(mockTeam2)) as TeamInfo;
        const gicSpy = spyOn(component, 'getInvestigatorClass').and.callThrough();

        // The mockTeam2 is the MIT-Harvard team
        const memberClass2 = component.getInvestigatorClass(mockTeam2.members[0]);
        fixture.detectChanges();
        expect(gicSpy).toHaveBeenCalledWith(mockTeam2.members[0]);
        expect(memberClass2).toBe('member-url');

        expect(gicSpy).toHaveBeenCalled();
    });

    // Had to add these two tests here almost duplicated, Jasmine won't
    // test the spy correctly
    it('should open the investigator webpage if there is url', () => {
        const gicSpy = spyOn(component, 'openInvestigatorURL').and.callThrough();
        const woSpy = spyOn(window, 'open').and.callThrough();

        component.openInvestigatorURL(findTeam.members[0]);
        fixture.detectChanges();
        // The mockTeam1 is the Duke team
        expect(gicSpy).toHaveBeenCalledWith(findTeam.members[0]);
        expect(woSpy).not.toHaveBeenCalled();

        expect(gicSpy).toHaveBeenCalled();
    });

    it('should not open the investigator webpage if there is no url', () => {
        const gicSpy = spyOn(component, 'openInvestigatorURL').and.callThrough();
        const woSpy = spyOn(window, 'open').and.callThrough();

        // The mockTeam2 is the MIT-Harvard team
        component.openInvestigatorURL(mockTeam2.members[0]);
        fixture.detectChanges();
        expect(gicSpy).toHaveBeenCalledWith(mockTeam2.members[0]);
        expect(woSpy).toHaveBeenCalled();
        expect(woSpy).toHaveBeenCalledWith(mockTeam2.members[0].url, '_blank');

        expect(gicSpy).toHaveBeenCalled();
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

    it('should reorder the team info', () => {
        // This is needed or else the inplace modification to the mockTeam1 makes
        // the other tests error
        const auxTeam: TeamInfo = JSON.parse(JSON.stringify(mockTeam1)) as TeamInfo;
        const rtiSpy = spyOn(component, 'reorderTeamInfo').and.callThrough();
        const rpiSpy = spyOn(component, 'reorderPrimaryInvestigator').and.callThrough();
        const fpiSpy = spyOn(component, 'findPrimaryIndex').and.returnValue(2);

        component.reorderTeamInfo(auxTeam);
        fixture.detectChanges();

        // The mockTeam1 is the Duke team
        expect(rtiSpy).toHaveBeenCalled();
        expect(rpiSpy).toHaveBeenCalled();
        expect(fpiSpy).toHaveBeenCalled();

        expect(rpiSpy).toHaveBeenCalledWith(auxTeam.members, 2, 0);
    });

    it('should reorder the primary investigator', () => {
        const rpiSpy = spyOn(component, 'reorderPrimaryInvestigator').and.callThrough();

        component.reorderPrimaryInvestigator(reorderTeam.members, 2, 0);
        fixture.detectChanges();
        // The mockTeam1 is the Duke team
        expect(rpiSpy).toHaveBeenCalled();
        expect(rpiSpy).toHaveBeenCalledWith(reorderTeam.members, 2, 0);
        expect(reorderTeam.members[0].name).toBe('Rima Kaddurah-Daouk');
    });
});
