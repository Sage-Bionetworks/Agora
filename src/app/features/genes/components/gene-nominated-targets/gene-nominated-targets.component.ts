import { Component, OnInit } from '@angular/core';

import { GeneService } from '../../services';
import { ApiService } from '../../../../core/services';
import { HelperService } from '../../../../core/services';

import { Gene, NominatedTarget } from '../../../../models';

interface TableColumn {
  field: string;
  header: string;
  selected?: boolean;
}

@Component({
  selector: 'gene-nominated-targets',
  templateUrl: './gene-nominated-targets.component.html',
  styleUrls: ['./gene-nominated-targets.component.scss'],
})
export class GeneNominatedTargetsComponent implements OnInit {
  data: Gene[] = [];
  searchTerm = '';

  tableColumns: TableColumn[] = [
    { field: 'hgnc_symbol', header: 'Gene Symbol', selected: true },
    { field: 'nominations', header: 'Nominations', selected: true },
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
    { field: 'input_data_display_value', header: 'Input Data' },
    { field: 'pharos_class_display_value', header: 'Pharos Class' },
    {
      field: 'sm_druggability_display_value',
      header: 'Small Molecule Druggability',
    },
    { field: 'safety_rating_display_value', header: 'Safety Rating' },
    { field: 'ab_modality_display_value', header: 'Antibody Modality' },
    {
      field: 'validations_display_value',
      header: 'Experimental Validation',
    },
  ];

  constructor(
    private apiService: ApiService,
    private geneService: GeneService,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    this.apiService.getTableData().subscribe((data: Gene[]) => {
      this.data = data;

      this.data.forEach((de: Gene) => {
        let teamsArray: string[] = [];
        let studyArray: string[] = [];
        let inputDataArray: string[] = [];
        let validationStudyDetailsArray: string[] = [];
        let initialNominationArray: number[] = [];

        // Handle NominatedTargets fields
        // First map all entries nested in the data to a new array
        if (de.nominatedtarget.length) {
          teamsArray = de.nominatedtarget.map((nt: NominatedTarget) => nt.team);
          studyArray = de.nominatedtarget.map(
            (nt: NominatedTarget) => nt.study
          );
          inputDataArray = de.nominatedtarget.map(
            (nt: NominatedTarget) => nt.input_data
          );
          validationStudyDetailsArray = de.nominatedtarget
            .map((nt: NominatedTarget) => nt.validation_study_details)
            .filter((item) => item !== undefined);
          initialNominationArray = de.nominatedtarget
            .map((nt: NominatedTarget) => nt.initial_nomination)
            .filter((item) => item !== undefined);
        }

        // Check if there are any strings with commas inside,
        // if there are separate those into new split strings
        teamsArray = this.commaFlattenArray(teamsArray);
        studyArray = this.commaFlattenArray(studyArray);
        inputDataArray = this.commaFlattenArray(inputDataArray);

        // Populate NominatedTargets display fields
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

        de.input_data_display_value = '';
        if (inputDataArray.length) {
          de.input_data_display_value = inputDataArray
            .filter(this.getUnique)
            .sort((a: string, b: string) => a.localeCompare(b))
            .join(', ');
        }

        de.validations_display_value = '';
        if (validationStudyDetailsArray.length) {
          de.validations_display_value = validationStudyDetailsArray
            .filter((e) => e)
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
      // this.genesInfo = this.dataSource;
      // this.totalRecords = data.totalRecords ? data.totalRecords : 0;
      // this.loading = false;
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
