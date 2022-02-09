import {
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
    Input,
    OnDestroy,
    AfterViewInit
} from '@angular/core';

import { PlatformLocation } from '@angular/common';

import { Router, NavigationStart } from '@angular/router';

import { ChartService } from '../../services';
import { DataService, GeneService, ApiService } from '../../../core/services';

import { Subscription } from 'rxjs';

import * as d3 from 'd3';
import * as dc from 'dc';


function boxWhiskers(d) {
    return [0, d.length - 1];
}

d3['precalculatedBox'] = function() {

    var width = 1,
        height = 1,
        duration = 0,
        domain = null,
        value = Number,
        whiskers = boxWhiskers,
        tickFormat = null;

    // For each small multiple…
    function box(g) {
        g.each(function(d, i) {

            let g = d3.select(this),
                //n = d.length,
                min = d['min'],
                max = d['max'],
                quartiles;

            if (d['first_quartile'] > d['third_quartile']) {
                quartiles = [d['third_quartile'], d['mean'], d['first_quartile']];
            }
            else {
                quartiles = [d['first_quartile'], d['mean'], d['third_quartile'] ];
            }

            // Compute whiskers. Must return exactly 2 elements, or null.
            var whiskerData = [min, max];

            // Compute outliers. If no whiskers are specified, all data are "outliers".
            // We compute the outliers as indices, so that we can join across transitions!
            // var outlierIndices = whiskerIndices
            //     ? d3.range(0, whiskerIndices[0]).concat(d3.range(whiskerIndices[1] + 1, n))
            //     : d3.range(n);

            // Compute the new x-scale.
            var x1 = d3.scaleLinear()
                .domain(domain && domain.call(this, d, i) || [min, max])
                .range([height, 0]);

            // Retrieve the old x-scale, if this is an update.
            var x0 = this.__chart__ || d3.scaleLinear()
                .domain([0, Infinity])
                .range(x1.range());

            // Stash the new scale.
            this.__chart__ = x1;

            // Note: the box, median, and box tick elements are fixed in number,
            // so we only have to handle enter and update. In contrast, the outliers
            // and other elements are variable, so we need to exit them! Variable
            // elements also fade in and out.

            // Update center line: the vertical line spanning the whiskers.
            var center = g.selectAll("line.center")
                .data(whiskerData ? [whiskerData] : []);

            center.enter().insert("line", "rect")
                .attr("class", "center")
                .attr("x1", width / 2)
                .attr("y1", function(d) { return x0(d[0]); })
                .attr("x2", width / 2)
                .attr("y2", function(d) { return x0(d[1]); })
                .style("opacity", 1e-6)
                .transition()
                .duration(duration)
                .style("opacity", 1)
                .attr("y1", function(d) { return x1(d[0]); })
                .attr("y2", function(d) { return x1(d[1]); });

            center.transition()
                .duration(duration)
                .style("opacity", 1)
                .attr("y1", function(d) { return x1(d[0]); })
                .attr("y2", function(d) { return x1(d[1]); });

            center.exit().transition()
                .duration(duration)
                .style("opacity", 1e-6)
                .attr("y1", function(d) { return x1(d[0]); })
                .attr("y2", function(d) { return x1(d[1]); })
                .remove();

            // Update innerquartile box.
            var box = g.selectAll("rect.box")
                .data([quartiles]);

            box.enter().append("rect")
                .attr("class", "box")
                .attr("x", 0)
                .attr("y", function(d) { return x0(d[2]); })
                .attr("width", width)
                .attr("fill", '#FFFFFF')
                .attr("height", function(d) { return x0(d[0]) - x0(d[2]); })
                .transition()
                .duration(duration)
                .attr("y", function(d) { return x1(d[2]); })
                .attr("height", function(d) { return x1(d[0]) - x1(d[2]); });

            box.transition()
                .duration(duration)
                .attr("y", function(d) { return x1(d[2]); })
                .attr("height", function(d) { return x1(d[0]) - x1(d[2]); });

            // Update median line.
            var medianLine = g.selectAll("line.median")
                .data([quartiles[1]]);

            medianLine.enter().append("line")
                .attr("class", "median")
                .attr("x1", 0)
                .attr("y1", x0)
                .attr("x2", width)
                .attr("y2", x0)
                .transition()
                .duration(duration)
                .attr("y1", x1)
                .attr("y2", x1);

            medianLine.transition()
                .duration(duration)
                .attr("y1", x1)
                .attr("y2", x1);

            // Update whiskers.
            var whisker = g.selectAll("line.whisker")
                .data(whiskerData || []);

            whisker.enter().insert("line", "circle, text")
                .attr("class", "whisker")
                .attr("x1", 0)
                .attr("y1", x0)
                .attr("x2", width)
                .attr("y2", x0)
                .style("opacity", 1e-6)
                .transition()
                .duration(duration)
                .attr("y1", x1)
                .attr("y2", x1)
                .style("opacity", 1);

            whisker.transition()
                .duration(duration)
                .attr("y1", x1)
                .attr("y2", x1)
                .style("opacity", 1);

            whisker.exit().transition()
                .duration(duration)
                .attr("y1", x1)
                .attr("y2", x1)
                .style("opacity", 1e-6)
                .remove();

            //Update outliers.
            // var outlier = g.selectAll("circle.outlier")
            //     .data(outlierIndices);

            // outlier.enter().insert("circle", "text")
            //     .attr("class", "outlier")
            //     .attr("r", 5)
            //     .attr("cx", width / 2)
            //     .attr("cy", function(i) { return x0(d[i]); })
            //     .style("opacity", 1e-6)
            //     .transition()
            //     .duration(duration)
            //     .attr("cy", function(i) { return x1(d[i]); })
            //     .style("opacity", 1);

            // outlier.transition()
            //     .duration(duration)
            //     .attr("cy", function(i) { return x1(d[i]); })
            //     .style("opacity", 1);

            // outlier.exit().transition()
            //     .duration(duration)
            //     .attr("cy", function(i) { return x1(d[i]); })
            //     .style("opacity", 1e-6)
            //     .remove();

            // Compute the tick format.
            var format = tickFormat || x1.tickFormat(8);

            // Update box ticks.
            var boxTick = g.selectAll("text.box")
                .data(quartiles);

            boxTick.enter().append("text")
                .attr("class", "box")
                .attr("dy", ".3em")
                .attr("dx", function(d, i) { return i & 1 ? 6 : -6 })
                .attr("x", function(d, i) { return i & 1 ? width : 0 })
                .attr("y", x0)
                .attr("text-anchor", function(d, i) { return i & 1 ? "start" : "end"; })
                .text(format)
                .transition()
                .duration(duration)
                .attr("y", x1);

            boxTick.transition()
                .duration(duration)
                .text(format)
                .attr("y", x1);

            // Update whisker ticks. These are handled separately from the box
            // ticks because they may or may not exist, and we want don't want
            // to join box ticks pre-transition with whisker ticks post-.
            var whiskerTick = g.selectAll("text.whisker")
                .data(whiskerData || []);

            whiskerTick.enter().append("text")
                .attr("class", "whisker")
                .attr("dy", ".3em")
                .attr("dx", 6)
                .attr("x", width)
                .attr("y", x0)
                .text(format)
                .style("opacity", 1e-6)
                .transition()
                .duration(duration)
                .attr("y", x1)
                .style("opacity", 1);

            whiskerTick.transition()
                .duration(duration)
                .text(format)
                .attr("y", x1)
                .style("opacity", 1);

            whiskerTick.exit().transition()
                .duration(duration)
                .attr("y", x1)
                .style("opacity", 1e-6)
                .remove();
        });

        d3.timerFlush();
    }

    box.width = function(x) {
        if (!arguments.length) return width;
        width = x;
        return box;
    };

    box.height = function(x) {
        if (!arguments.length) return height;
        height = x;
        return box;
    };

    box.tickFormat = function(x) {
        if (!arguments.length) return tickFormat;
        tickFormat = x;
        return box;
    };

    box.duration = function(x) {
        if (!arguments.length) return duration;
        duration = x;
        return box;
    };

    box.domain = function(x) {
        if (!arguments.length) return domain;
        domain = x == null ? x : (typeof x === "function" ? x : function() { return x; })
        return box;
    };

    box.value = function(x) {
        if (!arguments.length) return value;
        value = x;
        return box;
    };

    box.whiskers = function(x) {
        if (!arguments.length) return whiskers;
        whiskers = x;
        return box;
    };

    return box;
};

dc['precalculatedBoxPlot'] = function(parent) {
    var _chart = dc['coordinateGridMixin']({});

    // Returns a function to compute the interquartile range.
    function DEFAULT_WHISKERS_IQR (k) {
        return function (d) {
            var q1 = d.first_quartile,
                q3 = d.third_quartile,
                iqr = (q3 - q1) * k,
                i = -1,
                j = d.length;
            do { ++i; } while (d[i] < q1 - iqr);
            do { --j; } while (d[j] > q3 + iqr);
            return [i, j];
        };
    }

    var _whiskerIqrFactor = 1.5;
    var _whiskersIqr = DEFAULT_WHISKERS_IQR;
    var _whiskers = _whiskersIqr(_whiskerIqrFactor);

    var _box = d3['precalculatedBox']();
    var _tickFormat = null;
    var _renderDataPoints = false;
    var _dataOpacity = 0.3;
    var _dataWidthPortion = 0.8;
    var _showOutliers = true;
    var _boldOutlier = false;

    // Used in yAxisMin and yAxisMax to add padding in pixel coordinates
    // so the min and max data points/whiskers are within the chart
    var _yRangePadding = 8;

    var _boxWidth = function (innerChartWidth, xUnits) {
        if (_chart.isOrdinal()) {
            return _chart.x().bandwidth();
        } else {
            return innerChartWidth / (1 + _chart.boxPadding()) / xUnits;
        }
    };

    // default to ordinal
    _chart.x(d3.scaleBand());
    _chart.xUnits(dc.units.ordinal);

    // valueAccessor should return an array of values that can be coerced into numbers
    // or if data is overloaded for a static array of arrays, it should be `Number`.
    // Empty arrays are not included.
    _chart.data(function (group) {
        return group.all().map(function (d) {
            d.map = function (accessor) { return accessor.call(d, d); };
            return d;
        }).filter(function (d) {
            var values = _chart.valueAccessor()(d);
            return values.length !== 0;
        });
    });

    /**
     * Get or set the spacing between boxes as a fraction of box size. Valid values are within 0-1.
     * See the {@link https://github.com/d3/d3-scale/blob/master/README.md#scaleBand d3 docs}
     * for a visual description of how the padding is applied.
     * @method boxPadding
     * @memberof dc.boxPlot
     * @instance
     * @see {@link https://github.com/d3/d3-scale/blob/master/README.md#scaleBand d3.scaleBand}
     * @param {Number} [padding=0.8]
     * @returns {Number|dc.boxPlot}
     */
    _chart.boxPadding = _chart._rangeBandPadding;
    _chart.boxPadding(0.8);

    /**
     * Get or set the outer padding on an ordinal box chart. This setting has no effect on non-ordinal charts
     * or on charts with a custom {@link dc.boxPlot#boxWidth .boxWidth}. Will pad the width by
     * `padding * barWidth` on each side of the chart.
     * @method outerPadding
     * @memberof dc.boxPlot
     * @instance
     * @param {Number} [padding=0.5]
     * @returns {Number|dc.boxPlot}
     */
    _chart.outerPadding = _chart._outerRangeBandPadding;
    _chart.outerPadding(0.5);

    /**
     * Get or set the numerical width of the boxplot box. The width may also be a function taking as
     * parameters the chart width excluding the right and left margins, as well as the number of x
     * units.
     * @example
     * // Using numerical parameter
     * chart.boxWidth(10);
     * // Using function
     * chart.boxWidth((innerChartWidth, xUnits) { ... });
     * @method boxWidth
     * @memberof dc.boxPlot
     * @instance
     * @param {Number|Function} [boxWidth=0.5]
     * @returns {Number|Function|dc.boxPlot}
     */
    _chart.boxWidth = function (boxWidth) {
        if (!arguments.length) {
            return _boxWidth;
        }
        _boxWidth = typeof boxWidth === 'function' ? boxWidth : dc.utils['constant'](boxWidth);
        return _chart;
    };

    var boxTransform = function (d, i) {
        var xOffset = _chart.x()(_chart.keyAccessor()(d, i));
        return 'translate(' + xOffset + ', 0)';
    };

    _chart._preprocessData = function () {
        if (_chart.elasticX()) {
            _chart.x().domain([]);
        }
    };

    _chart.plotData = function () {
        var _calculatedBoxWidth = _boxWidth(_chart.effectiveWidth(), _chart.xUnitCount());

        _box.whiskers(_whiskers)
            .width(_calculatedBoxWidth)
            .height(_chart.effectiveHeight())
            //.value(_chart.valueAccessor())
            .domain(_chart.y().domain())
            .duration(_chart.transitionDuration())
            .tickFormat(_tickFormat)
            //.renderDataPoints(_renderDataPoints)
            //.dataOpacity(_dataOpacity)
            //.dataWidthPortion(_dataWidthPortion)
            //.renderTitle(_chart.renderTitle())
            //.showOutliers(_showOutliers)
            //.boldOutlier(_boldOutlier);

        var boxesG = _chart.chartBodyG().selectAll('g.box').data(_chart.data(), _chart.keyAccessor());
        var boxesGEnterUpdate = renderBoxes(boxesG);
        updateBoxes(boxesGEnterUpdate);
        removeBoxes(boxesG);

        _chart.fadeDeselectedArea(_chart.filter());
    };

    function renderBoxes (boxesG) {
        var boxesGEnter = boxesG.enter().append('g');

        boxesGEnter
            .attr('class', 'box')
            .attr('transform', boxTransform)
            .call(_box)
            .on('click', function (d) {
                _chart.filter(_chart.keyAccessor()(d));
                _chart.redrawGroup();
            });
        return boxesGEnter.merge(boxesG);
    }

    function updateBoxes (boxesG) {
        dc.transition(boxesG, _chart.transitionDuration(), _chart.transitionDelay())
            ['attr']('transform', boxTransform)
            .call(_box)
            .each(function (d) {
                var color = _chart.getColor(d, 0);
                d3.select(this).select('rect.box').attr('fill', color);
                d3.select(this).selectAll('circle.data').attr('fill', color);
            });
    }

    function removeBoxes (boxesG) {
        boxesG.exit().remove().call(_box);
    }

    function yAxisRangeRatio () {

        var max = parseInt(d3.max(_chart.data(), function (e) {
            return d3.max(_chart.valueAccessor()(e));
        }));

        var min = parseInt(d3.min(_chart.data(), function (e) {
            return d3.min(_chart.valueAccessor()(e));
        }));

        return ((max - min) / _chart.effectiveHeight());
    }

    _chart.fadeDeselectedArea = function (brushSelection) {
        if (_chart.hasFilter()) {
            if (_chart.isOrdinal()) {
                _chart.g().selectAll('g.box').each(function (d) {
                    if (_chart.isSelectedNode(d)) {
                        _chart.highlightSelected(this);
                    } else {
                        _chart.fadeDeselected(this);
                    }
                });
            } else {
                if (!(_chart.brushOn() || _chart.parentBrushOn())) {
                    return;
                }
                var start = brushSelection[0];
                var end = brushSelection[1];
                var keyAccessor = _chart.keyAccessor();
                _chart.g().selectAll('g.box').each(function (d) {
                    var key = keyAccessor(d);
                    if (key < start || key >= end) {
                        _chart.fadeDeselected(this);
                    } else {
                        _chart.highlightSelected(this);
                    }
                });
            }
        } else {
            _chart.g().selectAll('g.box').each(function () {
                _chart.resetHighlight(this);
            });
        }
    };

    _chart.isSelectedNode = function (d) {
        return _chart.hasFilter(_chart.keyAccessor()(d));
    };

    _chart.yAxisMin = function () {
        var padding = _yRangePadding * yAxisRangeRatio();
        var min = parseInt(d3.min(_chart.data(), function (g) { return g['min']; }));
        return dc.utils.subtract(min - padding, _chart.yAxisPadding());
    };

    _chart.yAxisMax = function () {
        var padding = _yRangePadding * yAxisRangeRatio();
        var max = parseInt(d3.max(_chart.data(), function (g) { return g['max']; }));
        return dc.utils.add(max + padding, _chart.yAxisPadding());
    };

    /**
     * Get or set the numerical format of the boxplot median, whiskers and quartile labels. Defaults
     * to integer formatting.
     * @example
     * // format ticks to 2 decimal places
     * chart.tickFormat(d3.format('.2f'));
     * @method tickFormat
     * @memberof dc.boxPlot
     * @instance
     * @param {Function} [tickFormat]
     * @returns {Number|Function|dc.boxPlot}
     */
    _chart.tickFormat = function (tickFormat) {
        if (!arguments.length) {
            return _tickFormat;
        }
        _tickFormat = tickFormat;
        return _chart;
    };

    /**
     * Get or set the amount of padding to add, in pixel coordinates, to the top and
     * bottom of the chart to accommodate box/whisker labels.
     * @example
     * // allow more space for a bigger whisker font
     * chart.yRangePadding(12);
     * @method yRangePadding
     * @memberof dc.boxPlot
     * @instance
     * @param {Function} [yRangePadding = 8]
     * @returns {Number|Function|dc.boxPlot}
     */
    _chart.yRangePadding = function (yRangePadding) {
        if (!arguments.length) {
            return _yRangePadding;
        }
        _yRangePadding = yRangePadding;
        return _chart;
    };

    /**
     * Get or set whether individual data points will be rendered.
     * @example
     * // Enable rendering of individual data points
     * chart.renderDataPoints(true);
     * @method renderDataPoints
     * @memberof dc.boxPlot
     * @instance
     * @param {Boolean} [show=false]
     * @returns {Boolean|dc.boxPlot}
     */
    _chart.renderDataPoints = function (show) {
        if (!arguments.length) {
            return _renderDataPoints;
        }
        _renderDataPoints = show;
        return _chart;
    };

    /**
     * Get or set the opacity when rendering data.
     * @example
     * // If individual data points are rendered increase the opacity.
     * chart.dataOpacity(0.7);
     * @method dataOpacity
     * @memberof dc.boxPlot
     * @instance
     * @param {Number} [opacity=0.3]
     * @returns {Number|dc.boxPlot}
     */
    _chart.dataOpacity = function (opacity) {
        if (!arguments.length) {
            return _dataOpacity;
        }
        _dataOpacity = opacity;
        return _chart;
    };

    /**
     * Get or set the portion of the width of the box to show data points.
     * @example
     * // If individual data points are rendered increase the data box.
     * chart.dataWidthPortion(0.9);
     * @method dataWidthPortion
     * @memberof dc.boxPlot
     * @instance
     * @param {Number} [percentage=0.8]
     * @returns {Number|dc.boxPlot}
     */
    _chart.dataWidthPortion = function (percentage) {
        if (!arguments.length) {
            return _dataWidthPortion;
        }
        _dataWidthPortion = percentage;
        return _chart;
    };

    /**
     * Get or set whether outliers will be rendered.
     * @example
     * // Disable rendering of outliers
     * chart.showOutliers(false);
     * @method showOutliers
     * @memberof dc.boxPlot
     * @instance
     * @param {Boolean} [show=true]
     * @returns {Boolean|dc.boxPlot}
     */
    _chart.showOutliers = function (show) {
        if (!arguments.length) {
            return _showOutliers;
        }
        _showOutliers = show;
        return _chart;
    };

    /**
     * Get or set whether outliers will be drawn bold.
     * @example
     * // If outliers are rendered display as bold
     * chart.boldOutlier(true);
     * @method boldOutlier
     * @memberof dc.boxPlot
     * @instance
     * @param {Boolean} [show=false]
     * @returns {Boolean|dc.boxPlot}
     */
    _chart.boldOutlier = function (show) {
        if (!arguments.length) {
            return _boldOutlier;
        }
        _boldOutlier = show;
        return _chart;
    };

    return _chart.anchor(parent, null);
};

@Component({
    selector: 'box-plot',
    templateUrl: './box-plot-view.component.html',
    styleUrls: [ './box-plot-view.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class BoxPlotViewComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('chart', {static: false}) boxPlot: ElementRef;
    @ViewChild('bpcol', {static: false}) bpCol: ElementRef;
    @Input() paddingLR: number = 15;
    @Input() paddingUD: number = 0;
    @Input() title: string;
    @Input() chart: any;
    @Input() info: any;
    @Input() label: string = 'box-plot';
    @Input() dim: any;
    @Input() group: any;
    @Input() rcBigRadius: number = 12.5;
    @Input() rcSmallRadius: number = 9;
    @Input() rcRadius: number = 12.5;
    @Input() boxRadius: number = 0;

    firstRender: boolean = true;
    max: number = -Infinity;
    oldMax: number = -Infinity;
    display: boolean = false;
    counter: number = 0;
    routerSubscription: Subscription;
    chartSubscription: Subscription;

    // Define the div for the tooltip
    div: any = d3.select('body').append('div')
        .attr('class', 'bp-tooltip')
        .style('width', 50)
        .style('height', 160)
        .style('opacity', 0);
    sDiv: any = d3.select('body').append('div')
        .attr('class', 'bp-axis-tooltip')
        .style('width', 50)
        .style('height', 160)
        .style('opacity', 0);

    private resizeTimer;

    constructor(
        private location: PlatformLocation,
        private router: Router,
        private dataService: DataService,
        private apiService: ApiService,
        private geneService: GeneService,
        private chartService: ChartService
    ) { }

    ngOnInit() {

        // If we move away from the overview page, remove
        // the charts
        this.routerSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this.removeSelf();
            }
        });
        this.location.onPopState(() => {
            this.removeSelf();
        });

        this.chartSubscription = this.chartService.chartsReady$.subscribe((state: boolean) => {
            if (state) {
                this.updateCircleRadius();
                this.initChart();
            }
        });
    }

    removeSelf() {
        this.display = false;
        this.removeChart();
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }
        if (this.chartSubscription) {
            this.chartSubscription.unsubscribe();
        }
        this.geneService.setEmptyGeneState(true);
    }

    removeChart() {
        if (this.chart) {
            this.chartService.removeChart(
                this.chart, this.chart.group(),
                this.chart.dimension()
            );
            this.chartService.removeChartName(this.label);
            this.chart = null;
            this.geneService.setPreviousGene(this.geneService.getCurrentGene());
        }
    }

    ngAfterViewInit() {
        this.display = true;
        // Registers this chart
        this.chartService.addChartName(this.label);
    }

    ngOnDestroy() {
        // Remove tooltips
        d3.select('.bp-tooltip').remove();
        d3.select('.bp-axis-tooltip').remove();
        d3.select('.rc-tooltip').remove();
        d3.select('.mc-tooltip').remove();
        d3.select('.pbp-tooltip').remove();
        d3.select('.pbp-axis-tooltip').remove();

        this.chartService.removeChart(this.chart);
    }

    getModel(): string {
        const model = this.geneService.getCurrentModel();
        return (model) ? model : '';
    }

    updateCircleRadius() {
        if (window.innerWidth < 768) {
            this.rcRadius = this.rcSmallRadius;
        } else {
            this.rcRadius = this.rcBigRadius;
        }
    }

    initChart() {
        const self = this;
        this.info = this.chartService.getChartInfo(this.label);

        const bpDim = {
            filter: () => {
                //
            },
            filterAll: () => {
                //
            }
        };

        const bpGroup = {
            all() {
                const distributionData = self.dataService.getRnaDistributionData();

                if (distributionData) {

                    return distributionData.map((g) => {
                        g['key'] = g['tissue'];
                        g['value'] = [g['min'], g['mean'], g['max']];
                        return g;
                    })
                }

                return [];
            },
            order() {
                //
            },
            top() {
                //
            }
        };

        this.dim = bpDim;
        this.group = bpGroup;

        this.getChartPromise().then((chart: any) => {
            this.chart = chart;

            if (this.info.attr !== 'fc') { chart.yAxis().tickFormat(d3.format('.1e')); }

            // Remove filtering for this chart
            chart.filter = function() {
                //
            };
            chart.margins({
                left: 90,
                right: 30,
                bottom: 50,
                top: 10
            });

            chart.render();
        });
    }

    getChartPromise(): Promise<any> {
        const self = this;
        return new Promise((resolve, reject) => {
            const chartInst = dc['precalculatedBoxPlot'](this.boxPlot.nativeElement)
                .dimension(this.dim)
                .yAxisLabel('LOG 2 FOLD CHANGE', 20)
                .group(this.group)
                .renderTitle(true)
                ['showOutliers'](false)
                .dataWidthPortion(0.1)
                .dataOpacity(0)
                .colors('transparent')
                .tickFormat(() => '')
                .elasticX(true)
                .elasticY(true)
                .yRangePadding(this.rcRadius * 1.5)
                .on('renderlet', function(chart) {
                    if (!chart.selectAll('g.box circle').empty()) {
                        dc.events.trigger(function() {
                            self.renderRedCircles(chart, true);
                        });
                    }

                    if (self.firstRender) {
                        self.firstRender = false;

                        dc.events.trigger(function() {
                            chart.selectAll('rect.box')
                                .attr('rx', self.boxRadius);

                            if (chart.selectAll('g.box circle').empty()) {
                                self.renderRedCircles(chart);
                            }
                        });

                        // Adds tooltip below the x axis labels
                        self.addXAxisTooltips(chart);

                        self.chartService.addChartRendered(self.label);
                    }
                });

            resolve(chartInst);
        });
    }

    updateYDomain() {
        // Draw the horizontal lines
        const currentGenes = this.dataService.getGeneEntries().slice().filter((g) => {
            return g.model === this.geneService.getCurrentModel();
        });
        currentGenes.forEach((g) => {
            if (Math.abs(+g.logfc) > this.max) {
                this.max = Math.abs(+g.logfc);
            }
        });
    }

    addXAxisTooltips(chart: any) {
        const self = this;
        chart.selectAll('g.axis.x g.tick text').each(function(d, i) {
            const n = d3.select(this).node();
            d3.select(this)
                .on('mouseover', function() {
                    // The space between the beginning of the page and the column
                    const left = self.bpCol.nativeElement.getBoundingClientRect().left;
                    // Total column width, including padding
                    const colWidth = self.bpCol.nativeElement.offsetWidth;
                    // Shows the tooltip
                    self.sDiv.transition()
                        .duration(200)
                        .style('opacity', 1);
                    // Get the text based on the brain tissue
                    self.sDiv.html(self.chartService.getTooltipText(d3.select(this).text()));

                    // The tooltip element, we need half of the width
                    const tooltip =
                        document.getElementsByClassName('bp-axis-tooltip')[0] as HTMLElement;
                    // Represents the width of each x axis tick section
                    // We get the total column width, minus both side paddings,
                    // and we divide by all tissues plus 1. Eight sections total
                    const tickSectionWidth = (
                        (colWidth - (self.paddingLR * 2)) /
                        (self.geneService.getNumOfTissues() + 1)
                    );
                    // The start position for the current section tick will be
                    // the width of a section * current index + one
                    const xTickPos = tickSectionWidth * (i + 1);
                    self.sDiv
                        .style('left',
                            (
                                // The most important calculation. We need the space
                                // between the beginning of the page and the column,
                                // plus the left padding, plus half the width of a
                                // vertical bar, plus the current tick position and we
                                // subtract half the width of the tooltip
                                left + self.paddingLR + 30 + xTickPos -
                                (tooltip.offsetWidth / 2.0)
                            ) + 'px'
                        )
                        .style('top',
                            (
                                self.bpCol.nativeElement.offsetTop
                                + chart.height()
                            ) + 'px'
                        );
                })
                .on('mouseout', function() {
                    self.sDiv.transition()
                        .duration(500)
                        .style('opacity', 0);
                });
        });
    }

    removeRedCircle(chart: any) {
        chart.selectAll('g.box circle').remove();
    }

    renderRedCircles(chart: any, translate?: boolean) {
        const self = this;
        const lineCenter = chart.selectAll('line.center');
        const yDomainLength = Math.abs(chart.yAxisMax() - chart.yAxisMin());
        const mult = (self.boxPlot.nativeElement.offsetHeight - 60) / yDomainLength;
        const currentGenes = this.dataService.getGeneEntries().slice().filter((g) => {
            return g.model === this.geneService.getCurrentModel();
        });
        const logVals: number[] = [];
        const phrases: string[] = [];
        const significanceTexts: string[] = [];
        currentGenes.forEach((g) => {
            logVals.push(self.dataService.getSignificantFigures(g.logfc));
            significanceTexts.push((g.adj_p_val <= 0.05) ?
            ' ' : 'not ');
            phrases.push(g.hgnc_symbol + ' is ' + significanceTexts[significanceTexts.length - 1] +
                'significantly differentially expressed in ' +
                g.tissue +
                ' with a log fold change value of ' + g.logfc + ' and an adjusted p-value of ' +
                g.adj_p_val + '.');
        });

        if (!translate) {
            chart.selectAll('g.box').each(function(el, i) {
                const cy = Math.abs(chart.y().domain()[1] - logVals[i]) * mult;
                const fcy = (isNaN(cy) ? 0.0 : cy);

                d3.select(this)
                    .insert('circle', ':last-child')
                    .attr('cx', lineCenter.attr('x1'))
                    .attr('cy', fcy)
                    .attr('fill', '#F47E6C')
                    .style('stroke', '#F47E6C')
                    .style('stroke-width', 3)
                    .attr('r', self.rcRadius)
                    .attr('opacity', 1)
                    .on('mouseover', function() {
                        self.div.transition()
                            .duration(200)
                            .style('opacity', .9);
                        self.div.html(phrases[i])
                            .style('left', (d3.event.pageX - 60) + 'px')
                            .style('top', (d3.event.pageY + 20) + 'px');
                    })
                    .on('mouseout', function() {
                        self.div.transition()
                            .duration(500)
                            .style('opacity', 0);
                    });
                });

            const selection = chart.select('g.axis.x').node();
            if (selection !== null) {
                const parentNode = selection.parentNode;
                const xAxisNode = selection;
                const firstChild = parentNode.firstChild;
                if (firstChild) {
                    parentNode.insertBefore(xAxisNode, firstChild);
                }
            }
        } else {
            chart.selectAll('circle').each(function(el, i) {
                const cy = Math.abs(chart.y().domain()[1] - logVals[i]) * mult;
                const fcy = (isNaN(cy) ? 0.0 : cy);
                d3.select(this)
                    .attr('cx', lineCenter.attr('x1'))
                    .attr('cy', fcy)
                    .on('mouseover', function() {
                        self.div.transition()
                            .duration(200)
                            .style('opacity', .9);
                        self.div.html(phrases[i])
                            .style('left', (d3.event.pageX - 60) + 'px')
                            .style('top', (d3.event.pageY + 20) + 'px');
                    })
                    .on('mouseout', function() {
                        self.div.transition()
                            .duration(500)
                            .style('opacity', 0);
                    });
            });
        }
    }

    onResize(event?: any) {
        const self = this;

        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(function() {
            self.updateCircleRadius();

            self.chart
                .width(self.boxPlot.nativeElement.offsetWidth)
                .height(self.boxPlot.nativeElement.offsetHeight);

            if (self.chart.rescale) {
                self.chart.rescale();
            }

            // Run code here, resizing has "stopped"
            self.chart.redraw();
        }, 100);
    }
}
