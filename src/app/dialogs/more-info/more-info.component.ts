import {
    Component,
    ViewEncapsulation,
    Input
} from '@angular/core';

import { DialogsService } from '../services';

@Component({
  selector: 'more-info',
  templateUrl: './more-info.component.html',
  styleUrls: [ './more-info.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class MoreInfoComponent {
    // The dialog name
    @Input() name: string = '';
    @Input() needDisplayBlock: boolean = false;

    constructor(private dialogsService: DialogsService) {}

    showDialog() {
        this.dialogsService.showDialog(this.name);
    }
}
