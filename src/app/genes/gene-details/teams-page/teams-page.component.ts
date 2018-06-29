import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Gene, GeneInfo, TeamInfo } from '../../../models';

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

    dataLoaded: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private geneService: GeneService,
        private dataService: DataService
    ) {}

    ngOnInit() {
        if (!this.gene) { this.gene = this.geneService.getCurrentGene(); }
        if (!this.geneInfo) { this.geneInfo = this.geneService.getCurrentInfo(); }

        if (!this.id) { this.id = this.route.snapshot.paramMap.get('id'); }
        // If we don't have a Gene or any Models/Tissues here, or in case we are
        // reloading the page, try to get it from the server and move on
        if (!this.gene || !this.geneInfo || this.id !== this.gene.ensembl_gene_id) {
            this.dataService.getGene(this.id).subscribe((data) => {
                console.log(data);
                if (!data['item']) { this.router.navigate(['/genes']); }
                this.geneService.setCurrentGene(data['item']);
                this.geneService.setCurrentInfo(data['geneInfo']);
                this.geneService.setLogFC(data['minFC'], data['maxFC']);
                this.geneService.setAdjPValue(data['minAdjPValue'], data['maxAdjPValue']);
                this.gene = data['item'];
                this.geneInfo = data['geneInfo'];

                this.loadTeam();
            });
        } else {
            this.loadTeam();
        }
    }

    loadTeam() {
        this.dataService.getTeam(this.geneService.getCurrentInfo()).subscribe((data) => {
            console.log(data);
            if (!data['items']) { this.router.navigate(['/genes']); }
            this.geneService.setCurrentTeams(data['items']);
            this.teams = data['items'];

            this.dataLoaded = true;
        });
    }

    goToRoute(path: string, outlets?: any) {
        (outlets) ? this.router.navigate([path, outlets]) : this.router.navigate([path]);
    }
}
