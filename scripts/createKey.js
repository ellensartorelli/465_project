
var createKey = function(parent, color){

  var key = d3.selectAll(parent)
    .append("ul")
    .attr("id", "key");

  console.log(color.range());

  var keyEntry = key.selectAll('key.ul')
    .data(color.range())
    .enter()
    .append("li");

    keyEntry.append("span")
      .style({
        "padding-left":"11px",
        "margin-right":"3px",
        "background-color":function(d){
          return d;
        },
        //  "border-bottom":"solid black 1.5px"
      });

  keyEntry.append("span")
      .attr('class', 'text')
      .text(function(d,i) {
          var extent = color.invertExtent(d);
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
