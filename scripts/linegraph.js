var createLineGraph = function(parent, displayedMetric, width, height){
  var dataset;

  var margins = {top:45, bottom:50, left: 60, right:50};
  var chartWidth = width - margins.left - margins.right;
  var chartHeight = height - margins.top - margins.bottom;

  var xScale = d3.scale.linear().range([0, chartWidth]);
  var yScale = d3.scale.linear().range([chartHeight, 0]);

  var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
    .tickFormat(function(d){return "'" + d.toString().substring(2, 4)})
    .tickValues([1970, 1980, 1990, 2000, 2010]);
  var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(7);

  var svg = d3.select(parent)
    .append("svg")
    .attr("id", displayedMetric)
    .attr({width:width, height:height})
    .on("click", function(){
          console.log(this.value+" is checked");
          //SEND THIS VALUE TO SET THE METRIC TO BE DISPLAYED ON THE MAP
          //SEND THIS VALUE TO HIGHLIGHT LINE IN LINE GRAPH
          //SENT THIS VALUE TO BE HIGHLIGHTED BAR IN BAR CHART

          // var update = updateKey(this.value);
          // if(update == true){//clear legend
          //  d3.selectAll("#key").remove();
          //  makeLegend("#map", colorScale);
          // };
          //d3.selectAll("#key").remove();
          metric = this.id;
          recolorMap();
      });


  var chart = svg.append("g")
    .attr("transform", "translate("+margins.left + "," + margins.top +  ")");

  var xAxisG = chart.append("g")
    .attr({"class": "axis",
            "transform": "translate(0," + chartHeight +")"});

  var yAxisG = chart.append("g")
    .attr({"class": "axis"});

  var titles = chart.append("text")
                    .text(metricDict[displayedMetric])
                    .attr("class", "chart_titles")
                    .attr("x", chartWidth/2)
                    .attr("text-anchor", "middle")
                    .attr("y", -20);


  var vis = function(){
    //situate data correctly
    var flattenedData = [];
    dataset.forEach(function(set, setIndex) {
      set.forEach(function(element) {
        for (year in element[displayedMetric]) {
          var point = flattenedData.find(function(e) {
            return e.group == setIndex && e.year == year;})
          if (point) {
            if (point.value != 0) {
              //averaging:
              point.value = (point.value * point.count/(point.count + 1)) +
                            element[displayedMetric][year] / (point.count + 1);

              //aggregrating:
              // point.value += element[attribute][year];

              point.count++;
            }
          } else {
            var value = element[displayedMetric][year];
            flattenedData.push({"attribute": displayedMetric,
                                "group": setIndex,
                                "year": year,
                                "value": value,
                                "count": 1});
          }
        }
      })
    })

    // flattenedData = flattenedData.map( function(element, index, array) {
    //   if (element.attribute == "pop") return null;
    //   if (element.attribute == "black" || element.attribute == "white") {
    //     var pop = array.find(function (d) {return d.year == element.year && d.attribute == "pop"}).value;
    //     element.value = element.value/pop;
    //   }
    //   return element;
    // }).filter(function(element) {
    //   return element !== null;
    // });

    var nestedData = d3.nest()
          .key(function(d){return d.group;})
          .entries(flattenedData);

    var line = d3.svg.line()
          .x(function(d){return xScale(+d.year); })
          .y(function(d){return yScale(+d.value); });

    xScale.domain(d3.extent([1970,2010]));
    yScale.domain(d3.extent(flattenedData, function(point) {
      return point.value;
    }));

    var groups = chart.selectAll(".group")
    .data(nestedData, function(d){return d.key;});

    groups.exit().remove();
    groups.enter().append("g")
      .attr("class","group")
      .append("path");

    var color = d3.scale.category10().domain(["1", "2", "3", "0"])

    var paths = groups.select("path")
        .transition(1000)
        .attr("class", "line")
        .attr("d", function(d){return line(d.values)})
        .style("fill","None")
        .style("stroke", function(d){return color(d.key)});
        //.style("stroke-dasharray", function(d){return dashArray(d.key)}) //currently not using

    var circles = groups.selectAll("circle")
      .data(function(d){return d.values});
    circles.exit().remove();
    circles.enter().append("circle");

    circles.transition(1000)
    .attr({
      cx: function(d) {return xScale(d.year)},
      cy: function(d) {return yScale(d.value)},
      r: 2.5,
    }).style("fill", function(d) {return color(d.group)});

    // var circles = chart.selectAll("circle")
    //   .data(flattenedData);
    // circles.exit().remove();
    // circles.enter().append("cirlce");
    //
    // circles.attr({
    //   cx: function(d) {return xScale(d.year)},
    //   cy: function(d) {return yScale(d.value)},
    //   r: 3,
    // }).style("fill", function(d) {return color(d.key)});



    // function color(key) {
    //   if( key == "0") return "#7c0038"; //gentrified
    //   if (key == "1") return "#121258"; //eligbile
    //   if (key == "2") return "#064022"; //not elibible
    //   if (key == "3") return "black";
    // }

    //
  	// //draw circles
  	// groups.selectAll("circle")
  	// 			.data(function(d){return d.values;})
  	//   		.enter()
  	//   		.append("circle")
  	//   		.attr({cx:function(d){return xScale(+d.year);},
  	//   						cy:function(d){ return yScale(+d.circumference);},
  	//   						r:3	});



    xAxisG.call(xAxis);
    yAxisG.call(yAxis);
  };

  vis.loadData = function(data){
    dataset = data;
    return vis;
  }

  return vis;
};
