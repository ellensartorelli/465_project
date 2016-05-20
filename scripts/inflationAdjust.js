function inflationAdjust(array) {
  var inflation = { //inflation values taken from: http://www.usinflationcalculator.com
    "1970": {"1980": 2.12, "2010": 5.62},
    "1980": {"1990": 1.59, "2010": 2.65},
    "1990": {"2000": 1.32, "2010": 1.67},
    "2000": {"2010": 1.27},
    "2010": {"2010": 1}
  }

  return array.map(function(element) {
    element.properties.mhinc_adjusted_next = {}; //adjusted for $ of next census year
    element.properties.mhinc = {}; //adjusted for 2010 $
    element.properties.mhv_adjusted_next = {};
    element.properties.mhv = {}; //adjusted for 2010 $
    element.properties.mrent_adjusted_next = {};
    element.properties.mrent = {}; //adjusted for 2010 $

    ["1970", "1980", "1990", "2000", "2010"].forEach(function(year, index, array) {
      element.properties.mhinc[year] = element.properties.mhinc_unadjusted[year] * inflation[year]["2010"];
      element.properties.mhv[year] = element.properties.mhv_unadjusted[year] * inflation[year]["2010"];
      element.properties.mrent[year] = element.properties.mrent_unadjusted[year] * inflation[year]["2010"];

      if (year != "2010") {
        var nextYear = array[index+1];
        element.properties.mhinc_adjusted_next[year] = element.properties.mhinc_unadjusted[year] * inflation[year][nextYear];
        element.properties.mhv_adjusted_next[year] = element.properties.mhv_unadjusted[year] * inflation[year][nextYear];
        element.properties.mrent_adjusted_next[year] = element.properties.mrent_unadjusted[year] * inflation[year][nextYear];
      }
    });
    return element;
  });
}
