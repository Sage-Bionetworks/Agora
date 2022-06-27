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
  GeneComparisonToolFilterPanelComponent,
  GeneComparisonToolFilterListComponent,
  GeneComparisonToolDetailsPanelComponent,
  GeneSoeComponent,
  GeneSoeChartsComponent,
  GeneSoeListComponent,
  GeneEvidenceComponent,
  GeneEvidenceRnaComponent,
  GeneEvidenceProteomicsComponent,
  GeneEvidenceMetabolomicsComponent,
  GeneNetworkComponent,
  GeneResourcesComponent,
  GeneDruggabilityComponent,
  GeneExperimentalValidationComponent,
  GeneNominationsComponent,
  GeneDetailsComponent,
} from './components';

// -------------------------------------------------------------------------- //
// Services
// -------------------------------------------------------------------------- //
import { GeneService, GeneNetworkService } from './services';

@NgModule({
  declarations: [
    GeneModelSelectorComponent,
    GeneProteinSelectorComponent,
    GeneTableComponent,
    GeneSearchComponent,
    GeneNominatedTargetsComponent,
    GeneSimilarComponent,
    GeneHeroComponent,
    GeneExperimentalValidationComponent,
    GeneNominationsComponent,
    GeneSoeComponent,
    GeneSoeChartsComponent,
    GeneSoeListComponent,
    GeneEvidenceComponent,
    GeneEvidenceRnaComponent,
    GeneEvidenceProteomicsComponent,
    GeneEvidenceMetabolomicsComponent,
    GeneNetworkComponent,
    GeneDetailsComponent,
    GeneResourcesComponent,
    GeneDruggabilityComponent,
    GeneComparisonToolComponent,
    GeneComparisonToolFilterPanelComponent,
    GeneComparisonToolFilterListComponent,
    GeneComparisonToolDetailsPanelComponent,
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
    GeneEvidenceComponent,
    GeneEvidenceRnaComponent,
    GeneEvidenceProteomicsComponent,
    GeneEvidenceMetabolomicsComponent,
    GeneNetworkComponent,
    GeneResourcesComponent,
    GeneDruggabilityComponent,
    GeneExperimentalValidationComponent,
    GeneNominationsComponent,
    GeneComparisonToolComponent,
    GeneComparisonToolFilterPanelComponent,
    GeneComparisonToolFilterListComponent,
    GeneComparisonToolDetailsPanelComponent,
  ],
  providers: [GeneService, GeneNetworkService],
})
// Changed the name so it does not conflict with primeng module
export class GenesModule {}
