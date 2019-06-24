import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { News } from '../../models';

@Component({
    selector: 'news',
    templateUrl: './news.component.html',
    styleUrls: [ './news.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class NewsComponent implements OnInit {
    news: News[] = [];

    ngOnInit() {
        // Init the news array
        this.initNews();
    }

    viewSynapseReg() {
        window.open('https://www.synapse.org/#!RegisterAccount:0', '_blank');
    }

    initNews() {
        this.news = [
            {
                data: 'JULY 2019',
                entry: [
                    {
                        header: 'Druggability Information',
                        body: 'Druggability buckets have been updated with two additional ' +
                        'categories: antibody feasibility and safety.'
                    },
                    {
                        header: 'Proteomic Data',
                        body: 'Differential protein expression between AD cases and controls ' +
                        'is now available.'
                    },
                    {
                        header: 'Metabolomic Data',
                        body: 'Differential abundance of metabolites between AD cases and ' +
                        'controls is now available.'
                    }
                ]
            },
            {
                data: 'JUNE 2019',
                entry: [
                    {
                        header: 'Nominated Targets',
                        body: 'Researchers outside the AMP-AD consortium have submitted ' +
                        'nominated targets.'
                    },
                    {
                        header: 'Druggability Information',
                        body: 'Small Molecule Druggability is now available for all genes ' +
                        'across the genome.'
                    }
                ]
            },
            {
                data: 'MAY 2019',
                entry: [
                    {
                        header: 'Nominated Targets',
                        body: 'The total number of AMP-AD nominated targets has increased ' +
                        'to 500 targets.'
                    }
                ]
            },
            {
                data: 'MARCH 2019',
                entry: [
                    {
                        header: 'Transcriptomic Data',
                        body: 'Differential expression from RNAseq is now available for all ' +
                        'genes with measurable expression across the genome.'
                    }
                ]
            }
        ];
    }
}
