import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { Gene, GeneInfo, TeamInfo, NominatedTarget } from '../../../models';

import {
    ApiService,
    GeneService
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
        private router: Router,
        private route: ActivatedRoute,
        private apiService: ApiService,
        private geneService: GeneService,
        private titleCase: TitleCasePipe,
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit() {
        if (!this.gene) { this.gene = this.geneService.getCurrentGene(); }
        if (!this.geneInfo) { this.geneInfo = this.geneService.getCurrentInfo(); }

        if (!this.id) { this.id = this.route.snapshot.paramMap.get('id'); }

        // Check if we tried to load this path straight away
        if (!this.geneInfo) {
            this.goToRoute('/genes', {
                outlets: {
                    'genes-router': [ 'gene-details', this.id ]
                }
            });
        } else {
            // We don't need to check for data here since the parent component
            // handled that
            this.ntInfoArray = this.geneInfo.nominatedtarget;
            this.loadTeams();
        }
    }

    loadTeams() {
        const info = this.geneService.getCurrentInfo();
        this.apiService.getTeams(info).subscribe((data) => {
            if (!data['items']) { this.router.navigate(['/genes']); }
            this.teams.length = data['items'].length;
            const ntTeamsArray = this.ntInfoArray.slice().map((nti) => nti.team);
            data['items'].forEach((item) => {
                const index = ntTeamsArray.indexOf(item.team);
                this.teams[index] = item;
            });

            this.geneService.setCurrentTeams(this.teams);
        }, (error) => {
            console.log('Error loading gene: ' + error.message);
        }, () => {
            this.dataLoaded = true;
        });
    }

    viewNomProcess(index: number) {
        window.open('https://www.synapse.org/#!Synapse:' +
            this.geneInfo.nominatedtarget[index].data_synapseid[0], '_blank');
    }

    toTitleCase(index: number, field: string): string {
        return this.titleCase.transform(this.ntInfoArray[index][field]);
    }

    goToRoute(path: string, outlets?: any) {
        console.log(this.router);
        console.log(outlets);
        (outlets) ? this.router.navigate([path, outlets]) : this.router.navigate([path]);
    }
}
