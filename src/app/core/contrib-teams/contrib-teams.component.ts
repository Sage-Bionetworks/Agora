import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { Gene, GeneInfo, TeamInfo, NominatedTarget } from '../../models';

import {
    GeneService,
    DataService
} from '../services';

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
        private dataService: DataService,
        private titleCase: TitleCasePipe,
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit() {
        this.loadTeams();
    }

    loadTeams() {
        const info = this.geneService.getCurrentInfo();
        this.dataService.getAllTeams().subscribe((data) => {
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
        this.teams.forEach((t) => {
            membersLength += t.members.length;
        });
        let index = 0;
        this.teams.forEach((t) => {
            t.members.forEach((m) => {
                this.memberImages.push({ name: null, imgUrl: null });
                this.dataService.getTeamMemberImage(m.name).subscribe((data) => {
                    this.memberImages[index].name = m.name;
                    if (data) {
                        this.memberImages[index].imgUrl =
                            this.sanitizer.bypassSecurityTrustStyle(`url(${URL.createObjectURL(
                                new Blob([data], {
                                    type: 'image/jpg'
                                })
                            )}`);
                    }
                }, (error) => {
                    console.log('Error loading member image: ' + error.message);
                }, () => {
                    index++;
                    if (membersLength === index) {
                        this.dataLoaded = true;
                    }
                });
            });
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
