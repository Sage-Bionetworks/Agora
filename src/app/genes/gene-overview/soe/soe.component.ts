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
    styleUrls: [ './soe.component.scss' ],
    encapsulation: ViewEncapsulation.None
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
        'literaturescore',
        'omicsscore',
        'logsdon',
    ];

    distributionDataAndScore: SOEChartProps[]

    constructor(
        private route: ActivatedRoute,
        private geneService: GeneService,
        private apiService: ApiService,
    ) {}

    ngOnInit() {
        if (!this.gene) { this.gene = this.geneService.getCurrentGene(); }
        if (!this.geneInfo) { this.geneInfo = this.geneService.getCurrentInfo(); }
        if (!this.id) { this.id = this.route.snapshot.paramMap.get('id'); }

        // Add gene scores distribution
        this.geneScoresResponse = this.apiService.getAllGeneScores();
        this.geneScoresResponse.subscribe((data: GeneScoreDistribution) => {
            const rawData: GeneScoreDistribution = data;
            delete rawData._id; // id is not needed for looping in the UI
            delete rawData.flyneuropathscore;
            this.distributionDataAndScore = this.initChartData(rawData);
        }, (error) => {
            console.log('Error loading gene scores distribution: ' + error.message);
        }, () => {
            this.scoresDataLoaded = true;
        });

        // Adds the summary entries
        this.initData();
    }

    initData() {
        this.summary = [
            {
                property: {
                    title: 'Genetic Association with LOAD',
                    description: 'Indicates whether or not this gene shows significant genetic association with Late Onset AD (LOAD) based on the',
                    link: 'https://doi.org/10.1038/s41588-019-0358-2',
                    anchorText: 'International Genomics of Alzheimer\'s Project (IGAP) genome-wide association study'
                },
                state: (this.geneInfo.isIGAP === undefined) ? false : this.geneInfo.isIGAP,
                hasLink: false,
                extraText: ''
            },
            {
                property: {
                    title: 'Brain eQTL',
                    description: 'Indicates whether or not this gene locus has a significant expression Quantitative Trait Locus (eQTL) based on an',
                    link: 'https://doi.org/10.1101/638544',
                    anchorText: 'AMP-AD consortium study'
                },
                state: (this.geneInfo.haseqtl === undefined) ? false : this.geneInfo.haseqtl,
                hasLink: false,
                extraText: ''
            },
            {
                property: {
                    title: 'RNA Expression Change in AD Brain',
                    description: 'Indicates whether or not this gene shows significant differential expression in at least one brain region based on AMP-AD consortium work. See \'EVIDENCE\' tab.'},
                    state: (this.geneInfo.isAnyRNAChangedInADBrain === undefined) ?
                        false : this.geneInfo.isAnyRNAChangedInADBrain,
                    hasLink: false,
                    extraText: ''
            },
            {
                property: {
                    title: 'Protein Expression Change in AD Brain',
                    description: 'Indicates whether or not this gene shows significant differential protein expression in at least one brain region based on AMP-AD consortium work. See \'EVIDENCE\' tab.'},
                state: (this.geneInfo.isAnyProteinChangedInADBrain === undefined) ?
                    false : this.geneInfo.isAnyProteinChangedInADBrain,
                hasLink: false,
                extraText: ''
            },
            {
                property: {
                    title: 'Nominated Target',
                    description: 'Indicates whether or not this gene has been submitted as a nominated target to Agora.'
                },
                state: (this.geneInfo.nominations === undefined) ?
                    false : this.geneInfo.nominations,
                hasLink: false,
                extraText: ''
            }
        ];

        this.cols = [
            { field: 'property', header: 'Property' },
            { field: 'state', header: 'State' }
        ];
    }

    initChartData(rawData: GeneScoreDistribution): SOEChartProps[] {
        const overallScores = this.geneService.getCurrentGeneOverallScores();

        // Data files sometimes have lowercase keys or camel case keys. Change all to lowercase
        Object.keys(overallScores).forEach(key => {
            const temp = overallScores[key];
            delete overallScores[key];
            overallScores[key.toLowerCase()] = temp;
        });

        Object.keys(rawData).forEach(key => {
            const temp = rawData[key]
            delete rawData[key];
            rawData[key.toLowerCase()] = temp;
        });

        return this.scoreCategories.map((category) => {
            return {
                title: rawData[category]?.name ?? category,
                wikiInfo: {
                    ownerId: rawData[category]?.syn_id,
                    wikiId: rawData[category]?.wiki_id
                },
                distributionData: rawData[category],
                geneScore: overallScores[category]
            }
        });
    }


    getText(state?: boolean): string {
        let text = '';
        if (state) {
            text = 'True';
        } else {
            if (state === undefined) {
                text = 'No data';
            } else {
                text = 'False';
            }
        }
        return text;
    }

    getTextColorClass(state: boolean, normal?: boolean): any {
        const colorClassObj = {} as any;
        // The empty string is also a truthy value
        if (state) {
            colorClassObj['green-text'] = true;
        } else {
            colorClassObj['red-text'] = true;
        }

        if (normal) {
            colorClassObj['normal-heading'] = true;
        } else {
            colorClassObj['italic-heading'] = true;
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
