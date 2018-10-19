import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'nominated-form',
    templateUrl: './nominated-form.component.html',
    styleUrls: ['./nominated-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NominatedFormComponent implements OnInit {
    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        console.log('nom');
    }
}
