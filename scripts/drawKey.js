var drawKey = function(parent, colorScale, nColors, width){

var makeDomain = function(isXDomain){
  if (isXDomain) {
    var i = 0;
  } else {
    var i = 1;
  }

  if(colorScale.domain()[0] < 0){
    var first = 0;
  }else{
    var first = colorScale.domain()[0];
  }
  var second = colorScale.domain()[1];
  var increments = ((first - second)*-1)/nColors;
  var domain = [];
  for(; i <= nColors; i++){
    domain.push(i*increments);
  }
  return domain;
};

var makeScaleDomain = function(){
  var scaleDomain = [];
  if(colorScale.domain()[0] < 0){
    scaleDomain.push(0);
  }else{
    scaleDomain.push(colorScale.domain()[0]);
  }
  scaleDomain.push(colorScale.domain()[1]);
  return scaleDomain;
};

  var height = 100,
    formatPercent = d3.format("0.1f");
    formatNumber = d3.format(".0f");

var threshold = d3.scale.threshold()
    .domain(makeDomain(false))
    .range(colorScale.range());

var thresholdx = d3.scale.threshold()
    .domain(makeDomain(true))
    .range(colorScale.range());

// A position encoding for the key only.
var x = d3.scale.linear()
    .domain(makeScaleDomain())
    .range([0, 300]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(19)
    .tickValues(thresholdx.domain())
    .tickFormat(function(d) {
      return (metric == "pcol" || metric == "pwhite" || metric == "pblack") ?
        formatPercent(d)+"%" : formatNumber(d);
      });

var svg = d3.select(parent).select("#key")
    .attr("width", width)
    .attr("height", height);

var g = svg.select("g")
    .attr("class", "key")
    .attr("transform", "translate(13, 25)");

var rects = g.selectAll("rect")
    .data(threshold.range().map(function(color) {
      var d = threshold.invertExtent(color);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    }))
  rects.enter().append("rect");
  rects.exit().remove();

  rects.attr("height", 12)
    .attr("x", function(d) { return x(d[0]); })
    .attr("width", function(d) { return x(d[1]) - x(d[0]); })
    .style("fill", function(d) { return threshold(d[0]); });

  g.call(xAxis);

  var title = g.selectAll("#key_title").data(["data"]);
  title.enter().append("text");
  title.exit().remove();
  title.text(metricDict[metric])
    .attr("class", "caption")
    .attr("y", -6)
    .attr("id", "key_title");

};
