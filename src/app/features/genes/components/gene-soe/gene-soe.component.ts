import { Component, Input } from '@angular/core';

import { Gene } from '../../../../models';

@Component({
  selector: 'gene-soe',
  templateUrl: './gene-soe.component.html',
  styleUrls: ['./gene-soe.component.scss'],
})
export class GeneSoeComponent {
  @Input() gene: Gene = {} as Gene;
}
