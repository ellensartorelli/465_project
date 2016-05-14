function nest(array) {

  oldWords = {
    "black": {
      "1970" : "70_BLACK70",
      "1980": "80_NHBLK80",
      "1990": "90_NHBLK90",
      "2000": "00_NHBLK00",
      "2010": "10_nhblk10"
    },
    "mhv": {
      "1970" : "70_MHMVAL70",
      "1980": "80_MHMVAL80",
      "1990": "90_MHMVAL90",
      "2000": "00_MHMVAL00",
      "2010": "10_mhmval0a"
    },
    "mrent": {
      "1970" : "70_MRENT70",
      "1980": "80_MRENT80",
      "1990": "90_MRENT90",
      "2000": "00_MRENT00",
      "2010": "10_mrent0a"
    },
    "pop": {
      "1970" : "70_POP70",
      "1980": "80_POP80",
      "1990": "90_POP90",
      "2000": "00_POP00",
      "2010": "10_pop10"
    },
    "white": {
      "1970" : "70_WHITE70",
      "1980": "80_NHWHT80",
      "1990": "90_NHWHT90",
      "2000": "00_NHWHT00",
      "2010": "10_nhwht10"
    }
  };

  return array.map(function(element) {
    var oldProperties = element.properties;
    element.properties = {
      BoroName : oldProperties.BoroName,
      NTAName : oldProperties.NTAName,
      id : oldProperties.id
    };
    ["black", "mhinc", "mhv", "mrent", "pcol", "pop", "white"].forEach(function(word){
      var x = {};
      ["1970", "1980", "1990", "2000", "2010"].forEach(function(year){
        var oldWord;
        if (word == "mhinc" || word == "pcol") {
          oldWord = word + "_" + year.slice(-2);
        } else {
          oldWord = oldWords[word][year];
        }
        x[year] = +oldProperties[oldWord];
      })
      element.properties[word] = x;
    })
    return element;
  })
}
