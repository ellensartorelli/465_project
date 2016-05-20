var createMetric = function(parent) {

		var tractType = ["Did not gentrify", "Ineligible", "Selected Tract(s)", "Gentrified"];

		var color = d3.scale.category10().domain(["Did not gentrify", "Ineligible", "Selected Tract(s)", "Gentrified"]);

		// var color = d3.scale.ordinal(metricList.map(function(d){return d.abbr}))
		// 			.range(["#6baed6", "#74c476", "#9e9ac8", "#fd8d3c", "#fb6a4a", "#f768a1"]);
		// 			//blue:mhinc, green:pcol, purple:mhval, oragne:black, red:white, black:rent

		var legend = d3.select(parent).select("#legend");

		var list_item = legend.selectAll("ul")
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

		// var box = list_item.append("text")
		// 	.attr({
		// 		"type": "radio",
		// 		"value": function(d){
		// 			return d.name;
		// 		},
		// 		"id": function(d) {return d.abbr;},
		// 		"name": "metricToMap"
		// 	})
		// 	.on("change", function(){
		// 			console.log(this.value+" is checked");
		// 			//SEND THIS VALUE TO SET THE METRIC TO BE DISPLAYED ON THE MAP
		// 			//SEND THIS VALUE TO HIGHLIGHT LINE IN LINE GRAPH
		// 			//SENT THIS VALUE TO BE HIGHLIGHTED BAR IN BAR CHART

		// 			// var update = updateKey(this.value);
		// 			// if(update == true){//clear legend
		// 			// 	d3.selectAll("#key").remove();
		// 			// 	makeLegend("#map", colorScale);
		// 			// };
		// 			//d3.selectAll("#key").remove();
		// 			metric = this.id;
		// 			recolorMap();
		// 	});


		list_item.append("span")
			.text(function(d){return d;});

};
