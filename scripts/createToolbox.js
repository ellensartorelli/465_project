function createToolbox(parent){

		var toolbox = d3.select(parent)
			.append("ul")
			.attr("id", "toolbox");


		// var toolbox_listItem = toolbox.selectAll("ul")
		// 	.data(["Selection", "Brushing", "Panning"])
		// 	.enter()
		//  	.append("li")
		//  	.attr("id", "toolbox_item");


		// var photo_span = d3.selectAll("#toolbox_item").append("span")
		// 	.attr("class", function(d){
		// 		return d;
		// 	})
		// 	.style({
		// 		"padding-left":"23px",
		// 		"width":"15px",
		// 		"height":"23px"
		// 	});


		// toolbox_listItem.append("input")
		// 	.attr({
		// 		"type": "radio",
		// 		"id": function(d){
		// 			return d},
		// 		"value": function(d){
		// 			return d;},
		// 		"name": "tool",
		// 		"onclick": "setTool(id)"
		// 	});

		// toolbox_listItem.append("span")
		// 	.attr("id", "tool_text")
		// 	.text(function(d){return d;});

		var lastItem = toolbox.selectAll("ul")
			.data(["Clear selections"])
			.enter()
			.append("li")
			.append("input")
			.attr({
				"type": "button",
				"value": function(d){
					return d;
				},
				"onclick": "clearSelection()"
			});


	function clearSelection(){
		selectedTracts = [];
		redrawVis();
	};
};
