import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { GeneExpValidation, TeamInfo } from '../../../models';
import { GeneService } from '../../../core/services';

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
        private geneService: GeneService
    ) {}

    ngOnInit() {
        if (!this.data) {
            this.data = this.geneService.getCurrentExpValidation();
        }
        this.LoadTeam();
    }

    LoadTeam() {
        const teams = this.geneService.getCurrentTeams();
        if (teams.length) {
            this.teamInfo = this.data.map((item, i) => {
               return teams.filter(j => j.team === item.team)[0];
            });
        }
    }

}
