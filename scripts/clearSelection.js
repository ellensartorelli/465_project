function clearSelection(){
	var tracts = d3.selectAll(".tract.selected")
	tracts.classed("selected", false);
	selectedTracts = [];
	redrawVis();
};