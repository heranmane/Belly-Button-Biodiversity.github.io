// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument
function buildPlot(sampleID) {
    d3.json("samples.json").then((importedData) => {
        console.log(importedData);
        var data = importedData;
        // Grab values from the response json object to build the plots
        // var sampleID = "940"
        var result = data.samples.filter(Object => Object.id == sampleID)[0]

        // var results = data.metadata.filter(Object => Object.id == sampleID)[0]
        // var ethnicity = results.ethnicity
    // console.log(`this is my ${ethnicity}`)
        var otuIds = result.otu_ids
        var otuLabels = result.otu_labels
        var sampleValues = result.sample_values

        // Reverse the array due to Plotly's defaults

        var ydata = otuIds.slice(0, 10).map(otuId => "OTU " + otuId).reverse()
        var xdata = sampleValues.slice(0, 10).reverse()

        var text = otuLabels.slice(0, 10).reverse()



        // Trace1 for the Data
        var trace1 = {
            x: xdata,
            y: ydata,
            text: text,
            type: "bar",
            orientation: "h"
        };

        // data
        var chartData = [trace1];

        // Apply the group bar mode to the layout
        var layout = {
            title: "Top 10 Bacteria",
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
        };

        // Render the plot to the div tag with id "plot"
        Plotly.newPlot("bar", chartData, layout);
        var trace2 = {
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIds,
            }
        };

        var layout = {
            title: "Bacteria Cultures",

            xaxis: {
                title: "OTU ID"
            }

        }
        Plotly.newPlot("bubble", [trace2], layout);


    });
}
// retrieve Metadata 
function buildmetaData(sampleID) {
    d3.json("samples.json").then(function (metaData) {
        console.log(metaData);
        var mdata = metaData;
        // Grab values from the response json object to build the plots
        // var sampleID = "940"

        var results = mdata.metadata.filter(Object => Object.id == sampleID)[0]
        var table = d3.select("#sample-metadata")

        table.html("")
        Object.entries(results).forEach(([key, value]) => {
            table.append("h4").text(key + ": " + value)
        })
        

    });
     
}

// dropdown
function init() {

    var location = d3.select("#selDataset");
    names = []

    // On change to the DOM, call getData()
    d3.json("samples.json").then((sampleNames) => {
        
        var names= sampleNames.names
        names.forEach((sample) => {
            // console.log(sample)
            location
                .append("option")
                .text(sample)
                .property("value", sample);
        });
        // Use the first sample from the list to build the initial plots
        buildPlot(names[0])
        buildmetaData(names[0])
    });
}
// reset 
function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildPlot(newSample);
    buildmetaData(newSample);
}


init();
