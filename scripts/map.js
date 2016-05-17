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
  var canvas = svg.append("g");

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

  var colors = [];
    var color_mhinc = d3.scale.quantize().range(colorbrewer.Blues[5]);
    var color_mhval = d3.scale.quantize().range(colorbrewer.Purples[5]);
    var color_white = d3.scale.quantize().range(colorbrewer.Reds[5]);
    // var color_black = d3.scale.quantize().range(colorbrewer.Oranges[5]);
    var color_black = d3.scale.linear().range(["blue", "red"]);
    var color_pcol = d3.scale.quantize().range(colorbrewer.Greens[5]);
    var color_mrent = d3.scale.quantize().range(colorbrewer.Greys[5]);
  colors.push(color_mhinc);
  colors.push(color_mhval);
  colors.push(color_white);
  colors.push(color_black);
  colors.push(color_mrent);
  colors.push(color_pcol);

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


  color_black.domain(d3.extent(features, function(d){return +d.properties.black[2010];}));

  // color_mhval.domain(d3.extent(features,function(d){return +d.properties.metric[year];}));
  // color_white.domain(d3.extent(features,function(d){return +d.properties.metric[year];}));
  // color_mhinc.domain(d3.extent(features,function(d){return +d.properties.metric[year];}));
  // color_pcol.domain(d3.extent(features,function(d){return +d.properties.metric[year];}));
  // color_mrent.domain(d3.extent(features,function(d){return +d.properties.metric[year];}));

  var paths = canvas.selectAll("path")
  .data(features)
  .enter()
  .append("path")
  .attr("d",path)
  .attr("class", "tract")
  .attr("id", function(d) {return "id" + d.properties.id;})
  .style("fill", function(d){return color_black(+d.properties.black[2010]);})
  .on("click",clicked);

  redrawVis();
  });

  /**
  Catch mouse clicks
  **/
  function clicked(tract) {
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
