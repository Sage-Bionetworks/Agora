// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { Component, OnInit } from '@angular/core';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { ApiService } from '../../../../core/services';
import {
  Gene,
  TargetNomination,
  GeneTableColumn,
  GenesResponse,
} from '../../../../models';

// -------------------------------------------------------------------------- //
// Component
// -------------------------------------------------------------------------- //
@Component({
  selector: 'gene-nominated-targets',
  templateUrl: './gene-nominated-targets.component.html',
  styleUrls: ['./gene-nominated-targets.component.scss'],
})
export class GeneNominatedTargetsComponent implements OnInit {
  genes: Gene[] = [];
  searchTerm = '';
  nominations: number[] = [];

  columns: GeneTableColumn[] = [
    { field: 'hgnc_symbol', header: 'Gene Symbol', selected: true },
    { field: 'total_nominations', header: 'Nominations', selected: true },
    {
      field: 'initial_nomination_display_value',
      header: 'Year First Nominated',
      selected: true,
    },
    {
      field: 'teams_display_value',
      header: 'Nominating Teams',
      selected: true,
    },
    { field: 'study_display_value', header: 'Cohort Study', selected: true },
    {
      field: 'programs_display_value',
      header: 'Program',
      selected: false,
    },
    {
      field: 'input_data_display_value',
      header: 'Input Data',
      selected: false,
    },
    {
      field: 'pharos_class_display_value',
      header: 'Pharos Class',
      selected: false,
    },
    {
      field: 'sm_druggability_display_value',
      header: 'Small Molecule Druggability',
      selected: false,
    },
    {
      field: 'safety_rating_display_value',
      header: 'Safety Rating',
      selected: false,
    },
    {
      field: 'ab_modality_display_value',
      header: 'Antibody Modality',
      selected: false,
    },
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getNominatedGenes().subscribe((response: GenesResponse) => {
      const genes = response.items;

      genes.forEach((de: Gene) => {
        let teamsArray: string[] = [];
        let studyArray: string[] = [];
        let programsArray: string[] = [];
        let inputDataArray: string[] = [];
        let initialNominationArray: number[] = [];

        if (de.total_nominations) {
          if (!this.nominations.includes(de.total_nominations)) {
            this.nominations.push(de.total_nominations);
            this.nominations.sort();
          }
        }

        // Handle TargetNomination fields
        // First map all entries nested in the data to a new array
        if (de.target_nominations?.length) {
          teamsArray = de.target_nominations.map((nt: TargetNomination) => nt.team);
          studyArray = de.target_nominations.map(
            (nt: TargetNomination) => nt.study
          );
          programsArray = de.target_nominations.map(
            (nt: TargetNomination) => nt.source
          );
          inputDataArray = de.target_nominations.map(
            (nt: TargetNomination) => nt.input_data
          );

          initialNominationArray = de.target_nominations
            .map((nt: TargetNomination) => nt.initial_nomination)
            .filter((item) => item !== undefined);
        }

        // Check if there are any strings with commas inside,
        // if there are separate those into new split strings
        teamsArray = this.commaFlattenArray(teamsArray);
        studyArray = this.commaFlattenArray(studyArray);
        programsArray = this.commaFlattenArray(programsArray);
        inputDataArray = this.commaFlattenArray(inputDataArray);

        // Populate targetNomination display fields
        de.teams_display_value = '';
        if (teamsArray.length) {
          de.teams_display_value = teamsArray
            .filter(this.getUnique)
            .sort((a: string, b: string) => a.localeCompare(b))
            .join(', ');
        }

        de.study_display_value = '';
        if (teamsArray.length) {
          de.study_display_value = studyArray
            .filter(this.getUnique)
            .sort((a: string, b: string) => a.localeCompare(b))
            .join(', ');
        }

        de.programs_display_value = '';
        if (programsArray.length) {
          de.programs_display_value = programsArray
            .filter(this.getUnique)
            .sort((a: string, b: string) => a.localeCompare(b))
            .join(', ');
        }

        de.input_data_display_value = '';
        if (inputDataArray.length) {
          de.input_data_display_value = inputDataArray
            .filter(this.getUnique)
            .sort((a: string, b: string) => a.localeCompare(b))
            .join(', ');
        }

        de.initial_nomination_display_value = initialNominationArray.length
          ? Math.min(...initialNominationArray)
          : undefined;

        // Populate Druggability display fields
        if (de.druggability && de.druggability.length) {
          de.pharos_class_display_value = de.druggability[0].pharos_class
            ? de.druggability[0].pharos_class
            : 'No value';
          de.sm_druggability_display_value =
            de.druggability[0].sm_druggability_bucket +
            ': ' +
            de.druggability[0].classification;
          de.safety_rating_display_value =
            de.druggability[0].safety_bucket +
            ': ' +
            de.druggability[0].safety_bucket_definition;
          de.ab_modality_display_value =
            de.druggability[0].abability_bucket +
            ': ' +
            de.druggability[0].abability_bucket_definition;
        } else {
          de.pharos_class_display_value = 'No value';
          de.sm_druggability_display_value = 'No value';
          de.safety_rating_display_value = 'No value';
          de.ab_modality_display_value = 'No value';
        }
      });

      this.genes = genes;
    });
  }

  getUnique(value: string, index: number, self: any) {
    return self.indexOf(value) === index;
  }

  commaFlattenArray(array: any[]): any[] {
    const finalArray: any[] = [];
    if (array.length) {
      array.forEach((t) => {
        if (t) {
          const i = t.indexOf(', ');
          if (i > -1) {
            const tmpArray = t.split(', ');
            finalArray.push(tmpArray[0]);
            finalArray.push(tmpArray[1]);
          } else {
            finalArray.push(t);
          }
        } else {
          finalArray.push('');
        }
      });
      array = finalArray;
    }

    return array;
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value || '';
  }
}
