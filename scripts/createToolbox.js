function createToolbox(parent){

		var toolbox = d3.select(parent)
			.append("ul")
			.attr("id", "toolbox");


		var toolbox_listItem = toolbox.selectAll("ul")
			.data(["Selection", "Brushing", "Panning", "Clear All"])
			.enter()
		 	.append("li")
		 	.attr("id", "toolbox_item");


		var photo_span = d3.selectAll("#toolbox_item").append("span")
			.attr("class", function(d){
				return d;
			})
			.style({
				"padding-left":"23px",
				"width":"0px",
				"height":"23px"
			});


		photo_span.append("input")
			.attr({
				"type": "button",
				"id": function(d){
					return d},
				"value": function(d){
					return d;},
				"onclick": "setTool(id)"
			});

};