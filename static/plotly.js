

traces = {'bk':'1',	'GZ1':'1',	'GZ2':'1',	'GZ3':'1',	'GZ4':'2',	'GZ5':'2',	'GZ7':'2',
          'DGK':'2',	'NKTD':'3',	'NKTM':'3',	'NKTR':'3',	'ALPS':'3'}
colors = {'bk':'#c9a0dc',	'GZ1':'#082567',	'GZ2':'#6b8e23',	'GZ3':'#310062',	'GZ4':'#cc7722',	'GZ5':'#badbad',	'GZ7':'#ccccff',
          'DGK':'#013220',	'NKTD':'#1e90ff',	'NKTM':'#ebc2af',	'NKTR':'#ff2400',	'ALPS':'#6600ff'}

var headerValues = ["well id", "depth, m"];
chosen_carottages.forEach(function(element) {
  headerValues.push(element);
});
//headerValues.push("lith", "goal");
headerValues.push("goal");

// check chosen  well
if (csv_name !== '') {

//Plotly.d3.csv("../static/data/test47.csv", function(err, rows){
Plotly.d3.csv(csv_name, function(err, rows){
  
  function unpack(rows, key) {
  return rows.map(function(row) { return row[key]; });
  }
   
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
    columnorder: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],
    header: {
      values: headerValues, 
      align: "center",
      line: {width: 1, color: 'rgb(50, 50, 50)'},
      fill: {color: ['#310062']},
      font: {family: "Arial", size: 11, color: "white"}
    },
    cells: {
      values: cellValues,
      align: ["center", "center"],
      line: {color: "black", width: 1},
      fill: {color: ['#C1D0EE', 'rgba(228, 222, 249, 0.65)']},
      font: {family: "Arial", size: 10, color: ["black"]}
    },
    xaxis: 'x',
    yaxis: 'y',
    domain: {x: [0,0.4], y: [0,1]}
  }


  //var data = [table];
  var data = [];

  chosen_carottages.forEach(function(element) {

    var trace = {
      x: unpack(rows, 'depth, m'),
      y: unpack(rows, element),
      xaxis: 'x' + traces[element],
      yaxis: 'y' + traces[element],
      mode: 'lines',
      line: {width: 1, color: colors[element]},
      name: element
    }

    data.push(trace);
  });


  // define subplot axes
  var axis = {
    showline: true, 
    zeroline: false,
    showgrid: true,
    mirror: true, 
    ticklen: 4, 
    gridcolor: '#ffffff',
    tickfont: {size: 10},
  }
  
  var axis1 = {domain: [0, 1], anchor: 'y1', showticklabels: false}
  var axis2 = {domain: [0, 1], anchor: 'y2', showticklabels: false}
  var axis3 = {domain: [0, 1], anchor:  'y3', showticklabels: false}
  var axis4 = {domain: [0.66, 0.98], anchor: 'x1', hoverformat: '.2f'}
  var axis5 = {domain: [0.34, 0.64], anchor: 'x2', hoverformat: '.2f'}
  var axis6 = {domain: [0.0, 0.32], anchor: 'x3', hoverformat: '.2f'}
  //var axis7 = {domain: [0.5, 1], anchor:  'y4'}
  //var axis8 = {domain: [0.0, 0.15], anchor: 'y4', hoverformat: '.2f'}
  
  // define layout
  var layout = {
    title: "TABLE_NAME",
    plot_bgcolor: 'rgba(228, 222, 249, 0.65)',
    showlegend: true,
    xaxis1: Object.assign(axis1,axis),
    xaxis2: Object.assign(axis2,axis),          
    xaxis3: Object.assign(axis3,axis),
    //xaxis4: Object.assign(axis7,axis),
    yaxis1: Object.assign(axis4,axis),  
    yaxis2: Object.assign(axis5,axis),
    yaxis3: Object.assign(axis6,axis),
    //yaxis4: Object.assign(axis8,axis)
  }

  Plotly.plot('graph', data, layout);  
  
});

};