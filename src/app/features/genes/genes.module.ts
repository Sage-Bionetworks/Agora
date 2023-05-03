// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { SharedModule } from '../../shared';
import { ChartsModule } from '../../features/charts';

// -------------------------------------------------------------------------- //
// Components
// -------------------------------------------------------------------------- //
import {
  GeneModelSelectorComponent,
  GeneProteinSelectorComponent,
  GeneTableComponent,
  GeneSearchComponent,
  GeneNominatedTargetsComponent,
  GeneSimilarComponent,
  GeneHeroComponent,
  GeneComparisonToolComponent,
  GeneComparisonToolDetailsPanelComponent,
  GeneComparisonToolFilterPanelComponent,
  GeneComparisonToolFilterListComponent,
  GeneComparisonToolHowToPanelComponent,
  GeneComparisonToolLegendPanelComponent,
  GeneComparisonToolPinnedGenesModalComponent,
  GeneSoeComponent,
  GeneSoeChartsComponent,
  GeneSoeListComponent,
  GeneEvidenceRnaComponent,
  GeneEvidenceProteomicsComponent,
  GeneEvidenceMetabolomicsComponent,
  GeneNetworkComponent,
  GeneResourcesComponent,
  GeneDruggabilityComponent,
  ExperimentalValidationComponent,
  GeneNominationsComponent,
  GeneDetailsComponent,
  GeneBioDomainsComponent
} from './components';

// -------------------------------------------------------------------------- //
// Services
// -------------------------------------------------------------------------- //
import { GeneService } from './services';

@NgModule({
  declarations: [
    GeneModelSelectorComponent,
    GeneProteinSelectorComponent,
    GeneTableComponent,
    GeneSearchComponent,
    GeneNominatedTargetsComponent,
    GeneSimilarComponent,
    GeneHeroComponent,
    ExperimentalValidationComponent,
    GeneNominationsComponent,
    GeneSoeComponent,
    GeneSoeChartsComponent,
    GeneSoeListComponent,
    GeneEvidenceRnaComponent,
    GeneEvidenceProteomicsComponent,
    GeneEvidenceMetabolomicsComponent,
    GeneNetworkComponent,
    GeneDetailsComponent,
    GeneResourcesComponent,
    GeneDruggabilityComponent,
    GeneComparisonToolComponent,
    GeneComparisonToolDetailsPanelComponent,
    GeneComparisonToolFilterPanelComponent,
    GeneComparisonToolFilterListComponent,
    GeneComparisonToolHowToPanelComponent,
    GeneComparisonToolLegendPanelComponent,
    GeneComparisonToolPinnedGenesModalComponent,
    GeneBioDomainsComponent
  ],
  imports: [CommonModule, SharedModule, ChartsModule],
  exports: [
    GeneModelSelectorComponent,
    GeneProteinSelectorComponent,
    GeneTableComponent,
    GeneSearchComponent,
    GeneNominatedTargetsComponent,
    GeneSimilarComponent,
    GeneHeroComponent,
    GeneSoeComponent,
    GeneSoeChartsComponent,
    GeneSoeListComponent,
    GeneEvidenceRnaComponent,
    GeneEvidenceProteomicsComponent,
    GeneEvidenceMetabolomicsComponent,
    GeneNetworkComponent,
    GeneResourcesComponent,
    GeneDruggabilityComponent,
    ExperimentalValidationComponent,
    GeneNominationsComponent,
    GeneComparisonToolComponent,
    GeneComparisonToolDetailsPanelComponent,
    GeneComparisonToolFilterPanelComponent,
    GeneComparisonToolFilterListComponent,
    GeneComparisonToolHowToPanelComponent,
    GeneComparisonToolLegendPanelComponent,
    GeneComparisonToolPinnedGenesModalComponent,
    GeneBioDomainsComponent
  ],
  providers: [GeneService],
})
// Changed the name so it does not conflict with primeng module
export class GenesModule {}
