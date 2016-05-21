function download() {
  filename = "data.geojson";
  text = '{ "type": "FeatureCollection", "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },"features":'
  + JSON.stringify(downloadTracts.map(flatten))
  + '}';
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);

  downloadTracts = [];
  updateList();
}

function flatten(element) {
  var newEle = {type: "Feature", properties: {}, geometry: element.geometry};
  newEle.properties.tractID = element.properties.id;
  newEle.properties.BoroName = element.properties.BoroName;
  ["black", "mhinc_unadjusted", "mhv_unadjusted", "mrent_unadjusted", "col", "pop", "white", "mhinc", "mhv_adjusted_next", "mhv", "mrent", "pwhite", "pblack", "pcol", "pcol_percent_increase", "mhv_percent_increase"].forEach(function(attribute) {
    ["1970", "1980", "1990", "2000", "2010"].forEach(function(year) {
      newEle.properties[attribute+year] = element.properties[attribute][year];
    });
  });
  return newEle;
}

function addSelectedTracts() {
  downloadTracts = downloadTracts.concat(selectedTracts);
  downloadTracts = arrayUnique(downloadTracts);
  updateList();
}

//copied from: http://stackoverflow.com/questions/1584370/how-to-merge-two-arrays-in-javascript-and-de-duplicate-items
function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}

function updateList() {
  var rows = d3.select("#downloadList")
    .selectAll("tr")
    .data(downloadTracts);
  rows.exit().remove();
  var row = rows.enter().append("tr");
  row.attr("id", function(d) {return "id" + d.properties.id;})
  row.append("td");
  row.append("td")
    .append("input")
    .attr("type", "button")
    .attr("value", "remove")
    .on("click", removeElement);

  rows.select("td").text(function(d){return d.properties.id});

}

function removeElement(d) {
  d3.select("#downloadList")
    .select("#id" + d.properties.id)
    .remove();
  var index = downloadTracts.findIndex(function(e) {
    return e.properties.id == d.properties.id;
  });
  if (index > -1) {
    downloadTracts.splice(index, 1);
  }
}
