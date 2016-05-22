var createMetric = function(parent) {

		var tractType = ["Did not gentrify", "Ineligible", "Selected Tract(s)", "Gentrified"];

		var color = d3.scale.category10().domain(["Did not gentrify", "Ineligible", "Selected Tract(s)", "Gentrified"]);


		var legend = d3.select(parent).select("#legend_div")
			.append("ul")
			.attr("class", "legend");

		var list_item = legend.selectAll("li")
			.data(tractType)
			.enter()
		 	.append("li");

		list_item.append("span")
			.style({
				"padding-left":"11px",
				"margin-right":"3px",
				"background-color":function(d){
					return color(d);
				}
			});

		list_item.append("span")
			.text(function(d){return d;});


		legend
			.append("input")
			.attr("type", "button")
			.attr("value", "Clear Selected Tracts")
			.on("click", function(d) {
				selectedTracts.forEach(function(tract) {
					var tractId = "#id" + tract.properties.id;
			    var path = d3.select("#canvas").select(tractId);
					path.classed("selected", false);
				});
				selectedTracts = [];
				redrawVis();
			})


		var legend_info = d3.selectAll("#legend_div")
			.append("p")
			.attr("id", "legend_description")
			.text("Tract Status: As no universally accepted definition of gentrification exits, tracts have been classified into categories of 'Gentrified,' 'Ineligible' or 'Did not gentrify' based off Governing.com's methodology. Governing.com's methodology draws heavily on the 2005 technique that was developed by a Columbia University professor named Lance Freeman, the most-cited expert in the field.")
			.append("p")
			.attr("id", "legend_link")
			.style("font-weight", "bold")
			.text("Click here to see Governing.com's methodology.")
			.on("click", function() { window.open("http://www.governing.com/gov-data/gentrification-report-methodology.html"); });
};
