import { Injectable } from '@angular/core';

import * as d3 from 'd3';
import * as dc from 'dc';

@Injectable()
export class PlotHelperService {

    boxWhiskers(d) {
        return [0, d.length - 1];
    }

    box() {
        let width = 1;
        let height = 1;
        let duration = 0;
        let domain = null;
        let value = Number;
        let whiskers = this.boxWhiskers;
        let tickFormat = null;

        // For each small multiple…
        function box(g) {
            g.each(function(d, i) {
                const el = d3.select(this);
                // const  n = d.length;
                const min = d['min'];
                const max = d['max'];
                let quartiles;

                if (d['first_quartile'] > d['third_quartile']) {
                    quartiles = [d['third_quartile'], d['median'], d['first_quartile']];
                } else {
                    quartiles = [d['first_quartile'], d['median'], d['third_quartile'] ];
                }

                // Compute whiskers. Must return exactly 2 elements, or null.
                const whiskerData = [min, max];

                // Compute outliers. If no whiskers are specified, all data are 'outliers'.
                // We compute the outliers as indices, so that we can join across transitions!
                // let outlierIndices = whiskerIndices
                //     ? d3.range(0, whiskerIndices[0]).concat(d3.range(whiskerIndices[1] + 1, n))
                //     : d3.range(n);

                // Compute the new x-scale.
                const x1 = d3.scaleLinear()
                    .domain(domain && domain.call(this, d, i) || [min, max])
                    .range([height, 0]);

                // Retrieve the old x-scale, if this is an update.
                const x0 = this.__chart__ || d3.scaleLinear()
                    .domain([0, Infinity])
                    .range(x1.range());

                // Stash the new scale.
                this.__chart__ = x1;

                // Note: the box, median, and box tick elements are fixed in number,
                // so we only have to handle enter and update. In contrast, the outliers
                // and other elements are variable, so we need to exit them! Variable
                // elements also fade in and out.

                // Update center line: the vertical line spanning the whiskers.
                const center = el.selectAll('line.center')
                    .data(whiskerData ? [whiskerData] : []);

                center.enter().insert('line', 'rect')
                    .attr('class', 'center')
                    .attr('x1', width / 2)
                    .attr('y1', function(v) { return x0(v[0]); })
                    .attr('x2', width / 2)
                    .attr('y2', function(v) { return x0(v[1]); })
                    .style('opacity', 1e-6)
                    .transition()
                    .duration(duration)
                    .style('opacity', 1)
                    .attr('y1', function(v) { return x1(v[0]); })
                    .attr('y2', function(v) { return x1(v[1]); });

                center.transition()
                    .duration(duration)
                    .style('opacity', 1)
                    .attr('y1', function(v) { return x1(v[0]); })
                    .attr('y2', function(v) { return x1(v[1]); });

                center.exit().transition()
                    .duration(duration)
                    .style('opacity', 1e-6)
                    .attr('y1', function(v) { return x1(v[0]); })
                    .attr('y2', function(v) { return x1(v[1]); })
                    .remove();

                // Update innerquartile box.
                const _box = el.selectAll('rect.box')
                    .data([quartiles]);

                _box.enter().append('rect')
                    .attr('class', 'box')
                    .attr('x', 0)
                    .attr('y', function(v) { return x0(v[2]); })
                    .attr('width', width)
                    .attr('fill', '#FFFFFF')
                    .attr('height', function(v) { return x0(v[0]) - x0(v[2]); })
                    .transition()
                    .duration(duration)
                    .attr('y', function(v) { return x1(v[2]); })
                    .attr('height', function(v) { return x1(v[0]) - x1(v[2]); });

                _box.transition()
                    .duration(duration)
                    .attr('y', function(v) { return x1(v[2]); })
                    .attr('height', function(v) { return x1(v[0]) - x1(v[2]); });

                // Update median line.
                const medianLine = el.selectAll('line.median')
                    .data([quartiles[1]]);

                medianLine.enter().append('line')
                    .attr('class', 'median')
                    .attr('x1', 0)
                    .attr('y1', x0)
                    .attr('x2', width)
                    .attr('y2', x0)
                    .transition()
                    .duration(duration)
                    .attr('y1', x1)
                    .attr('y2', x1);

                medianLine.transition()
                    .duration(duration)
                    .attr('y1', x1)
                    .attr('y2', x1);

                // Update whiskers.
                const whisker = el.selectAll('line.whisker')
                    .data(whiskerData || []);

                whisker.enter().insert('line', 'circle, text')
                    .attr('class', 'whisker')
                    .attr('x1', 0)
                    .attr('y1', x0)
                    .attr('x2', width)
                    .attr('y2', x0)
                    .style('opacity', 1e-6)
                    .transition()
                    .duration(duration)
                    .attr('y1', x1)
                    .attr('y2', x1)
                    .style('opacity', 1);

                whisker.transition()
                    .duration(duration)
                    .attr('y1', x1)
                    .attr('y2', x1)
                    .style('opacity', 1);

                whisker.exit().transition()
                    .duration(duration)
                    .attr('y1', x1)
                    .attr('y2', x1)
                    .style('opacity', 1e-6)
                    .remove();

                // Update outliers.
                // let outlier = el.selectAll('circle.outlier')
                //     .data(outlierIndices);

                // outlier.enter().insert('circle', 'text')
                //     .attr('class', 'outlier')
                //     .attr('r', 5)
                //     .attr('cx', width / 2)
                //     .attr('cy', function(i) { return x0(d[i]); })
                //     .style('opacity', 1e-6)
                //     .transition()
                //     .duration(duration)
                //     .attr('cy', function(i) { return x1(d[i]); })
                //     .style('opacity', 1);

                // outlier.transition()
                //     .duration(duration)
                //     .attr('cy', function(i) { return x1(d[i]); })
                //     .style('opacity', 1);

                // outlier.exit().transition()
                //     .duration(duration)
                //     .attr('cy', function(i) { return x1(d[i]); })
                //     .style('opacity', 1e-6)
                //     .remove();

                // Compute the tick format.
                const format = tickFormat || x1.tickFormat(8);

                // Update box ticks.
                const boxTick = el.selectAll('text.box')
                    .data(quartiles);

                boxTick.enter().append('text')
                    .attr('class', 'box')
                    .attr('dy', '.3em')
                    .attr('dx', function(v, index) { return index && 1 ? 6 : -6; })
                    .attr('x', function(v, index) { return index && 1 ? width : 0; })
                    .attr('y', x0)
                    .attr('text-anchor', function(v, index) { return index && 1 ? 'start' : 'end'; })
                    .text(format)
                    .transition()
                    .duration(duration)
                    .attr('y', x1);

                boxTick.transition()
                    .duration(duration)
                    .text(format)
                    .attr('y', x1);

                // Update whisker ticks. These are handled separately from the box
                // ticks because they may or may not exist, and we want don't want
                // to join box ticks pre-transition with whisker ticks post-.
                const whiskerTick = el.selectAll('text.whisker')
                    .data(whiskerData || []);

                whiskerTick.enter().append('text')
                    .attr('class', 'whisker')
                    .attr('dy', '.3em')
                    .attr('dx', 6)
                    .attr('x', width)
                    .attr('y', x0)
                    .text(format)
                    .style('opacity', 1e-6)
                    .transition()
                    .duration(duration)
                    .attr('y', x1)
                    .style('opacity', 1);

                whiskerTick.transition()
                    .duration(duration)
                    .text(format)
                    .attr('y', x1)
                    .style('opacity', 1);

                whiskerTick.exit().transition()
                    .duration(duration)
                    .attr('y', x1)
                    .style('opacity', 1e-6)
                    .remove();
            });

            d3.timerFlush();
        }

        box.width = function(x) {
            if (!arguments.length) { return width; }
            width = x;
            return box;
        };

        box.height = function(x) {
            if (!arguments.length) { return height; }
            height = x;
            return box;
        };

        box.tickFormat = function(x) {
            if (!arguments.length) { return tickFormat; }
            tickFormat = x;
            return box;
        };

        box.duration = function(x) {
            if (!arguments.length) { return duration; }
            duration = x;
            return box;
        };

        box.domain = function(x) {
            if (!arguments.length) { return domain; }
            domain = x == null ? x : (typeof x === 'function' ? x : function() { return x; });
            return box;
        };

        box.value = function(x) {
            if (!arguments.length) { return value; }
            value = x;
            return box;
        };

        box.whiskers = function(x) {
            if (!arguments.length) { return whiskers; }
            whiskers = x;
            return box;
        };

        return box;
    }

    boxPlot(parent): dc.BoxPlot {
        const _chart = dc['coordinateGridMixin']({});

        // Returns a function to compute the interquartile range.
        function DEFAULT_WHISKERS_IQR(k) {
            return function(d) {
                const q1 = d.first_quartile;
                const q3 = d.third_quartile;
                const iqr = (q3 - q1) * k;
                let i = -1;
                let j = d.length;
                do { ++i; } while (d[i] < q1 - iqr);
                do { --j; } while (d[j] > q3 + iqr);
                return [i, j];
            };
        }

        const _whiskerIqrFactor = 1.5;
        const _whiskersIqr = DEFAULT_WHISKERS_IQR;
        const _whiskers = _whiskersIqr(_whiskerIqrFactor);

        const _box = this.box();
        let _tickFormat = null;
        let _renderDataPoints = false;
        let _dataOpacity = 0.3;
        let _dataWidthPortion = 0.8;
        let _showOutliers = true;
        let _boldOutlier = false;

        // Used in yAxisMin and yAxisMax to add padding in pixel coordinates
        // so the min and max data points/whiskers are within the chart
        let _yRangePadding = 8;

        let _boxWidth = function(innerChartWidth, xUnits) {
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
        _chart.data(function(group) {
            return group.all().map(function(d) {
                d.map = function(accessor) { return accessor.call(d, d); };
                return d;
            }).filter(function(d) {
                const values = _chart.valueAccessor()(d);
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
        _chart.boxWidth = function(boxWidth) {
            if (!arguments.length) {
                return _boxWidth;
            }
            _boxWidth = typeof boxWidth === 'function' ? boxWidth : dc.utils['constant'](boxWidth);
            return _chart;
        };

        const boxTransform = function(d, i) {
            const xOffset = _chart.x()(_chart.keyAccessor()(d, i));
            return 'translate(' + xOffset + ', 0)';
        };

        _chart._preprocessData = function() {
            if (_chart.elasticX()) {
                _chart.x().domain([]);
            }
        };

        _chart.plotData = function() {
            const _calculatedBoxWidth = _boxWidth(_chart.effectiveWidth(), _chart.xUnitCount());

            _box.whiskers(_whiskers)
                ['width'](_calculatedBoxWidth)
                .height(_chart.effectiveHeight())
                // .value(_chart.valueAccessor())
                .domain(_chart.y().domain())
                .duration(_chart.transitionDuration())
                .tickFormat(_tickFormat);
                // .renderDataPoints(_renderDataPoints)
                // .dataOpacity(_dataOpacity)
                // .dataWidthPortion(_dataWidthPortion)
                // .renderTitle(_chart.renderTitle())
                // .showOutliers(_showOutliers)
                // .boldOutlier(_boldOutlier);

            const boxesG = _chart.chartBodyG().selectAll('g.box').data(_chart.data(), _chart.keyAccessor());
            const boxesGEnterUpdate = renderBoxes(boxesG);
            updateBoxes(boxesGEnterUpdate);
            removeBoxes(boxesG);

            _chart.fadeDeselectedArea(_chart.filter());
        };

        function renderBoxes(boxesG) {
            const boxesGEnter = boxesG.enter().append('g');

            boxesGEnter
                .attr('class', 'box')
                .attr('transform', boxTransform)
                .call(_box)
                .on('click', function(d) {
                    _chart.filter(_chart.keyAccessor()(d));
                    _chart.redrawGroup();
                });
            return boxesGEnter.merge(boxesG);
        }

        function updateBoxes(boxesG) {
            dc.transition(boxesG, _chart.transitionDuration(), _chart.transitionDelay())
                ['attr']('transform', boxTransform)
                .call(_box)
                .each(function(d) {
                    const color = _chart.getColor(d, 0);
                    d3.select(this).select('rect.box').attr('fill', color);
                    d3.select(this).selectAll('circle.data').attr('fill', color);
                });
        }

        function removeBoxes(boxesG) {
            boxesG.exit().remove().call(_box);
        }

        function yAxisRangeRatio() {
            const max = parseInt(d3.max(_chart.data(), function(e) {
                return d3.max(_chart.valueAccessor()(e));
            }), 10);

            const min = parseInt(d3.min(_chart.data(), function(e) {
                return d3.min(_chart.valueAccessor()(e));
            }), 10);

            return ((max - min) / _chart.effectiveHeight());
        }

        _chart.fadeDeselectedArea = function(brushSelection) {
            if (_chart.hasFilter()) {
                if (_chart.isOrdinal()) {
                    _chart.g().selectAll('g.box').each(function(d) {
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
                    const start = brushSelection[0];
                    const end = brushSelection[1];
                    const keyAccessor = _chart.keyAccessor();
                    _chart.g().selectAll('g.box').each(function(d) {
                        const key = keyAccessor(d);
                        if (key < start || key >= end) {
                            _chart.fadeDeselected(this);
                        } else {
                            _chart.highlightSelected(this);
                        }
                    });
                }
            } else {
                _chart.g().selectAll('g.box').each(function() {
                    _chart.resetHighlight(this);
                });
            }
        };

        _chart.isSelectedNode = function(d) {
            return _chart.hasFilter(_chart.keyAccessor()(d));
        };

        _chart.yAxisMin = function() {
            const padding = _yRangePadding * yAxisRangeRatio();
            const min = parseInt(d3.min(_chart.data(), function(g) { return g['min']; }), 10) - 1;
            return dc.utils.subtract(min - padding, _chart.yAxisPadding());
        };

        _chart.yAxisMax = function() {
            const padding = _yRangePadding * yAxisRangeRatio();
            const max = parseInt(d3.max(_chart.data(), function(g) { return g['max']; }), 10) + 1;
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
        _chart.tickFormat = function(tickFormat) {
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
        _chart.yRangePadding = function(yRangePadding) {
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
        _chart.renderDataPoints = function(show) {
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
        _chart.dataOpacity = function(opacity) {
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
        _chart.dataWidthPortion = function(percentage) {
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
        _chart.showOutliers = function(show) {
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
        _chart.boldOutlier = function(show) {
            if (!arguments.length) {
                return _boldOutlier;
            }
            _boldOutlier = show;
            return _chart;
        };

        return _chart.anchor(parent, null);
    }
}
