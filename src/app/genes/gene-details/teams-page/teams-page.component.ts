import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { Gene, GeneInfo, TeamInfo, NominatedTarget } from '../../../models';

import {
    GeneService,
    DataService
} from '../../../core/services';

@Component({
    selector: 'teams-page',
    templateUrl: './teams-page.component.html',
    styleUrls: [ './teams-page.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class TeamsPageComponent implements OnInit {
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
        private route: ActivatedRoute,
        private geneService: GeneService,
        private dataService: DataService,
        private titleCase: TitleCasePipe,
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit() {
        if (!this.gene) { this.gene = this.geneService.getCurrentGene(); }
        if (!this.geneInfo) { this.geneInfo = this.geneService.getCurrentInfo(); }

        if (!this.id) { this.id = this.route.snapshot.paramMap.get('id'); }
        // If we don't have a Gene or any Models/Tissues here, or in case we are
        // reloading the page, try to get it from the server and move on
        if (!this.gene || !this.geneInfo || this.id !== this.gene.ensembl_gene_id) {
            this.dataService.getGene(this.id).subscribe((data) => {
                if (!data['item']) { this.router.navigate(['/genes']); }
                this.geneService.updateGeneData(data);
                this.gene = data['item'];
                this.geneInfo = data['info'];
                this.ntInfoArray = this.geneInfo.nominatedtarget;
                console.log(this.ntInfoArray);
            }, (error) => {
                console.log('Error loading gene: ' + error.message);
            }, () => {
                this.loadTeams();
            });
        } else {
            this.ntInfoArray = this.geneInfo.nominatedtarget;
            this.loadTeams();
        }
    }

    loadTeams() {
        const info = this.geneService.getCurrentInfo();
        this.dataService.getTeams(info).subscribe((data) => {
            if (!data['items']) { this.router.navigate(['/genes']); }
            this.teams.length = data['items'].length;
            const ntTeamsArray = this.ntInfoArray.slice().map((nti) => nti.team);
            data['items'].forEach((item) => {
                const index = ntTeamsArray.indexOf(item.team);
                this.teams[index] = item;
            });
            console.log(this.teams);

            this.geneService.setCurrentTeams(this.teams);
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
                            this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(
                                new Blob([data], {
                                    type: 'image/jpg'
                                })
                            ));
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

    getMemberImg(name: string) {
        const memberImg = this.memberImages.find((mi) => {
            return mi.name === name;
        });
        return (memberImg && memberImg.imgUrl) ? memberImg.imgUrl : this.placeholderUrl;
    }

    toTitleCase(index: number, field: string): string {
        return this.titleCase.transform(this.ntInfoArray[index][field]);
    }

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets]) : this.router.navigate([path]);
    }
}
