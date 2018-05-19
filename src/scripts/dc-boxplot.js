import * as d3 from 'd3';

function functor(v) {
    return typeof v === "function" ? v : function() {
        return v;
    };
};

// Inspired by http://informationandvisualization.de/blog/box-plot
function boxJitters() {
    var width = 1,
        height = 1,
        duration = 0,
        delay = 0,      // New in 2.1.9
        domain = null,
        min = 0,
        max = 0,
        value = Number,
        whiskers = boxWhiskers,
        quartiles = boxQuartiles,
        tickFormat = null,

        // SBC (Added new attributes)
        renderData = false,
        dataRadius = 3,
        dataBoxPercentage = 0.8,
        renderTitle = false,
        showOutliers = true,
        boldOutlier = false,
        outlierClass,
        outlierSize,
        outlierX,
        that = this;


    // For each small multiple…
    let box = (g) => {
        g.each( function (d, i) {
            d = d.map(value).sort(d3.ascending);
            var g = d3.select(this),
                n = d.length;

            // SBC Get out if there are no items.
            if (n === 0) {return;}

            // Compute quartiles. Must return exactly 3 elements.
            // Add temporary quartiles element to data (d) array.
            var quartileData = d.quartiles = quartiles(d);

            // Compute whiskers. Must return exactly 2 elements, or null.
            var whiskerIndices = whiskers && whiskers.call(this, d, i),
                whiskerData = whiskerIndices && whiskerIndices.map( (i) => {
                        return d[i];
                    });

            // Compute outliers. If no whiskers are specified, all data are 'outliers'.
            // We compute the outliers as indices, so that we can join across transitions!
            var outlierIndices = whiskerIndices ?
                d3.range(0, whiskerIndices[0]).concat(d3.range(whiskerIndices[1] + 1, n)) : d3.range(n);

            // UPGRADE SBC: Determine the maximum value based on if outliers are shown
            if (showOutliers) {
                min = d[0];
                max = d[n - 1];
            }
            else {
                min = d[whiskerIndices[0]];
                max = d[whiskerIndices[1]];
            }
            let pointIndices = d3.range(whiskerIndices[0], whiskerIndices[1] +1);

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
            var center = g.selectAll('line.center')
                .data(whiskerData ? [whiskerData] : []);

            center.enter().insert('line', 'rect')
                .attr('class', 'center')
                .attr('x1', width / 2)
                .attr('y1', function (d) {return x0(d[0])})
                .attr('x2', width / 2)
                .attr('y2', function (d) {return x0(d[1])})
                .style('opacity', 1e-6)
                .transition()
                .duration(duration)
                .delay(delay)
                .style('opacity', 1)
                .attr('y1', function (d) {return x1(d[0])})
                .attr('y2', function (d) {return x1(d[1])});

            center.transition()
                .duration(duration)
                .delay(delay)
                .style('opacity', 1)
                .attr('x1', width / 2)
                .attr('x2', width / 2)
                .attr('y1', function (d) {return x1(d[0])})
                .attr('y2', function (d) {return x1(d[1])});

            center.exit().transition()
                .duration(duration)
                .delay(delay)
                .style('opacity', 1e-6)
                .attr('y1', function (d) {return x1(d[0])})
                .attr('y2', function (d) {return x1(d[1])})
                .remove();

            // Update innerquartile box.
            var box = g.selectAll('rect.box')
                .data([quartileData]);

            box.enter().append('rect')
                .attr('class', 'box')
                .attr('x', 0)
                .attr('y', function (d) {return x0(d[2])})
                .attr('width', width)
                .attr('height', function (d) {return x0(d[0]) - x0(d[2])})
                .style('fill-opacity', (renderData) ? 0.1 : 1)
                .transition()
                .duration(duration)
                .delay(delay)
                .attr('y', function (d) {return x1(d[2])})
                .attr('height', function (d) {return x1(d[0]) - x1(d[2])});

            box.transition()
                .duration(duration)
                .delay(delay)
                .attr('width', width)
                .attr('y', function (d) {return x1(d[2])})
                .attr('height', function (d) {return x1(d[0]) - x1(d[2])});

            // Update median line.
            var medianLine = g.selectAll('line.median')
                .data([quartileData[1]]);

            medianLine.enter().append('line')
                .attr('class', 'median')
                .attr('x1', 0)
                .attr('y1',  x0)
                .attr('x2', width)
                .attr('y2', x0)
                .transition()
                .duration(duration)
                .delay(delay)
                .attr('y1', x1)
                .attr('y2', x1);

            medianLine.transition()
                .duration(duration)
                .delay(delay)
                .attr('x1', 0)
                .attr('x2', width)
                .attr('y1', x1)
                .attr('y2', x1);

            // Update whiskers.
            var whisker = g.selectAll('line.whisker')
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
                .delay(delay)
                .attr('y1', x1)
                .attr('y2', x1)
                .style('opacity', 1);

            whisker.transition()
                .duration(duration)
                .delay(delay)
                .attr('x1', 0)
                .attr('x2', width)
                .attr('y1', x1)
                .attr('y2', x1)
                .style('opacity', 1);

            whisker.exit().transition()
                .duration(duration)
                .delay(delay)
                .attr('y1', x1)
                .attr('y2', x1)
                .style('opacity', 1e-6)
                .remove();

            // Update outliers.
            if (showOutliers) {
                outlierClass = boldOutlier ? 'outlierBold' : 'outlier';
                outlierSize = boldOutlier ? 3 : 5;
                outlierX = boldOutlier
                    ? function () { return Math.floor(Math.random() * (width * dataBoxPercentage) + 1 + ((width - (width * dataBoxPercentage)) / 2))}
                    : function () {return width / 2};

                var outlier = g.selectAll('circle.'+outlierClass)
                    .data(outlierIndices, Number);

                outlier.enter().insert('circle', 'text')
                    .attr('class', outlierClass)
                    .attr('r', outlierSize)
                    .attr('cx', outlierX)
                    .attr('cy', function (i) {return x0(d[i])})
                    .style('opacity', 1e-6)
                    .transition()
                    .duration(duration)
                    .delay(delay)
                    .attr('cy', function (i) {return x1(d[i])})
                    .style('opacity', 0.6);

                if (renderTitle) {
                    outlier.selectAll('title').remove();
                    outlier.append('title').text(function (i) {return d[i]});
                }

                outlier.transition()
                    .duration(duration)
                    .delay(delay)
                    .attr('cx', outlierX)
                    .attr('cy', function (i) {return x1(d[i])})
                    .style('opacity', 0.6);

                outlier.exit().transition()
                    .duration(duration)
                    .delay(delay)
                    .attr('cy', 0) //function (i) {return x1(d[i])})
                    .style('opacity', 1e-6)
                    .remove();
            }

            // Update Values
            if (renderData) {
                var point = g.selectAll('circle.data')
                    .data(pointIndices);

                point.enter().insert('circle', 'text')
                    .attr('class', 'data')
                    .attr('r', dataRadius)
                    .attr('cx', function () {return Math.floor(Math.random() * (width * dataBoxPercentage) + 1 + ((width - (width * dataBoxPercentage)) / 2))})
                    .attr('cy', function (i) {return x0(d[i])})
                    .style('opacity', 1e-6)
                    .transition()
                    .duration(duration)
                    .delay(delay)
                    .attr('cy', function (i) {
                        return x1(d[i])})
                    .style('opacity', 0.2);

                if (renderTitle) {
                    point.selectAll('title').remove();
                    point.append('title').text(function (i) {return d[i]});
                }

                point.transition()
                    .duration(duration)
                    .delay(delay)
                    .attr('cx', function () {return Math.floor(Math.random() * (width * dataBoxPercentage) + 1 + ((width - (width * dataBoxPercentage)) / 2))})
                    .attr('cy', function (i) {
                        return x1(d[i])})
                    .style('opacity', 0.2);

                 point.exit().transition()
                     .duration(duration)
                     .delay(delay)
                     .attr('cy', 0)
                     .style('opacity', 1e-6)
                     .remove();
            }

            // Compute the tick format.
            var format = tickFormat || x1.tickFormat(8);

            // Update box ticks.
            var boxTick = g.selectAll('text.box')
                .data(quartileData);

            boxTick.enter().append('text')
                .attr('class', 'box')
                .attr('dy', '.3em')
                .attr('dx', function (d, i) {
                    return i & 1 ? 6 : -6;
                })
                .attr('x', function (d, i) {
                    return i & 1 ? width : 0;
                })
                .attr('y', x0)
                .attr('text-anchor', function (d, i) {
                    return i & 1 ? 'start' : 'end';
                })
                .text(format)
                .transition()
                .duration(duration)
                .delay(delay)
                .attr('y', x1);

            boxTick.transition()
                .duration(duration)
                .delay(delay)
                .text(format)
                .attr('x', function (d, i) { return i & 1 ? width : 0; })
                .attr('y', x1);

            // Update whisker ticks. These are handled separately from the box
            // ticks because they may or may not exist, and we want don't want
            // to join box ticks pre-transition with whisker ticks post-.
            var whiskerTick = g.selectAll('text.whisker')
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
                .delay(delay)
                .attr('y', x1)
                .style('opacity', 1);

            whiskerTick.transition()
                .duration(duration)
                .delay(delay)
                .text(format)
                .attr('x', width)
                .attr('y', x1)
                .style('opacity', 1);

            whiskerTick.exit().transition()
                .duration(duration)
                .delay(delay)
                .attr('y', x1)
                .style('opacity', 1e-6)
                .remove();

            // Remove temporary quartiles element from within data array.
            delete d.quartiles;
        });
        d3.timerFlush();
    }

    box.width = function (x) {
        if (!arguments.length) {
            return width;
        }
        width = x;
        return box;
    };

    box.height = function (x) {
        if (!arguments.length) {
            return height;
        }
        height = x;
        return box;
    };

    box.tickFormat = function (x) {
        if (!arguments.length) {
            return tickFormat;
        }
        tickFormat = x;
        return box;
    };

    box.showOutliers = function (x) {
        if (!arguments.length) {
            return showOutliers;
        }
        showOutliers = x;
        return box;
    };

    box.boldOutlier = function (x) {
        if (!arguments.length) {
            return boldOutlier;
        }
        boldOutlier = x;
        return box;
    };


    box.renderData = function (x) {
        if (!arguments.length) {
            return renderData;
        }
        renderData = x;
        return box;
    };

    box.renderTitle = function (x) {
        if (!arguments.length) {
            return renderTitle;
        }
        renderTitle = x;
        return box;
    };

    box.dataBoxPercentage = function (x) {
        if (!arguments.length) {
            return dataBoxPercentage;
        }
        dataBoxPercentage = x;
        return box;
    };

    box.duration = function (x) {
        if (!arguments.length) {
            return duration;
        }
        duration = x;
        return box;
    };

    box.domain = (x) => {
        if (!arguments.length) {
            return domain;
        }
        domain = x === null ? x : functor(x);
        return box;
    };

    box.value = function (x) {
        if (!arguments.length) {
            return value;
        }
        value = x;
        return box;
    };

    box.whiskers = function (x) {
        if (!arguments.length) {
            return whiskers;
        }
        whiskers = x;
        return box;
    };

    box.quartiles = function (x) {
        if (!arguments.length) {
            return quartiles;
        }
        quartiles = x;
        return box;
    };

    return box;
};

function boxWhiskers(d) {
    return [0, d.length - 1];
}

function boxQuartiles(d) {
    return [
        d3.quantile(d, 0.25),
        d3.quantile(d, 0.5),
        d3.quantile(d, 0.75)
    ];
}

/**
 * A box plot is a chart that depicts numerical data via their quartile ranges.
 *
 * Examples:
 * - {@link http://dc-js.github.io/dc.js/examples/box-plot-time.html Box plot time example}
 * - {@link http://dc-js.github.io/dc.js/examples/box-plot.html Box plot example}
 * @class boxPlot
 * @memberof dc
 * @mixes dc.coordinateGridMixin
 * @example
 * // create a box plot under #chart-container1 element using the default global chart group
 * var boxPlot1 = dc.boxPlot('#chart-container1');
 * // create a box plot under #chart-container2 element using chart group A
 * var boxPlot2 = dc.boxPlot('#chart-container2', 'chartGroupA');
 * @param {String|node|d3.selection} parent - Any valid
 * {@link https://github.com/mbostock/d3/wiki/Selections#selecting-elements d3 single selector} specifying
 * a dom block element such as a div; or a dom element or d3 selection.
 * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
 * Interaction with a chart will only trigger events and redraws within the chart's group.
 * @return {dc.boxPlot}
 */
var that2 = this;

dc.boxPlot = (parent, chartGroup) => {
    var _chart = dc.coordinateGridMixin({});
    _chart.d3 = d3;

    // Returns a function to compute the interquartile range.
    function DEFAULT_WHISKERS_IQR(k) {
        return function (d) {
            var q1 = d.quartiles[0],
                q3 = d.quartiles[2],
                iqr = (q3 - q1) * k,
                i = -1,
                j = d.length;
            do {
                ++i;
            } while (d[i] < q1 - iqr);
            do {
                --j;
            } while (d[j] > q3 + iqr);
            return [i, j];
        };
    }

    var _whiskerIqrFactor = 1.5;
    var _whiskersIqr = DEFAULT_WHISKERS_IQR;
    var _whiskers = _whiskersIqr(_whiskerIqrFactor);

    var _box = new boxJitters();
    var _tickFormat = null;
    var _renderData = false;
    var _dataBoxPercentage = 0.8;
    var _renderTitle = false;
    var _showOutliers = true;
    var _boldOutlier = false;
    var _yUnitCount;

    var _boxWidth = function (innerChartWidth, xUnits) {
        if (_chart.isOrdinal()) {
            return _chart.x().bandwidth();

        } else {
            return innerChartWidth / (1 + _chart.boxPadding()) / xUnits;
        }
    };

    var _boxHeight = function (innerChartHeight, yUnits) {
        if (_chart.isOrdinal()) {
            return _chart.x().bandwidth();

        } else {
            return innerChartWidth / (1 + _chart.boxPadding()) / xUnits;
        }
    };

    function yUnitCount() {
        if (_yUnitCount === undefined) {
            if (_chart.isOrdinal()) {
                // In this case it number of items in domain
                _yUnitCount = _chart.y().domain().length;
            } else {
                _yUnitCount = _chart.yUnits()(_chart.y().domain()[0], _chart.y().domain()[1]);

                // Sometimes xUnits() may return an array while sometimes directly the count
                if (_yUnitCount instanceof Array) {
                    _yUnitCount = _yUnitCount.length;
                }
            }
        }

        return _yUnitCount;
    };

    // SBC The original 2.1.9 code was terrible to calculate y-axis for small values
    // default padding to handle min/max whisker text
    //_chart.yAxisPadding(12);

    // default to ordinal
    _chart.x(d3.scaleBand());
    _chart.xUnits(dc.units.ordinal);

    // valueAccessor should return an array of values that can be coerced into numbers
    // or if data is overloaded for a static array of arrays, it should be `Number`.
    // Empty arrays are not included.
    _chart.data(function (group) {
        return group.all().map(function (d) {
            d.map = function (accessor) {
                return accessor.call(d, d);
            };
            return d;
        }).filter(function (d) {
            var values = _chart.valueAccessor()(d);
            return values.length !== 0;
        });
    });

    /**
     * Get or set the spacing between boxes as a fraction of box size. Valid values are within 0-1.
     * See the {@link https://github.com/mbostock/d3/wiki/Ordinal-Scales#wiki-ordinal_rangeBands d3 docs}
     * for a visual description of how the padding is applied.
     * @method boxPadding
     * @memberof dc.boxPlot
     * @instance
     * @see {@link https://github.com/mbostock/d3/wiki/Ordinal-Scales#wiki-ordinal_rangeBands d3.scale.ordinal.rangeBands}
     * @param {Number} [padding=0.8]
     * @return {Number}
     * @return {dc.boxPlot}
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
     * @return {Number}
     * @return {dc.boxPlot}
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
     * @return {Number|Function}
     * @return {dc.boxPlot}
     */
    _chart.boxWidth = function (boxWidth) {
        if (!arguments.length) {
            return _boxWidth;
        }
        _boxWidth = functor(boxWidth);
        return _chart;
    };

    _chart.boxHeight = function (boxHeight) {
        if (!arguments.length) {
            return _boxHeight;
        }
        _boxHeight = functor(boxHeight);
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
        var _calculatedBoxHeight = _boxHeight(_chart.effectiveHeight(), yUnitCount());

        // SBC (Added additional parameters [renderData, dataBoxPercentage, renderTitle, showOutliers])
        _box.whiskers(_whiskers)
            .width(_calculatedBoxWidth)
            .height(_chart.effectiveHeight())
            .value(_chart.valueAccessor())
            .duration(_chart.transitionDuration())
            .tickFormat(_tickFormat)
            .renderData(_renderData)
            .dataBoxPercentage(_dataBoxPercentage)
            .renderTitle(_renderTitle)
            .showOutliers(_showOutliers)
            .boldOutlier(_boldOutlier)
            .domain(_chart.y().domain());


        var boxesG = _chart.chartBodyG().selectAll('g.box').data(_chart.data(), function (d) {
            return d.key;
        });

        renderBoxes(boxesG);
        updateBoxes(boxesG);
        removeBoxes(boxesG);

        _chart.fadeDeselectedArea();
    };

    function renderBoxes(boxesG) {
        var boxesGEnter = boxesG.enter().append('g');

        boxesGEnter
            .attr('class', 'box')
            .attr('transform', boxTransform)
            .call(_box)
            .on('click', function (d) {
                _chart.filter(d.key);
                _chart.redrawGroup();
            });
    }

    let updateBoxes = (boxesG) => {
        //dc.transition(boxesG, _chart.transitionDuration())
        dc.transition(boxesG, _chart.transitionDuration(), _chart.transitionDelay())
            .attr('transform', boxTransform)
            .call(_box)
            .each(function () {

                // TODO: Is there a better way to get a unique color, I don't like drilling down.
                //d3.select(this).select('rect.box').attr('fill', _chart.getColor);

                var color = _chart.getColor(_chart.d3.select(this).select('rect.box')._groups[0][0].__data__, 0);
                _chart.d3.select(this).select('rect.box').attr('fill', color);


                // TODO: Change style to attr once we remove the fill attribute for .box circle from dc.css
                _chart.d3.select(this).selectAll('circle.data').style('fill', color);

            });
    }

    function removeBoxes(boxesG) {
        boxesG.exit().remove().call(_box);
    }

    // SBC (Added, not sure why)
    function minDataValue() {
        return d3.min(_chart.data(), function (e) {
            return d3.min(_chart.valueAccessor()(e));
        });
    };

    // SBC (Added, not sure why)
    function maxDataValue() {
        return d3.max(_chart.data(), function (e) {
            return d3.max(_chart.valueAccessor()(e));
        });
    };

    // SBC (Added, not sure why)
    function yAxisRangeRatio() {
        return ((maxDataValue() - minDataValue()) / _chart.effectiveHeight());
    };

    // SBC New 2.1.9 version
    _chart.fadeDeselectedArea = function () {
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
                var extent = _chart.brush().extent();
                var start = extent[0];
                var end = extent[1];
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

    // SBC New 2.1.9 version
    _chart.isSelectedNode = function (d) {
        return _chart.hasFilter(_chart.keyAccessor()(d));
    };

    // SBC (Better calculation for small y-axis values)
    // SBC The original 2.1.9 code was terrible to calculate y-axis for small values
    _chart.yAxisMin = function () {
        var padding = 16 * yAxisRangeRatio();
        return dc.utils.subtract(minDataValue() - padding, _chart.yAxisPadding());
    };

    _chart.yAxisMax = function () {
        var padding = 16 * yAxisRangeRatio();
        return dc.utils.add(maxDataValue() + padding, _chart.yAxisPadding());
    };

    // SBC Added new orientation variable
    _chart.orientation = function (orientation) {
        if (!arguments.length) {
            return _orientation;
        }
        _orientation = orientation;
        return _chart;
    };

    /**
     * Set the numerical format of the boxplot median, whiskers and quartile labels. Defaults to
     * integer formatting.
     * @example
     * // format ticks to 2 decimal places
     * chart.tickFormat(d3.format('.2f'));
     * @method tickFormat
     * @memberof dc.boxPlot
     * @instance
     * @param {Function} [tickFormat]
     * @return {Number|Function}
     * @return {dc.boxPlot}
     */
    _chart.tickFormat = function (tickFormat) {
        if (!arguments.length) {
            return _tickFormat;
        }
        _tickFormat = tickFormat;
        return _chart;
    };

    // SBC (New attribute)
    _chart.renderData = function (show) {
        if (!arguments.length) {
            return _renderData;
        }
        _renderData = show;
        return _chart;
    };

    // SBC (New attribute)
    _chart.dataBoxPercentage = function (percentage) {
        if (!arguments.length) {
            return _dataBoxPercentage;
        }
        _dataBoxPercentage = percentage;
        return _chart;
    };

    // SBC (New attribute)
    _chart.renderTitle = function (show) {
        if (!arguments.length) {
            return _renderTitle;
        }
        _renderTitle = show;
        return _chart;
    };

    // SBC (New attribute)
    _chart.showOutliers = function (show) {
        if (!arguments.length) {
            return _showOutliers;
        }
        _showOutliers = show;
        return _chart;
    };

    // SBC (New attribute)
    _chart.boldOutlier = function (show) {
        if (!arguments.length) {
            return _boldOutlier;
        }
        _boldOutlier = show;
        return _chart;
    };


    return _chart.anchor(parent, chartGroup);
};
