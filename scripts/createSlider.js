function createSlider(parent, width){
	// var svg = d3.select(parent);
		// .append("svg")
		// .attr({"width":width, "height":height});

	//create slider
	var slider_svg = d3.select(parent)
		.select("#sliderDiv")
		.style("float", "left")
		.append("svg")
		.attr({"width":width, "height":100})
		.attr("id", "slider");

	// Initialize slider
	timeline_slider = d3.slider().min(1970).max(2010).ticks(5)
		.stepValues([1970,1980,1990,2000,2010])
		.tickFormat(d3.format("d"));
	// Render the slider in the div
	d3.select('#slider').call(timeline_slider);
	timeline_slider.value(1970);

	timeline_slider.callback(function(slider){
			updateYear(slider.value());
	});
};
