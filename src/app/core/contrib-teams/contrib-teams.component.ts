import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { Gene, GeneInfo, TeamInfo, NominatedTarget, TeamMember } from '../../models';

import {
    ApiService,
    GeneService
} from '../services';

import { forkJoin, combineLatest } from 'rxjs';

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
    @Input() teams: TeamInfo[] = [];
    @Input() ntInfoArray: NominatedTarget[] = [];
    @Input() placeholderUrl: string = '/assets/img/placeholder_member.png';

    dataLoaded: boolean = false;
    memberImages: any[] = [];

    constructor(
        private router: Router,
        private geneService: GeneService,
        private apiService: ApiService,
        private titleCase: TitleCasePipe,
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit() {
        this.loadTeams();
    }

    loadTeams() {
        this.apiService.getAllTeams().subscribe((data) => {
            if (!data['items']) { this.router.navigate(['/genes']); }
            this.teams = data['items'];
        }, (error) => {
            console.log('Error loading gene: ' + error.message);
        }, () => {
            this.loadMembers();
        });
    }

    loadMembers() {
        let membersLength = -1;
        let allMembers = [];
        const dataArray: object[] = [];

        this.teams.forEach((t) => {
            membersLength += t.members.length;
        });
        this.teams.forEach((t) => {
            allMembers = allMembers.concat(t.members);
        });
        for (const member of allMembers) {
            this.memberImages.push(new Object({
                name: null, imgUrl: null
            }));
        }
        const memberNames: TeamMember[] = allMembers.map((m) => {
            return { name: m.name, isprimaryinvestigator: false };
        });

        // Request member images in parallel
        this.apiService.getTeamMemberImages(memberNames).subscribe((data: object) => {
            dataArray.push(data);
        }, (error) => {
            console.log('Error loading member image: ' + error.message);
        }, () => {
            this.memberImages.forEach((mi, i) => {
                mi.name = memberNames[i].name;
                if (dataArray[i]) {
                    mi.imgUrl = this.sanitizer.bypassSecurityTrustStyle(`url(${URL.createObjectURL(
                        new Blob([new Object(dataArray[i]) as Blob], {
                            type: 'image/jpg'
                        })
                    )}`);
                }
            });
            this.dataLoaded = true;
        });
    }

    getMemberImg(name: string): SafeStyle {
        const memberImg = this.memberImages.find((mi) => {
            return mi.name === name;
        });
        if (memberImg && memberImg.imgUrl) {
            return memberImg.imgUrl;
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
