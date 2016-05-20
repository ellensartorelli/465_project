var createMap = function(parent, width, height) {

  var populationCutoff = 25;

  var svg = d3.select(parent)
  .append("svg")
  .attr({"width":width, "height":height});

  var key = d3.select(parent)
    .append("ul")
    .attr("id", "key");

  var legend = d3.select(parent)
    .append("ul")
    .attr("id", "legend");

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
  d3.json("../data/nyct2010_3.topojson",function (mapData) {

    //TODO: CREATE A NEW TOPOJSON OUT OF THIS
  mapData.objects["nyct2010_3"].geometries = nest(mapData.objects["nyct2010_3"].geometries);
  mapData.objects["nyct2010_3"].geometries = inflationAdjust(mapData.objects["nyct2010_3"].geometries);

  features = topojson.feature(mapData, mapData.objects["nyct2010_3"]).features;


  // color_black.domain(d3.extent(features, function(d){return +d.properties.black[2010];}));

  // color_mhval.domain(d3.extent(features,function(d){return +d.properties.metric[year];}));
  // color_white.domain(d3.extent(features,function(d){return +d.properties.metric[year];}));
  // color_mhinc.domain(d3.extent(features,function(d){return +d.properties.metric[year];}));
  // color_pcol.domain(d3.extent(features,function(d){return +d.properties.metric[year];}));
  // color_mrent.domain(d3.extent(features,function(d){return +d.properties.metric[year];}));

  features.forEach(function(element) {
    element.properties.pwhite = {};
    element.properties.pblack = {};
    element.properties.pcol = {};
    for (year in element.properties.white) {
      if (element.properties.pop[year] < 25) {
        element.properties.pwhite[year] = 0;
        element.properties.pblack[year] = 0;
        element.properties.pcol[year] = 0;
      } else {
        element.properties.pwhite[year] = 100 * element.properties.white[year] / element.properties.pop[year];
        element.properties.pblack[year] = 100 * element.properties.black[year] / element.properties.pop[year];
        element.properties.pcol[year] = 100 * element.properties.col[year] / element.properties.pop[year];

        //check if > 100%
        element.properties.pwhite[year] = element.properties.pwhite[year] > 100 ? 0 : element.properties.pwhite[year];
        element.properties.pblack[year] = element.properties.pblack[year] > 100 ? 0 : element.properties.pblack[year];
        element.properties.pcol[year] = element.properties.pcol[year] > 100 ? 0 : element.properties.pcol[year];
      }
    }
  });

  var paths = canvas.selectAll("path")
  .data(features)
  .enter()
  .append("path")
  .attr("d",path)
  .attr("class", "tract")
  .attr("id", function(d) {return "id" + d.properties.id;})
  .on("click",clicked);

  recolorMap();
  redrawVis();
  });

  /**
  Catch mouse clicks
  **/
  function clicked(tract) {
    var tractId = "#id" + tract.properties.id;
    var path = canvas.select(tractId);
    if (!path.classed("inactive")) {
      // if(tools_bools["Selection"]==true){

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
      //}
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
  console.log("recolorMap being called");
  var colorScale = d3.scale.quantize();

  var nColors = 7;
  var colors = { //TODO: see precompute domains is the correct thing to do
    mhinc: colorbrewer.Blues[nColors],
    mhv: colorbrewer.Purples[nColors],
    pwhite: colorbrewer.Reds[nColors],
    pblack: colorbrewer.Oranges[nColors],
    pcol: colorbrewer.Greens[nColors],
    mrent: colorbrewer.RdPu[nColors]
  };

  console.log("ranging on metric: " + metric);
  console.log("with year: " + year);
  colorScale.range(colors[metric]);
  colorScale.domain([d3.min(features, findMin), d3.max(features, findMax)]);

  function fillColor(d) {
    if (+d.properties[metric][year] > 0) {
      return colorScale(+d.properties[metric][year]);
    }
    return "#d3d3d3";
  }

  function checkInactive(d) {
    if (+d.properties[metric][year] > 0) {
      return false;
    }
    return true;
  }

  d3.select("#canvas")
    .selectAll(".tract")
    .classed("inactive", checkInactive)
    .transition(1000)
    .style("fill", fillColor);

  drawKey("#map", colorScale); //DO NOT USE VARIABLE parent HERE. SCOPING ISSUES
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
