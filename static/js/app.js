function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample

  var url = `/metadata/${sample}`;

  d3.json(url).then(function(response){

    // Use d3 to select the panel with id of `#sample-metadata`
    var sampleMetadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sampleMetadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(response).forEach(function([key, value]){
      sampleMetadata.append("panel-body").text(`${key}: ${value} \n`);
    });

    console.log(response.WFREQ);

    buildGuage(response.WFREQ);

  });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    //console.log(response.WFREQ);

    //buildGuage(response.WFREQ);

}

function buildGuage(sample) {

  //var urlGuage = `/wfreq/${sample}`;

  //d3.json(ulrGuage).then(function(resp){
    var level = sample * 18;

    console.log(level);

    // Trig to calc meter point
    var degrees = 180 - level,
    radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
    pathX = String(x),
    space = ' ',
    pathY = String(y),
    pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [
      { type: 'scatter',
        x: [0], y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'wFreq',
        text: sample,
        hoverinfo: 'text+name'
      },
      { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9,50/9,50/9,50/9, 50],
        rotation: 90,
        text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
        textinfo: 'text',
        textposition:'inside',
        marker: {
          colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)','rgba(170, 202, 42, .5)', 
          'rgba(202, 209, 95, .5)','rgba(210, 206, 145, .5)', 'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
          'rgba(170, 202, 42, .5)','rgba(232, 226, 202, .5)','rgba(255, 255, 255, 0)']
                },
        labels: ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0'],
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
      }
    ];

    var layout = {
      shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        } 
      }],
      title: 'Belly Button Washing Frequency',
      height: 500,
      width: 500,
      xaxis: {zeroline:false, showticklabels:false,
              showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
              showgrid: false, range: [-1, 1]}
    };

    Plotly.newPlot("gauge", data, layout);

  //});

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  
  var urlsample = `/samples/${sample}`;

  //console.log(url);

  // @TODO: Build a Bubble Chart using the sample data
  
  d3.json(urlsample).then(function(data){

      var xvalue = data.otu_ids;
      var yvalue = data.sample_values;
      var label = data.otu_labels;
      var bsize = data.sample_values;
      var bcolor = data.otu_ids;

      //Collect data for plotting.
      trace1 = {
        x: xvalue,
        y: yvalue,
        text: label,
        mode: 'markers',
        marker: {
          color: bcolor,
          size: bsize
        }
      };

      //Create a data variable
      var bubbleData = [trace1];

      //Define layout
      var layout = {
        title: "Sample Data Bubble Chart",
        xaxis: {
          title: "OTU ID"
        }
      };

      //Plot the bubble plot.
      Plotly.newPlot("bubble",bubbleData, layout);

      // @TODO: Build a Pie Chart
      // HINT: You will need to use slice() to grab the top 10 sample_values,
      // otu_ids, and labels (10 each).
      //Build a Pie Chart using the sample data and slice 10 records.
      var pieValue = data.sample_values.slice(0,10);
      var pieLabel = data.otu_ids.slice(0,10);
      var pieHover = data.otu_labels.slice(0,10);

      //Collect data foe Pie Chart
      var trace2 = {
        values: pieValue,
        labels: pieLabel,
        hovertext: pieHover,
        type: "pie"
      };

      //Create a data variable
      pieData = [trace2];


      //Plot the pie plot
      Plotly.newPlot("pie", pieData);

  });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    //buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  //var  = d3.select("#selDataset").node().value;

  buildCharts(newSample);
  buildMetadata(newSample);
  buildGuage(newSample);
}

// Initialize the dashboard
init();
