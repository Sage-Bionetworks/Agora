// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { GCTGene } from '../../../../../../models';

// -------------------------------------------------------------------------- //
// Component
// -------------------------------------------------------------------------- //
import {
  Component,
  Output,
  EventEmitter,
  ViewEncapsulation,
  Input,
} from '@angular/core';

@Component({
  selector: 'gene-comparison-tool-pinned-genes-modal',
  templateUrl: './gene-comparison-tool-pinned-genes-modal.component.html',
  styleUrls: ['./gene-comparison-tool-pinned-genes-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GeneComparisonToolPinnedGenesModalComponent {
  @Input() pinnedGenes: GCTGene[] = [];
  @Input() pendingPinnedGenes: GCTGene[] = [];
  @Input() maxPinnedGenes = 5;

  isActive = false;

  @Output() onChange: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  show() {
    this.isActive = true;
  }

  hide() {
    this.isActive = false;
  }

  cancel() {
    this.onChange.emit(false);
    this.hide();
  }

  proceed() {
    this.onChange.emit(true);
    this.hide();
  }
}
