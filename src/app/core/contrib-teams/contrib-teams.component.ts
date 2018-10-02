import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { Gene, GeneInfo, TeamInfo, NominatedTarget, TeamMember } from '../../models';

import { ApiService } from '../services';

import { Observable } from 'rxjs';

@Component({
    selector: 'contrib-teams-page',
    templateUrl: './contrib-teams.component.html',
    styleUrls: [ './contrib-teams.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class ContribTeamsPageComponent implements OnInit {
    @Input() gene: Gene;
    @Input() geneInfo: GeneInfo;
    @Input() id: string;
    @Input() obsTeams: Observable<TeamInfo[]>;
    @Input() ntInfoArray: NominatedTarget[] = [];
    @Input() placeholderUrl: string = '/assets/img/placeholder_member.png';

    teamsImageURLs: SafeStyle[][] = [];
    teamsImages: Array<Observable<object[]>> = [];
    dataLoaded: boolean = false;

    constructor(
        private router: Router,
        private apiService: ApiService,
        private titleCase: TitleCasePipe,
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit() {
        this.loadTeams();
    }

    loadTeams() {
        this.obsTeams = this.apiService.getAllTeams();
        this.obsTeams.subscribe((data: TeamInfo[]) => {
            this.teamsImageURLs.length = data.length;
            data.forEach((ti, i) => {
                this.teamsImageURLs[i] = [];
                this.teamsImages[i] = this.loadMembers(ti.members, i);
            });
        }, (error) => {
            console.log('Error loading member image: ' + error.message);
        }, () => {
            this.dataLoaded = true;
        });
    }

    loadMembers(members: TeamMember[], index?: number): Observable<object[]> {
        const memberImages = [];

        for (const member of members) {
            memberImages.push(new Object({
                name: null, imgUrl: null
            }));
        }
        const memberNames: TeamMember[] = members.map((m) => {
            return { name: m.name, isprimaryinvestigator: false };
        });

        // Request member images in parallel
        return this.apiService.getTeamMemberImages(memberNames);
    }

    getImageUrl(rawImage: object, teamImages: object[], i: number, j: number): SafeStyle {
        if (rawImage) {
            if (!this.teamsImageURLs[i].length) {
                this.teamsImageURLs[i].length = teamImages.length;
            }
            if (!this.teamsImageURLs[i][j]) {
                this.teamsImageURLs[i][j] = this.sanitizer.bypassSecurityTrustStyle(
                    `url(${URL.createObjectURL(
                        new Blob([new Object(rawImage) as Blob], {
                            type: 'image/jpg'
                        })
                    )}`
                );
            }
            return this.teamsImageURLs[i][j];
        } else {
            return this.sanitizer.bypassSecurityTrustStyle(`url(${this.placeholderUrl})`);
        }
    }

    toTitleCase(index: number, field: string): string {
        return this.titleCase.transform(this.ntInfoArray[index][field]);
    }

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets]) : this.router.navigate([path]);
    }
}
