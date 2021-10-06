import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    Gene,
    GeneInfo,
    GeneScoreDistribution,
} from '../../../models';
import { ApiService, GeneService } from '../../../core/services';
import { Observable } from 'rxjs';

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
        "geneticsscore",
        "literaturescore",
        "logsdon",
        "omicsscore",
        // "flyneuropathscore"  // TODO: this should be deleted from data file soon
    ];
    chartData: any;
    commonBarSettings: any = {
        config: {
            displayModeBar: false
        },
        layout: {
            width: 350,
            xaxis: {
                title: "Gene Score".toUpperCase(),
                titlefont: {
                    size: 12,
                }
            },
            yaxis: {
                title: "Number of Genes".toUpperCase(),
                titlefont: {
                    size: 12
                }
            },
            plot_bgcolor: 'rgba(236, 236, 236, 0.25)',
        }
    }

    getBarChartAnnotation() {
        return [{
            x: 0.3,
            y: 5149,
            text: "2.5",
            ax: 0,
            ay: -10
        }]
    }

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
            const rawData: GeneScoreDistribution = data
            delete rawData._id; // id is not needed for looping in the UI
            delete rawData.flyneuropathscore
            this.chartData = this.initChartData(rawData)
        }, (error) => {
            console.log('Error loading gene scores distribution: ' + error.message);
        }, () => {
            this.scoresDataLoaded = true;
        });
        console.log(this.chartData);

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

    initChartData(rawData) {
        return this.scoreCategories.map(category => {
            if (rawData[category]) {
                return {
                    name: category,
                    data: [{
                        x: rawData[category].bins.map(num => num.toFixed(2)),
                        y: rawData[category].distribution,
                        type: "bar",
                        marker: {
                            color: "rgba(166, 132, 238, 0.25)"
                        }
                    }],
                    layout: this.commonBarSettings.layout,
                    config: this.commonBarSettings.config,
                }
            } else {
                return {
                    name: category,
                    data: {}
                }
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
