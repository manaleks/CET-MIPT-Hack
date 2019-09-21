


chosen_carottages = chosen_carottages.replace(/&#34;/gi, '"');
var w = chosen_carottages.replace(/ ""/gi, " \"'");
w = w.replace(/""/gi, "'\"");
console.log(w);

data = JSON.parse(w)
console.log(data);

// check chosen  well
if (csv_name !== '') {

//Plotly.d3.csv("../static/data/test47.csv", function(err, rows){
Plotly.d3.csv(csv_name, function(err, rows){
  
  function unpack(rows, key) {
  return rows.map(function(row) { return row[key]; });
  }
  
  // header values
  var headerNames = Plotly.d3.keys(rows[0]);
  var headerValues = [headerNames[1],headerNames[2],
                      headerNames[3],headerNames[4]];
  
  // cell values
  var cellValues = [];
  for (i = 0; i < headerValues.length; i++) { 
    cellValue = unpack(rows, headerValues[i]);
    cellValues[i] = cellValue;
  }
  
  // clean date
  for (i = 0; i < cellValues[0].length; i++) {
  var dateValue = cellValues[0][i].split(' ')[0]
  cellValues[0][i] = dateValue
  }
  
  // create table
  var table = {
    type: 'table',
    columnwidth: [150,200,200,150],
    columnorder: [0,1,2,3],
    header: {
      values: headerValues, 
      align: "center",
      line: {width: 1, color: 'rgb(50, 50, 50)'},
      fill: {color: ['rgb(235, 100, 230)']},
      font: {family: "Arial", size: 11, color: "white"}
    },
    cells: {
      values: cellValues,
      align: ["center", "center"],
      line: {color: "black", width: 1},
      fill: {color: ['rgb(235, 193, 238)', 'rgba(228, 222, 249, 0.65)']},
      font: {family: "Arial", size: 10, color: ["black"]}
    },
    xaxis: 'x',
    yaxis: 'y',
    domain: {x: [0,0.4], y: [0,1]}
  }

  // create 1st plot
  var trace1 = {
    x: unpack(rows, 'depth, m'),
    y: unpack(rows, 'bk'),
    xaxis: 'x1',
    yaxis: 'y1',
    mode: 'lines',
    line: {width: 2, color: '#9748a1'},
    name: 'bk'
  }
  // create 2nd plot
  var trace2 = {
    x: unpack(rows, 'depth, m'),
    y: unpack(rows, 'GZ1'),
    xaxis: 'x2',
    yaxis: 'y2',
    mode: 'lines',
    line: {width: 2, color: '#b04553'},
    name: 'GZ1'
  }
  
  // create 3rd plot
  var trace3 = {
    x: unpack(rows, 'depth, m'),
    y: unpack(rows, 'DGK'),
    xaxis: 'x3',
    yaxis: 'y3',
    mode: 'lines',
    line: {width: 2, color: '#af7bbd'},
    name: 'DGK'
  }

  var trace4 = {
    x: unpack(rows, 'depth, m'),
    y: unpack(rows, 'NKTD'),
    xaxis: 'x3',
    yaxis: 'y3',
    mode: 'lines',
    line: {width: 2, color: '#aabbbd'},
    name: 'NKTD'
  }

  var trace5 = {
    x: unpack(rows, 'depth, m'),
    y: unpack(rows, 'NKTM'),
    xaxis: 'x2',
    yaxis: 'y2',
    mode: 'lines',
    line: {width: 2, color: '#99bb77'},
    name: 'NKTM'
  }
 
  var data = [table, trace1,trace2,trace3, trace4, trace5]
  
  // define subplot axes
  var axis = {
    showline: true,
    zeroline: false,
    showgrid: true,
    mirror:true, 
    ticklen: 4, 
    gridcolor: '#ffffff',
    tickfont: {size: 10},
  }
  
  var axis1 = {domain: [0.5, 1], anchor: 'y1', showticklabels: false}
  var axis2 = {domain: [0.5, 1], anchor: 'y2', showticklabels: false}
  var axis3 = {domain: [0.5, 1], anchor:  'y3'}
  var axis4 = {domain: [0.66, 0.98], anchor: 'x1', hoverformat: '.2f'}
  var axis5 = {domain: [0.34, 0.64], anchor: 'x2', hoverformat: '.2f'}
  var axis6 = {domain: [0.0, 0.32], anchor: 'x3', hoverformat: '.2f'}
  
  // define layout
  var layout = {
    title: "TABLE_NAME",
    plot_bgcolor: 'rgba(228, 222, 249, 0.65)',
    showlegend: true,
    xaxis1: Object.assign(axis1,axis),
    xaxis2: Object.assign(axis2,axis),          
    xaxis3: Object.assign(axis3,axis),
    yaxis1: Object.assign(axis4,axis),  
    yaxis2: Object.assign(axis5,axis),
    yaxis3: Object.assign(axis6,axis)
  }

  Plotly.plot('graph', data, layout);  
  
});

};