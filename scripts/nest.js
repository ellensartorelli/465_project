function nest(array) {

  oldWords = {
    "black": {
      "1970" : "BLACK70",
      "1980": "NHBLK80",
      "1990": "NHBLK90",
      "2000": "NHBLK00",
      "2010": "nhblk10"
    },
    "mhv": {
      "1970" : "MHMVAL70",
      "1980": "MHMVAL80",
      "1990": "MHMVAL90",
      "2000": "MHMVAL00",
      "2010": "mhmval0a"
    },
    "mrent": {
      "1970" : "MRENT70",
      "1980": "MRENT80",
      "1990": "MRENT90",
      "2000": "MRENT00",
      "2010": "mrent0a"
    },
    "pop": {
      "1970" : "POP70",
      "1980": "POP80",
      "1990": "POP90",
      "2000": "POP00",
      "2010": "pop10"
    },
    "white": {
      "1970" : "WHITE70",
      "1980": "NHWHT80",
      "1990": "NHWHT90",
      "2000": "NHWHT00",
      "2010": "nhwht10"
    },
    "mhinc": {
      "1970" : "HINC70",
      "1980": "hinc80",
      "1990": "HINC90",
      "2000": "HINC00",
      "2010": "hinc0a"
    },
    "pcol": {
      "1970" : "COL70",
      "1980": "col80",
      "1990": "COL90",
      "2000": "COL00",
      "2010": "col0a"
    }
  };

  return array.map(function(element) {
    var oldProperties = element.properties;
    //if tract is park
    if (element.properties.NTAName.substring(0, 17) === "park-cemetery-etc") {
      element.properties = {
        BoroName : oldProperties.BoroName,
        NTAName : oldProperties.NTAName,
        id : oldProperties.tractID
      };
      ["black", "mhinc", "mhv", "mrent", "pcol", "pop", "white"].forEach(function(word){
        var x = {};
        ["1970", "1980", "1990", "2000", "2010"].forEach(function(year){
          x[year] = 0;
        })
        element.properties[word] = x;
      })
      return element;
    }

    element.properties = {
      BoroName : oldProperties.BoroName,
      NTAName : oldProperties.NTAName,
      id : oldProperties.tractID
    };
    ["black", "mhinc", "mhv", "mrent", "pcol", "pop", "white"].forEach(function(word){
      var x = {};
      ["1970", "1980", "1990", "2000", "2010"].forEach(function(year){
        var oldWord = oldWords[word][year];
        x[year] = +oldProperties[oldWord];
      })
      element.properties[word] = x;
    })
    return element;
  })
}
