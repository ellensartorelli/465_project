function identifyGentrified(array) {

  //calculate percent increase for percent w/ college degree and median home value
  array = array.map(function(element) {
    element.properties.pcol_percent_increase = {};
    element.properties.mhv_percent_increase = {};
    ["1970", "1980", "1990", "2000", "2010"].forEach(function(year, index, array) {
      if (year == "1970") return;
      var previousYear = array[index-1];
      if (element.properties.pcol[previousYear] == 0) {
        element.properties.pcol_percent_increase[year] = 0;
      } else {
        var pcolIncrease = element.properties.pcol[year] - element.properties.pcol[previousYear];
        element.properties.pcol_percent_increase[year] = 100 * pcolIncrease / element.properties.pcol[previousYear];
      }

      if (element.properties.mhv_unadjusted[previousYear] == 0) {
        element.properties.mhv_percent_increase[year] = 0;
      } else {
        var mhvIncrease = element.properties.mhv_unadjusted[year] - element.properties.mhv_adjusted_next[previousYear];
        element.properties.mhv_percent_increase[year] = 100 * mhvIncrease / element.properties.mhv_unadjusted[previousYear];
      }
    });
    return element;
  });

  //create sorted arrays of properties from which we need percentiles
  //median household income
  var mhinc = {};
  ["1970", "1980", "1990", "2000", "2010"].forEach(function(year) {
    mhinc[year] = array.map(function(element){
      return element.properties.mhinc_unadjusted[year];
    });
  });
  for (year in mhinc) {
    mhinc[year] = mhinc[year].sort(comparator);
  }

  //median home value
  var mhv = {};
  ["1970", "1980", "1990", "2000", "2010"].forEach(function(year) {
    mhv[year] = array.map(function(element){
      return element.properties.mhv_unadjusted[year];
    });
  });
  for (year in mhv) {
    mhv[year] = mhv[year].sort(comparator);
  }

  //percent increase of median homevalue
  var mhv_increase = {};
  ["1980", "1990", "2000", "2010"].forEach(function(year) {
    mhv_increase[year] = array.map(function(element){
      return element.properties.mhv_percent_increase[year];
    });
  });
  for (year in mhv_increase) {
    mhv_increase[year] = mhv_increase[year].sort(comparator);
  }

  //percent increase in percent with college degree
  var pcol_increase = {};
  ["1980", "1990", "2000", "2010"].forEach(function(year) {
    pcol_increase[year] = array.map(function(element){
      return element.properties.pcol_percent_increase[year];
    });
  });
  for (year in pcol_increase) {
    pcol_increase[year] = pcol_increase[year].sort(comparator);
  }

  var per40 = Math.floor(array.length * 0.4);
  var topThird = Math.floor(array.length * 0.6666);

  function comparator(a,b){
    if (isNaN(a)) return -1;
    if (isNaN(b)) return 1;
    return +a - b;
  }

  //return the array with new properties
  return array.map(function(element) {
    element.properties.status = {};
    ["1970", "1980", "1990", "2000", "2010"].forEach(function(year, index, array) {
      if (year == "1970") return;
      var previousYear = array[index-1];
      var status = "ineligible";
      //check pre-conditions:
      if (
        //1. population >= 500
        (element.properties.pop[previousYear]) >= 500 && (element.properties.pop[year] >= 500)
        ///2. Median household income is in the bottom 40th percentile
        && (element.properties.mhinc_unadjusted[previousYear] < mhinc[previousYear][per40])
        //3. Median home value is in the bottom 40th percentile
        && (element.properties.mhv_unadjusted[previousYear] < mhv[previousYear][per40])
      ) status = "eligible";

      //check post-conditions
      if (status == "eligible") {
        if (
          //1. percent increase in percent with college degree is in top third
          (element.properties.pcol_percent_increase[year] > pcol_increase[year][topThird])
          //2. Median home value increased
          && (element.properties.mhv[year] > element.properties.mhv[previousYear])
          //3. precent increase in median home value is in top third
          && (element.properties.mhv_percent_increase[year] > mhv_increase[year][topThird])
        ) status = "gentrified";
      }
      element.properties.status[year] = status;
    });
    return element;
  });
}
