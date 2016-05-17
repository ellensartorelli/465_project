function tractStatus(){
	d3.json("../data/nyct_final.topojson",function (mapData) {

		mapData.objects["nyct-final"].geometries = nest(mapData.objects["nyct-final"].geometries);

		var features = topojson.feature(mapData, mapData.objects["nyct-final"]).features;

var index_40th = 2137 * 0.4;
var index_30th = 2137 * 0.66;

//
// var mhinc70 = [];
// var mhinc80 = [];
// var mhinc90 = [];
// var mhinc00 = [];
// var mhinc10 = [];
//
// var mhv70 = [];
// var mhv80 = [];
// var mhv90 = [];
// var mhv00 = [];
// var mhv10 = [];
// 
// var pcol70 = [];
// var pcol80 = [];
// var pcol90 = [];
// var pcol00 = [];
// var pcol10 = [];
//
//
// var mhinc_array = {
// 	1970:  mhinc70,
// 	1980:  mhinc80,
// 	1990:  mhinc90,
// 	2000:  mhinc00,
// 	2010:  mhinc10
// };
//
// var mhv_array = {
// 	1970:  mhv70,
// 	1980:  mhv80,
// 	1990:  mhv90,
// 	2000:  mhv00,
// 	2010:  mhv10
// };
//
// var pcol_array = {
// 	1970: pcol70,
// 	1980: pcol80,
// 	1990: pcol90,
// 	2000: pcol00,
// 	2010: pcol10
// };
//
// for(var j = 0; j < features.length; j++){
// 	mhinc_array[70].push(features[j].properties.mhinc[1970]);
// 	mhinc_array[80].push(features[j].properties.mhinc[1980]);
// 	mhinc_array[90].push(features[j].properties.mhinc[1990]);
// 	mhinc_array[00].push(features[j].properties.mhinc[2000]);
// 	mhinc_array[10].push(features[j].properties.mhinc[2010]);
// 	mhv70.push(features[j].properties.mhv[1970]);
// 	mhv80.push(features[j].properties.mhv[1980]);
// 	mhv90.push(features[j].properties.mhv[1990]);
// 	mhv00.push(features[j].properties.mhv[2000]);
// 	mhv10.push(features[j].properties.mhv[2010]);
// 	pcol70.push(features[j].properties.pcol[1970]);
// 	pcol80.push(features[j].properties.pcol[1980]);
// 	pcol90.push(features[j].properties.pcol[1990]);
// 	pcol00.push(features[j].properties.pcol[2000]);
// 	pcol10.push(features[j].properties.pcol[2010]);
// };


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
