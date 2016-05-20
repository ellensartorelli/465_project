function clearSelection(){
		selectedTracts = [];
		redrawVis();
		var selectedTracts = d3.selectAll(".selected");
		selectedTracts.classed("selected", false);
};