var createLineGraph = function(parent, width, height){
  var dataset, xData, yData;

  var margins = {top:20, bottom:60, left: 60, right:20};
  var chartWidth = width - margins.left - margins.right;
  var chartHeight = height - margins.top - margins.bottom;

  var xScale = d3.scale.linear().range([0, chartWidth]);
  var yScale1 = d3.scale.linear().range([chartHeight, 0]);
  var yScale2 = d3.scale.linear().range([chartHeight, 0]);

  var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
  var yAxis1 = d3.svg.axis().scale(yScale1).orient("left");
  var yAxis2 = d3.svg.axis().scale(yScale2).orient("right");

  var svg = d3.select(parent)
    .append("svg")
    .attr({width:width, height:height});

  var chart = svg.append("g")
    .attr("transform", "translate("+margins.left + "," + margins.top + ")");

  var xAxisG = chart.append("g")
    .attr({"class": "axis",
            "transform": "translate(0," + chartHeight +")"});

  var yAxis1G = chart.append("g")
    .attr({"class": "axis"});

  var yAxis2G = chart.append("g")
    .attr({"class": "axis"});


  var vis = function(){
    var line = d3.svg.line()
          .x(function(d){return xScale(+d.age); })
          .y(function(d){return yScale(+d.circumference); });

    xScale.domain(d3.extent([1970,2010]));
    yScale1.domain([0, 100]);

    xAxisG.call(xAxis);
    yAxis1G.call(yAxis1);
    yAxis2G.call(yAxis2);
  };

  vis.loadData = function(data){
    dataset = data;
    return vis;
  }

  return vis;
};
