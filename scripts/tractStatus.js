function tractStatus(){
	d3.json("../data/nyct_final.topojson",function (mapData) {

		mapData.objects["nyct-final"].geometries = nest(mapData.objects["nyct-final"].geometries);

		var features = topojson.feature(mapData, mapData.objects["nyct-final"]).features;

var index_40th = 2137 * 0.4;
var index_30th = 2137 * 0.66;
var years = [1970, 1980, 1990, 2000, 2010];
var mhv_cutoffs = {};

//gentrification criteria:
//eligble (pre): bottom 40th in mhv and mhinc
//gentirfy: top third in pcol & top third in precent increase in median homeval

//find elibility cutoffs
years.forEach(function(year) {
	features.sort(function(feat1, feat2) {
		return feat1.properties.mhv[year] < feat1.properties.mhv[year];
	})
})


//iterate through tracts
for(var i = 0; i < features.length; i++){

	//loop through all years
	for(var year_num = 1970; i <= 2010; i+=10){

		features[i].properties.eligibility = {};

		features[i].properties.eligibility[year_num] = " ";
			//if the first year or if hasn't already gentrified --> check for eligiblity
		if(year_num == 1970 || features[i].properties.eligibility[year_num - 10] != "gentrified"){

			mhinc_array[year_num].sort();
			//get all mhincs into an array and sort it
			var mhinc_40th = mhinc_array[year_num][index_40th];
			console.log(year_num);
			console.log(mhinc_array[year_num]);
			console.log(index_40th);
			console.log(mhinc_40th);

			mhv_array[year_num].sort();
			//get all mhv into an array and sort it
			var mhv_40th = mhv_array[year_num][index_40th];

			//for all tracts where mhinc <= 40th_mhinc AND mhv <= 40th_mhv
			if(features[i].properties.mhinc[year_num] < mhinc_40th && features[i].properties.mhval[year_num] < mhv_40th){
				//some property is set to "eligible"
				features[i].properties.eligibility[year_num] = "eligible";
			}else{
				//else --> some property is set to "not eligible"
				features[i].properties.eligibility[year_num] = "not";
			};
		};

//if year != 1970:
	if(year_num!=1970){
			// if tract == gentrified --> property == gentrified
			//if tract == not eligible --> property == not eligible
			if(features[i].properties.eligibility[year_num - 10] == "gentrified" || features[i].properties.eligibility[year_num - 10] == "not" ){
				features[i].properties.eligibility[year_num] = features[i].properties.eligibility[year_num - 10];
			}else{ // that it is eligible

				//get all pcol into an array and sort it
				pcol_array[year_num].sort();
				var pcol_30th = pcol_array[year_num][index_30th];

				if(features[i].properties.pcol[year_num] >= pcol_30th){
					features[i].properties.eligibility[year_num] = "gentrified";
				}else{
					//still eligible
					features[i].properties.eligibility[year_num] = "eligible";
				};
		};
	};

				}; //YEAR SHOULD INCREASE
				debugger;
		}; //TRACT SHOULD INCREASE
		// debugger;
	});
};
