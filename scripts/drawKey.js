var drawKey = function(parent, colorScale){

  var key = d3.select(parent).select("#key");

  console.log(colorScale.range());

  var keyEntries = key.selectAll("li").data(colorScale.range());
  keyEntries.exit().remove();
  var listItem = keyEntries.enter().append("li");
  listItem.append("span").attr("id", "span1");
  listItem.append("span").attr("id", "span2");

    keyEntries.select("#span1")
      .style({
        "padding-left":"11px",
        "margin-right":"3px",
        "background-color":function(d){
          return d;
        },
        //  "border-bottom":"solid black 1.5px"
      });

  keyEntries.select("#span2")
      .attr('class', 'text')
      .text(function(d,i) {
          var extent = colorScale.invertExtent(d);
          console.log(extent);
          if(extent[0] < 0){
            extent[0] = 0;
          }
          console.log(extent)
          var format = d3.format("0.2f");
          return format(+extent[0]) + " -  " + format(+extent[1]);
          // return format(extent[1]);
      });

};
