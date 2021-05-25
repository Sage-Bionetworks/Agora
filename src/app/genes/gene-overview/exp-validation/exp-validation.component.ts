import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { GeneExpValidation } from "../../../models";
import { ActivatedRoute } from "@angular/router";
import { GeneService } from "../../../core/services";

@Component({
    selector: 'exp-validation',
    templateUrl: './exp-validation.component.html',
    styleUrls: [ './exp-validation.component.scss' ],
    encapsulation: ViewEncapsulation.None
})

export class ExpValidationComponent implements OnInit {

    @Input() data: GeneExpValidation

    constructor(
        private route: ActivatedRoute,
        private geneService: GeneService
    ) {}

    ngOnInit() {

        if (!this.data) {
            this.data = this.geneService.getCurrentExpValidation()
        }

    }

}
