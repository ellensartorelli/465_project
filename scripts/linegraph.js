var createLineGraph = function(parent, width, height){
  var dataset;

  var margins = {top:20, bottom:60, left: 60, right:20};
  var chartWidth = width - margins.left - margins.right;
  var chartHeight = height - margins.top - margins.bottom;

  var xScale = d3.scale.linear().range([0, chartWidth]);
  var yScale1 = d3.scale.linear().range([chartHeight, 0]);
  var yScale2 = d3.scale.linear().range([chartHeight, 0]);

  var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(d3.format("d"));
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
    //situate data correctly
    var attributes = ["black", "white", "mhinc", "mhv", "mrent", "pcol", "pop"];
    var flattenedData = [];
    dataset.forEach(function(element) {
      attributes.forEach(function(attribute) {
        for (year in element[attribute]) {
          var point = flattenedData.find(function(e) {
            return e.attribute == attribute && e.year == year;})
          if (point) {
            //averaging:
            point.value = (point.value * point.count/(point.count + 1)) +
                          element[attribute][year] / (point.count + 1);

            //aggregrating:
            // point.value += element[attribute][year];

            point.count++;
          } else {
            var value = element[attribute][year];
            flattenedData.push({"attribute": attribute,
                                "year": year,
                                "value": value,
                                "count": 1});
          }
        }
      })
    })
    flattenedData = flattenedData.map( function(element, index, array) {
      if (element.attribute == "pop") return null;
      if (element.attribute == "black" || element.attribute == "white") {
        var pop = array.find(function (d) {return d.year == element.year && d.attribute == "pop"}).value;
        element.value = element.value/pop;
      }
      return element;
    }).filter(function(element) {
      return element !== null;
    });

    var nestedData = d3.nest()
          .key(function(d){return d.attribute;})
          .entries(flattenedData);

    var line = d3.svg.line()
          .x(function(d){return xScale(+d.year); })
          .y(function(d){
            if (d.attribute == "white" || d.attribute == "black" || d.attribute == "pcol") {
              return yScale1(+d.value*100);
            } else {
              return yScale2(+d.value);
            }
          });

    xScale.domain(d3.extent([1970,2010]));
    yScale1.domain([0, 100]);
    yScale2.domain([0, d3.max(flattenedData, function(point) {
      return point.value;
    })]);

    var groups = chart.selectAll(".attribute")
    .data(nestedData, function(d){return d.key;});

    groups.exit().remove();
    groups.enter().append("g")
      .attr("class","attribute")
      .append("path");

    groups.select("path")
        .transition(1000)
        .attr("class", "line")
        .attr("d", function(d){return line(d.values)})
        .style("fill","None");



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
