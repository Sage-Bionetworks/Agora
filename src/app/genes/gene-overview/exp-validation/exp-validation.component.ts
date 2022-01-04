import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { GeneExpValidation, TeamInfo } from '../../../models';
import { ApiService, GeneService } from '../../../core/services';

@Component({
    selector: 'exp-validation',
    templateUrl: './exp-validation.component.html',
    styleUrls: [ './exp-validation.component.scss' ],
    encapsulation: ViewEncapsulation.None
})

export class ExpValidationComponent implements OnInit {

    @Input() data: GeneExpValidation[];
    @Input() teamInfo: TeamInfo[];

    constructor(
        private geneService: GeneService,
        private apiService: ApiService
    ) {}

    ngOnInit() {
        if (!this.data) {
            this.data = this.geneService.getCurrentExpValidation();
        }
        this.loadTeams();
    }

    loadTeams() {
        const teamNames = this.geneService.getCurrentExpValidation().map(expVal => expVal.team);
        this.apiService.getTeams(teamNames).subscribe((teams: TeamInfo[]) => {
            this.teamInfo = teams;
        });
    }
}
