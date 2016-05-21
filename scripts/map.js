var createMap = function(parent, width, height) {

  var populationCutoff = 25;

  var svg = d3.select(parent)
  .append("svg")
  .attr({"width":width, "height":height});

  var sliderDiv = d3.select(parent)
    .append("div")
    .attr("id", "sliderDiv");

  var key = d3.select(parent)
    .append("div")
    .append("svg")
    .attr("id", "key");
  key.append("g");

  // put in a background to get mouse clicks
  svg.append("rect")
  .attr("class", "background")
  .attr("width", width)
  .attr("height", height)
  .style("stroke", "black");

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
          .scale(60000)
          .translate([(width) / 2, (height)/2]);

  // create the path tool
  var path = d3.geo.path().projection(projection);

  // fetch geojson
  d3.json("../data/nyct2010_3.topojson",function (mapData) {

    //TODO: CREATE A NEW TOPOJSON OUT OF THIS
  mapData.objects["nyct2010_3"].geometries = nest(mapData.objects["nyct2010_3"].geometries);
  mapData.objects["nyct2010_3"].geometries = inflationAdjust(mapData.objects["nyct2010_3"].geometries);

  features = topojson.feature(mapData, mapData.objects["nyct2010_3"]).features;
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

  mapData.objects["nyct2010_3"].geometries = identifyGentrified(mapData.objects["nyct2010_3"].geometries);

  features.forEach(function(element) {
    if (element.properties.status[gentrificationYear] == "gentrified") {
      gentrifiedTracts.push(element);
    } else if (element.properties.status[gentrificationYear] == "eligible") {
      eligibleTracts.push(element);
    } else if (element.properties.status[gentrificationYear] == "ineligible") {
      ineligibleTracts.push(element);
    }
  });

  var paths = canvas.selectAll("path")
  .data(features)
  .enter()
  .append("path")
  .attr("d",path)
  .attr("class", "tract")
  .attr("id", function(d) {return "id" + d.properties.id;})
  .on("click",clicked)
  .on("dblclick", doubleClicked)
  .on("mouseover", function(d){
    var tractId = "#id" + d.properties.id;
    var path = canvas.select(tractId);
      if (!path.classed("inactive")) {
        var formatPercent = d3.format("0.1f");
        var formatNumber = d3.format(".0f");

        var stationary_tooltip = d3.select("#stationary_tooltip");
          stationary_tooltip.select("#valueA").text(d.properties.id);
          stationary_tooltip.select("#valueB").text(d.properties.BoroName);
          stationary_tooltip.select("#valueC").text(d.properties.NTAName);
          stationary_tooltip.select("#variableD").text(metricDict[metric]);
          stationary_tooltip.select("#valueD").text(function() {return (metric == "pcol" || metric == "pwhite" || metric == "pblack") ? formatPercent(d.properties[metric][year])+"%" : "$"+formatNumber(d.properties[metric][year]); });
      };
    });
  paths.on("mouseout", clear_tooltip);

 function clear_tooltip(){
  console.log("CLEAR");
    var stationary_tooltip = d3.select("#stationary_tooltip");
      stationary_tooltip.select("#valueA").text("");
      stationary_tooltip.select("#valueB").text("");
      stationary_tooltip.select("#valueC").text("");
      stationary_tooltip.select("#variableD").text("Metric Data");
      stationary_tooltip.select("#valueD").text("");
  };



  year = 1970;

  recolorMap();
  redrawVis();
  });

  /**
  Catch mouse clicks
  **/
  function clicked(tract) {
    if (d3.event.defaultPrevented) { //panning no disables on-click behavior
      return;
    }
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

  function doubleClicked(tract) {
    d3.event.stopPropagation();
    if (downloadTracts.indexOf(tract) == -1) {
      downloadTracts.push(tract);
    }
    updateList();
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

  colorScale.range(colors[metric]);
  colorScale.domain([d3.min(features, findMin), d3.max(features, findMax)]);

  var viewingGentrification = false;

  function fillColor(d) {
    if (viewingGentrification) {
      if (d.properties.status[year] == "ineligible") {
        return "#deebf7";
      }
      if (d.properties.status[year] == "eligible") {
        return "#9ecae1";
      }
      if (d.properties.status[year] == "gentrified") {
        return "#3182bd";
      }
      return "#d3d3d3";
    }
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

  drawKey("#map", colorScale, nColors, map_width/2); //DO NOT USE VARIABLE parent HERE. SCOPING ISSUES
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
