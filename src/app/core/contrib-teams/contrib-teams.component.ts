import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { Gene, GeneInfo, TeamInfo, NominatedTarget, TeamMember } from '../../models';

import { ApiService, NavigationService } from '../services';
import { OrderBy } from '../../shared/pipes';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'contrib-teams-page',
    templateUrl: './contrib-teams.component.html',
    styleUrls: [ './contrib-teams.component.scss' ],
    encapsulation: ViewEncapsulation.None,
    providers: [ OrderBy ]
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
        private apiService: ApiService,
        private navService: NavigationService,
        private titleCase: TitleCasePipe,
        private sanitizer: DomSanitizer,
        private orderBy: OrderBy
    ) {}

    ngOnInit() {
        this.loadTeams();
    }

    loadTeams() {
        this.obsTeams = this.apiService.getAllTeams();
        this.obsTeams.subscribe((data: TeamInfo[]) => {
            // The team info comes unordered, so we order it
            // and ask for images in order
            this.teamsImageURLs.length = data.length;
            data = this.orderBy.transform(data, ['team']);
            data.forEach((ti, i) => {
                this.teamsImageURLs[i] = [];

                // Reorder all the teamInfos based on the primary investigator.
                // This call is for the images order in particular
                this.reorderTeamInfo(ti);

                this.teamsImages[i] = this.loadMembers(ti.members, i);
            });
            // With the images in order we need to update the async
            // array that has the info or the images will be correct
            // but the teams will be in the original order
            this.obsTeams = this.obsTeams.pipe(
                map((tis: TeamInfo[]) => {
                    // Order the team infos based on crescent alphabetical order
                    tis.sort((a, b) => {
                        return a.team.toLowerCase() < b.team.toLowerCase() ? -1 : 1;
                    });
                    tis.forEach((ti) => {
                        // Reorder all the teamInfos based on the primary investigator.
                        // This call is for the displayed names order in particular
                        this.reorderTeamInfo(ti);
                    });

                    return tis;
                })
            );
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
            return { name: m.name, isprimaryinvestigator: m.isprimaryinvestigator };
        });

        // Request member images in parallel
        return this.apiService.getTeamMemberImages(memberNames);
    }

    // Reorders the team info based on the primary investigator
    reorderTeamInfo(ti: TeamInfo) {
        ti.members.sort((a, b) => (
            a.isprimaryinvestigator > b.isprimaryinvestigator) ? -1 :
            (a.isprimaryinvestigator === b.isprimaryinvestigator) ?
            ((a.name > b.name) ? 1 : -1) : 1
        );
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
                            type: 'image/jpg, image/png, image/jpeg'
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

    getInvestigatorClass(member: TeamMember) {
        return member.url ? 'member-url' : '';
    }

    openInvestigatorURL(member: TeamMember) {
        if (member.url) {
            window.open(member.url, '_blank');
        }
    }
}
