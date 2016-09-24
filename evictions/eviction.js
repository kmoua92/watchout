var dateDistrict = [];

for (var i = 0; i < evictionData.data.length; i++) {
  // 13, 35
  var data = evictionData.data[i];

  dateDistrict.push({date: data[13], district: data[35], year: new Date(data[13]).getFullYear()});
};

var filteredData = {};


// loop through data and sort by year
for (var i = 0; i < dateDistrict.length; i++) {
  if (!filteredData[dateDistrict[i].year]) {
    filteredData[dateDistrict[i].year] = 1;
  } else {
    filteredData[dateDistrict[i].year] = filteredData[dateDistrict[i].year] + 1;
  }
}

var barWidth = 580 / (Object.keys(filteredData).length+4);
var processedData=[]; 

Object.keys(filteredData).forEach(function(key) 
  {processedData.push({year: key, count: filteredData[key]})}); 

// height of bar = starting y - y line

var maxEvictions = processedData.reduce(function(acc,item){ return item.count > acc ? item.count : acc}, 0); // return 2917
var maxHeight = 380 / maxEvictions;



d3.select('svg').selectAll('rect').data(processedData)
  .enter().append('rect')
  .attr('x', function(d, i) {
    return (i * barWidth) + (5*i) + 20;
  })
  .attr('y', function(d) {
    return 380 - (d.count * maxHeight);
  })
  .attr('width', barWidth)
  .attr('height', function(d) {
    return d.count * maxHeight;
  });

var setBarColor = function() {
  var rects = $('rect');
  for (var r of rects) {
    $(r).attr('fill', `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`)
  }
};

setInterval(setBarColor, 500);


