// Global variable to store the dataset
var loadedData;

// Function to initialize the dashboard
function init() {
    // Use D3 to read in samples.json if not already loaded
    if (!loadedData) {
        d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
            .then((data) => {
                // Store the loaded data globally
                loadedData = data;

                // Extract necessary data
                var names = data.names;

                // Populate the dropdown menu with subject IDs
                var dropdown = d3.select("#selDataset");
                names.forEach((name) => {
                    dropdown.append("option").text(name).property("value", name);
                });

                // Call the function to update the dashboard based on the selected subject ID
                updateDashboard(names[0]);
            });
    }
    else {
        // Dataset already loaded, proceed with initializing the dashboard
        var names = loadedData.names;
        // Populate the dropdown menu with subject IDs
        var dropdown = d3.select("#selDataset");
        names.forEach((name) => {
            dropdown.append("option").text(name).property("value", name);
        });

        // Call the function to update the dashboard based on the selected subject ID
        updateDashboard(names[0]);
    }
}

// Function to update the dashboard based on the selected subject ID
function updateDashboard(selectedID) {
    // Extract necessary data for the selected subject ID
    var selectedSample = loadedData.samples.find(sample => sample.id.toString() === selectedID);
    var metadata = loadedData.metadata.find(item => item.id === parseInt(selectedID));

    // Update the bar chart
    updateBarChart(selectedSample);

    // Update the bubble chart
    updateBubbleChart(selectedSample);

    // Update the gauge chart
    updateGaugeChart(metadata.wfreq);

    // Display sample metadata
    displayMetadata(metadata);
}

// Function to update the bar chart based on the selected sample
function updateBarChart(selectedSample) {
    // Clear existing chart
    d3.select("#bar").html("");

    // Slice the top 10 values
    var sampleValuesTop10 = selectedSample.sample_values.slice(0, 10).reverse();
    var otuIdsTop10 = selectedSample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    var otuLabelsTop10 = selectedSample.otu_labels.slice(0, 10).reverse();

    // Create a horizontal bar chart
    var trace = {
        x: sampleValuesTop10,
        y: otuIdsTop10,
        text: otuLabelsTop10,
        type: "bar",
        orientation: "h"
    };

    var layout = {
        title: `Top 10 OTUs for Subject ID ${selectedSample.id}`,
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU ID" }
    };

    // Plot the chart using Plotly
    Plotly.newPlot("bar", [trace], layout);
}

// Function to update the bubble chart based on the selected sample
function updateBubbleChart(selectedSample) {
    // Clear existing chart
    d3.select("#bubble").html("");

    // Extract data for the bubble chart
    var sampleValues = selectedSample.sample_values;
    var otuIds = selectedSample.otu_ids;
    var otuLabels = selectedSample.otu_labels;

    // Create a bubble chart
    var trace = {
        x: otuIds,
        y: sampleValues,
        mode: 'markers',
        marker: {
            size: sampleValues,
            color: otuIds,
            colorscale: 'Viridis'
        },
        text: otuLabels
    };

    var layout = {
        title: `Bubble Chart for Subject ID ${selectedSample.id}`,
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Sample Values" }
    };

    // Plot the chart using Plotly
    Plotly.newPlot("bubble", [trace], layout);
}

// Function to update the gauge chart based on the selected sample
function updateGaugeChart(washingFrequency) {
    // Clear existing chart
    d3.select("#gauge").html("");

    // Create a gauge chart
    var trace = {
        type: "indicator",
        mode: "gauge+number",
        value: washingFrequency,
        title: { text: "Belly Button Washing Frequency<br>Scrubs per Week", font: { size: 20 } },
        gauge: {
            axis: { range: [0, 9], tickwidth: 1, tickcolor: "darkblue" },
            bar: { color: "darkblue" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
                { range: [0, 1], color: "rgba(255, 0, 0, 0.5)" },
                { range: [1, 2], color: "rgba(255, 51, 0, 0.5)" },
                { range: [2, 3], color: "rgba(255, 102, 0, 0.5)" },
                { range: [3, 4], color: "rgba(255, 153, 0, 0.5)" },
                { range: [4, 5], color: "rgba(255, 204, 0, 0.5)" },
                { range: [5, 6], color: "rgba(255, 255, 0, 0.5)" },
                { range: [6, 7], color: "rgba(204, 255, 0, 0.5)" },
                { range: [7, 8], color: "rgba(153, 255, 0, 0.5)" },
                { range: [8, 9], color: "rgba(102, 255, 0, 0.5)" },
            ],
        }
    };

    var layout = {
        width: 400,
        height: 300,
        margin: { t: 25, r: 25, l: 25, b: 25 }
    };

    // Plot the chart using Plotly
    Plotly.newPlot("gauge", [trace], layout);
}

// Function to display sample metadata
function displayMetadata(metadata) {
    // Select the panel for displaying metadata
    var metadataPanel = d3.select("#sample-metadata");

    // Clear existing metadata
    metadataPanel.html("");

    // Display each key-value pair from the metadata JSON object
    Object.entries(metadata).forEach(([key, value]) => {
        metadataPanel.append("p").text(`${key}: ${value}`);
    });
}

// Function to handle dropdown change event
function optionChanged(selectedID) {
    updateDashboard(selectedID);
}

// Call the init function to initialize the dashboard
init();
