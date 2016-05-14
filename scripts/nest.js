function nest(array) {
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
        var abbr = year.slice(-2);
        x[year] = oldProperties[word+"_"+abbr];
      })
      element.properties[word] = x;
    })
    return element;
  })
}
