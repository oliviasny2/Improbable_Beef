function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
// Deliverable 1
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    let sampleArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let filterSample = sampleArray.filter(chartVar => chartVar.id === sample);
    //  5. Create a variable that holds the first sample in the array.
    let filteredChart = filterSample[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otuIds = filteredChart.otu_ids;
    let otuLabels = filteredChart.otu_labels;
    let sampleValues = filteredChart.sample_values;

    // 7. Create the yticks for the bar chart. 
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.slice(0,10);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      y: otuIds.map(ids => "OTU " + ids + " ").slice(0,10).reverse(),
      text: otuLabels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      font: {
        family: "Arial",
        size: 15
      }
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Bar and Bubble charts: Deliverable 2
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Electric"
          }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: { text: "Bacteria Cultures Per Sample"},
      xaxis: {title: "OTU IDs"},
      font: {
        family: "Arial",
        size: 15
      }
    };  

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  

    // 3. Create a variable that holds the washing frequency.
    let freqById = data.metadata.filter(Id => Id.id == sample)[0].wfreq;

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      title: {text: "Belly Button Washing Frequency"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [0,10], dtick: 2},
        steps: [
        {range:[0,2], color: "red"},
        {range:[2,4], color: "orange"},
        {range:[4,6], color: "yellow"},
        {range:[6,8], color: "lightgreen"},
        {range:[8,10], color: "green"},
      ],        
      bar: { color: "black"}
    },
    value: freqById
  }];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      margin: { t: 40, r: 40, l: 40, b: 40 },
      font: {
        family: 'Arial',
        size: 15
      }
    };

  // 6. Use Plotly to plot the gauge data and layout.
  Plotly.newPlot("gauge", gaugeData, gaugeLayout);
});


}