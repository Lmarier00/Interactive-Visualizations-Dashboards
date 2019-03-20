// @TODO: Complete the following function that builds the metadata panel

function buildMetadata(sample) {

    var dataURL = `/metadata/${sample}`; 

    // Use `d3.json` to fetch the metadata for a sample
    d3.json(dataURL).then(function(sampleData) {

    // Use d3 to select the panel with id of `#sample-metadata`
        var selection = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
        selection.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    
        Object.entries(sampleData).forEach(entry => {
          let key = entry[0];
          let value = entry[1];
          selection.append("div")
            .text(`${key}: ${value}`)
        });  
    });  
}
    
function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  
     // @TODO: Build a Bubble Chart using the sample data
    
    var dataURL = `/samples/${sample}`;
    d3.json(dataURL).then (function(sampleData) {

      var trace1 = {

        X: sampleData.otu_ids,
        y: sampleData.sample_values,
        mode: 'markers',
        text: sampleData.otu_labels,
        marker: {
          color: sampleData.otu_ids,
          size: sampleData.sample_values,
          colorscale: "Earth",
        }
      };

      var data = [trace1];
      var layout = {
        xaxis: {
          title: "OTU ID",
        },
        showlegend: false,
        height: 600,
        width: 1500,
      };
        
      Plotly.newPlot('bubble', data, layout);

 
  // @TODO: Build a Pie Chart
   // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
      var data = [{
        values: sampleData.sample_values.slice(0, 10),
        labels: sampleData.otu_ids.slice(0, 10),
        hovertext: sampleData.otu_labels.slice(0,10),
        type: 'pie',
      }];

      var layout = {
        height: 400,
        width: 500,
        showlegend: true,
      };

      Plotly.newPlot('pie', data, layout);
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
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();