var createMap = function(parent, width, height) {

  var svg = d3.select(parent)
  .append("svg")
  .attr({"width":width, "height":height});

  // put in a background to get mouse clicks
  svg.append("rect")
  .attr("class", "background")
  .attr("width", width)
  .attr("height", height);

  // create the canvas
  var canvas = svg.append("g").attr("id", "canvas");

  // the "zoomed" state
  var active = d3.select(null);

  // create the zoom function
  var zoom = d3.behavior.zoom()
    .translate([0, 0])
    .scale(1)
    .scaleExtent([1, 20])
    .on("zoom", zoomed);

    //
    // var color = d3.scale.quantile()
    // .range(colorScheme[5]);


  // colors.push(color_mhinc);
  // colors.push(color_mhval);
  // colors.push(color_white);
  // colors.push(color_black);
  // colors.push(color_mrent);
  // colors.push(color_pcol);

  // load the zoom behavior into the SVG
  svg.call(zoom)
  .call(zoom.event);

  var projection = d3.geo.mercator()
          .center([-73.94, 40.70])
          .scale(50500)
          .translate([(width) / 2, (height)/2]);

  // create the path tool
  var path = d3.geo.path().projection(projection);


  // fetch geojson
  d3.json("../data/nyct_final.topojson",function (mapData) {

  mapData.objects["nyct-final"].geometries = nest(mapData.objects["nyct-final"].geometries);

  features = topojson.feature(mapData, mapData.objects["nyct-final"]).features;

  // color_black.domain(d3.extent(features, function(d){return +d.properties.black[2010];}));

  // color_mhval.domain(d3.extent(features,function(d){return +d.properties.metric[year];}));
  // color_white.domain(d3.extent(features,function(d){return +d.properties.metric[year];}));
  // color_mhinc.domain(d3.extent(features,function(d){return +d.properties.metric[year];}));
  // color_pcol.domain(d3.extent(features,function(d){return +d.properties.metric[year];}));
  // color_mrent.domain(d3.extent(features,function(d){return +d.properties.metric[year];}));

  features.forEach(function(element) {
    element.properties.pwhite = {};
    element.properties.pblack = {};
    for (year in element.properties.white) {
      element.properties.pwhite[year] = 100 * element.properties.white[year] / element.properties.pop[year];
      element.properties.pblack[year] = 100 * element.properties.black[year] / element.properties.pop[year];
    }
  });

  var paths = canvas.selectAll("path")
  .data(features)
  .enter()
  .append("path")
  .attr("d",path)
  .attr("class", "tract panning_mode")
  .attr("id", function(d) {return "id" + d.properties.id;})
  // .attr("class", function(d) {
  //   console.log(tools_bools);
  //   if(tools_bools["Selection"]==true){
  //     return "tract selection_mode";
  //   }else{
  //     return "tract panning_mode";
  //   };
  // })
  .on("click",clicked);

  recolorMap();
  redrawVis();
  });

  /**
  Catch mouse clicks
  **/
  function clicked(tract) {
    if(tools_bools["Selection"]==true){
      var tractId = "#id" + tract.properties.id;
      var index = selectedTracts.indexOf(tract, function(element) {
        return element.properties.id == tract.properties.id;
      });
      if (index == -1) {
        selectedTracts.push(tract);
        var path = canvas.select(tractId);
        path.classed("selected", true);
      } else {
        selectedTracts.splice(index, 1);
        var path = canvas.select(tractId);
        path.classed("selected", false);
      }
      redrawVis();
    }
  }

  /**
  Change the apperance when we zoom
  **/
  function zoomed() {
    canvas.style("stroke-width", 1.5 / d3.event.scale + "px");
    canvas.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }

  // If the drag behavior prevents the default click,
  // also stop propagation so we don’t click-to-zoom.
  function stopped() {
    if (d3.event.defaultPrevented) d3.event.stopPropagation();
    }

  //TODO: distinguish clicks and panning

}

//TODO: FIGURE OUT DEFAULT VALUES
var recolorMap = function() {
  //TODO: if 0 --> noData --> color grey
  console.log("recolorMap being called");
  var colorScale = d3.scale.quantize();

  var nColors = 7;
  var colors = { //TODO: see precompute domains is the correct thing to do
    mhinc: colorbrewer.Blues[nColors],
    mhv: colorbrewer.Purples[nColors],
    pwhite: colorbrewer.Reds[nColors],
    pblack: colorbrewer.Oranges[nColors],
    pcol: colorbrewer.Greens[nColors],
    mrent: colorbrewer.Greys[nColors]
  };

  console.log("ranging on metric: " + metric);
  console.log("with year: " + year);
  colorScale.range(colors[metric]);
  colorScale.domain([d3.min(features, findMin), d3.max(features, findMax)]);

  function fillColor(d) {
    if (+d.properties[metric][year] >= 1) {
      return colorScale(+d.properties[metric][year]);
    }
    return "#d3d3d3";
  }

  d3.select("#canvas")
    .selectAll(".tract")
    .transition(1000)
    .style("fill", fillColor);

  createKey("#map", colorScale);
}

function findMin(d) {
  var min = d.properties[metric]["1970"];
  for (prop in d.properties[metric]) {
    min = Math.min(d.properties[metric][prop], min);
  }
  return min;
}

function findMax(d) {
  var max = d.properties[metric]["1970"];
  for (prop in d.properties[metric]) {
    max = Math.max(d.properties[metric][prop], max);
  }
  return max;
}
