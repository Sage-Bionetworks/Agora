import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    DistributionData,
    Gene,
    GeneInfo,
    GeneScoreDistribution,
} from '../../../models';
import { ApiService, GeneService } from '../../../core/services';
import { Observable } from 'rxjs';
import { SOEChartProps } from './soe-chart/soe-chart.component';

@Component({
    selector: 'soe',
    templateUrl: './soe.component.html',
    styleUrls: ['./soe.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SOEComponent implements OnInit {
    @Input() gene: Gene;
    @Input() geneInfo: GeneInfo;
    @Input() id: string;
    @Input() geneScoresResponse: Observable<GeneScoreDistribution>;

    cols: any[];
    summary: any[];
    scoresDataLoaded: boolean = false;
    scoreCategories: string[] = [
        'geneticsscore',
        'omicsscore',
        'literaturescore',
        'logsdon',
    ];

    distributionDataAndScore: SOEChartProps[];

    constructor(
        private route: ActivatedRoute,
        private geneService: GeneService,
        private apiService: ApiService
    ) {}

    ngOnInit() {
        if (!this.gene) {
            this.gene = this.geneService.getCurrentGene();
        }
        if (!this.geneInfo) {
            this.geneInfo = this.geneService.getCurrentInfo();
        }
        if (!this.id) {
            this.id = this.route.snapshot.paramMap.get('id');
        }

        // Add gene scores distribution
        this.geneScoresResponse = this.apiService.getAllGeneScores();
        this.geneScoresResponse.subscribe(
            (data: GeneScoreDistribution) => {
                const rawData: GeneScoreDistribution = data;
                delete rawData._id; // id is not needed for looping in the UI
                delete rawData.flyneuropathscore;
                this.distributionDataAndScore = this.initChartData(rawData);
            },
            (error) => {
                console.log(
                    'Error loading gene scores distribution: ' + error.message
                );
            },
            () => {
                this.scoresDataLoaded = true;
            }
        );

        // Adds the summary entries
        this.initData();
    }

    initData() {
        this.summary = [
            {
                property: {
                    title: 'Genetic Association with LOAD',
                    description:
                        'Indicates whether or not this gene shows significant genetic association with Late Onset AD (LOAD) based on the',
                    link: 'https://doi.org/10.1038/s41588-019-0358-2',
                    anchorText:
                        "International Genomics of Alzheimer's Project (IGAP) genome-wide association study",
                },
                state:
                    this.geneInfo.isIGAP === undefined
                        ? false
                        : this.geneInfo.isIGAP,
                isStateApplicable: true,
                hasLink: false,
                extraText: '',
            },
            {
                property: {
                    title: 'Brain eQTL',
                    description:
                        'Indicates whether or not this gene locus has a significant expression Quantitative Trait Locus (eQTL) based on an',
                    link: 'https://www.nature.com/articles/s41597-020-00642-8',
                    anchorText: 'AMP-AD consortium study',
                },
                state:
                    this.geneInfo.haseqtl === undefined
                        ? false
                        : this.geneInfo.haseqtl,
                isStateApplicable: true,
                hasLink: false,
                extraText: '',
            },
            {
                property: {
                    title: 'RNA Expression Change in AD Brain',
                    description:
                        "Indicates whether or not this gene shows significant differential expression in at least one brain region based on AMP-AD consortium work. See 'EVIDENCE' tab.",
                },
                state:
                    this.geneInfo.isAnyRNAChangedInADBrain === undefined
                        ? false
                        : this.geneInfo.isAnyRNAChangedInADBrain,
                isStateApplicable: this.geneInfo.rna_brain_change_studied,
                hasLink: false,
                extraText: '',
            },
            {
                property: {
                    title: 'Protein Expression Change in AD Brain',
                    description:
                        "Indicates whether or not this gene shows significant differential protein expression in at least one brain region based on AMP-AD consortium work. See 'EVIDENCE' tab.",
                },
                state:
                    this.geneInfo.isAnyProteinChangedInADBrain === undefined
                        ? false
                        : this.geneInfo.isAnyProteinChangedInADBrain,
                isStateApplicable: this.geneInfo.protein_brain_change_studied,
                hasLink: false,
                extraText: '',
            },
            {
                property: {
                    title: 'Nominated Target',
                    description:
                        'Indicates whether or not this gene has been submitted as a nominated target to Agora.',
                },
                state:
                    this.geneInfo.nominations === undefined
                        ? false
                        : this.geneInfo.nominations,
                isStateApplicable: true,
                hasLink: false,
                extraText: '',
            },
        ];

        this.cols = [
            { field: 'property', header: 'Property' },
            { field: 'state', header: 'State' },
        ];
    }

    initChartData(rawData: GeneScoreDistribution): SOEChartProps[] {
        const overallScores = this.geneService.getCurrentGeneOverallScores();

        // Data files sometimes have lowercase keys or camel case keys. Change all to lowercase
        Object.keys(overallScores).forEach((key) => {
            const temp = overallScores[key];
            delete overallScores[key];
            overallScores[key.toLowerCase()] = temp;
        });

        Object.keys(rawData).forEach((key) => {
            const temp = rawData[key];
            delete rawData[key];
            rawData[key.toLowerCase()] = temp;
        });

        return this.scoreCategories.map((category) => {
            return {
                title: rawData[category]?.name ?? category,
                wikiInfo: {
                    ownerId: rawData[category]?.syn_id,
                    wikiId: rawData[category]?.wiki_id,
                },
                distributionData: rawData[category],
                geneScore: overallScores[category],
            };
        });
    }

    // If the 'state' value can be modified by another boolean value, pass the modifying value as 'isStateApplicable'
    // Example: rna_brain_change_studied: false indicates that isAnyRNAChangedInADBrain is
    // undefined, so calling:
    //     getText(isAnyRNACHangedInADBrain, rna_brain_change_studied)
    // will return the desired 'No data' text, regardless of the isAnyRNAChangedInAdBrain value
    getText(state?: boolean, isStateApplicable: boolean = true): string {
        let text = '';

        if (!isStateApplicable) {
            text = 'No data';
        } else {
            if (state) {
                text = 'True';
            } else {
                if (state === undefined) {
                    text = 'No data';
                } else {
                    text = 'False';
                }
            }
        }
        return text;
    }

    // Use black text if 'isStateApplicable' is false ('No data')
    // Otherwise, use green text when 'state' is true, use red text when 'state' is false
    getTextColorClass(state: boolean, isStateApplicable: boolean = true): any {
        const colorClassObj = {} as any;
        if (state && isStateApplicable) {
            colorClassObj['green-text'] = true;
        } else if (!state && isStateApplicable) {
            colorClassObj['red-text'] = true;
        }
        return colorClassObj;
    }

    openExternalLink(url) {
        if (!url) {
            return;
        }
        window.open(url, '_blank');
    }
}
