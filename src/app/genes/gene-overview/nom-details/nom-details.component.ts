import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

import { Gene, GeneInfo, TeamInfo, NominatedTarget } from '../../../models';

import {
    ApiService,
    GeneService,
    NavigationService
} from '../../../core/services';

@Component({
    selector: 'nom-details',
    templateUrl: './nom-details.component.html',
    styleUrls: [ './nom-details.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class NominationDetailsComponent implements OnInit {
    @Input() gene: Gene;
    @Input() geneInfo: GeneInfo;
    @Input() id: string;
    @Input() teams: TeamInfo[] = [];
    @Input() ntInfoArray: NominatedTarget[] = [];
    @Input() placeholderUrl: string = '/assets/img/placeholder_member.png';

    dataLoaded: boolean = false;
    memberImages: any[] = [];

    constructor(
        private navService: NavigationService,
        private apiService: ApiService,
        private geneService: GeneService,
        private titleCase: TitleCasePipe
    ) {}

    ngOnInit() {
        if (!this.gene) { this.gene = this.geneService.getCurrentGene(); }
        if (!this.geneInfo) { this.geneInfo = this.geneService.getCurrentInfo(); }

        if (!this.id) { this.id = this.navService.id; }

        // Check if we tried to load this path straight away
        if (!this.geneInfo) {
            this.navService.goToRoute('/genes', {
                outlets: {
                    'genes-router': [ 'gene-details', this.id ]
                }
            });
        } else {
            this.loadTeams();
        }
    }

    loadTeams() {
        const teamNames = this.geneService.getCurrentInfo().nominatedtarget.map(info  => info.team);
        this.apiService.getTeams(teamNames).subscribe((data: TeamInfo[]) => {
            if (!data) { this.navService.getRouter().navigate(['/genes']); }
            // Data array has the correct teams order already
            this.teams = data;

            // Team names with the correct order
            const tiTeamsArray = data.slice().map((ti) => ti.team);
            // Team infos out of order from geneInfo.nominatedTarget
            const ntInfoArray = this.geneInfo.nominatedtarget.slice().map((ti) => ti.team);

            // This will be the new ordered array
            const newNtInfoArray: NominatedTarget[] = [];
            tiTeamsArray.forEach((team: string) => {
                newNtInfoArray.push(this.geneInfo.nominatedtarget[ntInfoArray.indexOf(team)]);
            });
            this.ntInfoArray = newNtInfoArray;
        }, (error) => {
            console.log('Error loading gene: ' + error.message);
        }, () => {
            this.dataLoaded = true;
        });
    }

    viewNomProcess(index: number) {
        window.open('https://adknowledgeportal.synapse.org/Explore/Studies/DetailsPage?Study=' +
            this.ntInfoArray[index].data_synapseid, '_blank');
    }

    toTitleCase(index: number, field: string): string {
        return this.titleCase.transform(this.ntInfoArray[index][field]);
    }

    getFullDisplayName(program: string, teamFullName: string): string {
        return (program) ? program + ': ' + teamFullName : teamFullName;
    }
}
