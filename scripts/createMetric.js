var createMetric = function(parent) {

		var tractType = ["Did not gentrify", "Ineligible", "Selected Tract(s)", "Gentrified"];

		var color = d3.scale.category10().domain(["Did not gentrify", "Ineligible", "Selected Tract(s)", "Gentrified"]);


		var legend = d3.select(parent).select("#legend").append("ul");

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

};
