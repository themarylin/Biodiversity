function buildMetadata(sample) {

  // @TODO: Complete the following function that buil-ds the metadata panel

  // Use d3 to select the panel with id of `#sample-metadata`
  var Panel = d3.select("#sample-metadata");

  // Use `.html("") to clear any existing metadata
  Panel.html("");

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function (data) {
    for (var i = 0; i < Object.keys(data).length; i++) {
      Panel.append("p")
        .text(`${Object.entries(data)[i][0]} : ${Object.entries(data)[i][1]}`);
    };
  });

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
}

function buildCharts(sample) {
  var DataFrame = dfjs.DataFrame;
  var pieChart = d3.select("#pie");
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function (data) {
    columns = ["otu_ids", "otu_labels", "sample_values"];
    const weatherDF = new DataFrame(data, columns);
    weatherDF.show();

    const otuIDs_sliced = data.otu_ids.slice(0, 9);
    const sampleValue_sliced = data.sample_values.slice(0, 9);

    const otuIDs = data.otu_ids;
    const otuLabels = data.otu_labels;
    const sampleValue = data.sample_values;

    // @TODO: Build a pie chart
    var trace1 = {
      labels: otuIDs_sliced,
      values: sampleValue_sliced,
      type: 'pie'
    };

    var data = [trace1];

    var layout = {
      title: `Top 10 values from Sample: ${sample}`,
    };

    Plotly.newPlot("pie", data, layout);

    // @TODO: Build a Bubble Chart using the sample data
    // #bubble
    var bubble1 = {
      x: otuIDs,
      y: sampleValue,
      mode: 'markers',
      type: 'scatter',
      name: 'otu_Ids',
      text: otuLabels,
      marker: { size: sampleValue },
      color: sampleValue
    };
    var layout = {
      title: "All Samples and their values",
    };
    var bubbleData = [bubble1];

    Plotly.newPlot('bubble', bubbleData, layout);
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