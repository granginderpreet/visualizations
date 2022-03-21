// 1. Use the D3 library to read in `samples.json`.

// 2. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.

// * Use `sample_values` as the values for the bar chart.

// * Use `otu_ids` as the labels for the bar chart.

// * Use `otu_labels` as the hovertext for the chart.

//   ![bar Chart](Images/hw01.png)
console.log("hello")

let bellyButtonData={};
let y=[];
d3.json("samples.json").then(function(data){

    bellyButtonData = data;
    console.log(data)
    let count = bellyButtonData.samples.length;
    let x=[];
    for (var i=0;i< count;i++){
        x[i]=bellyButtonData.samples[i];
        x[i].sample_values.sort(function sortFunction(a, b) {return b - a;});
        y.push({"id":bellyButtonData.samples[i].id,"otu_ids":x[i].otu_ids.slice(0,10), "sample_values":x[i].sample_values.slice(0,10)});
        d3.select("#selDataset").append("option").attr("value",bellyButtonData.samples[i].id).text(bellyButtonData.samples[i].id);
        // js.push({id:currid,otu_ids:x[i].otu_ids, sample_values:x[i].sample_values});
        for (var j=0 ;j< y[i].otu_ids.length;j++) {
            y[i].otu_ids[j]= 'OTU '+y[i].otu_ids[j].toString();
        }
 
        

    }
    console.log(y[0] )
    function init() {
        var  data = [{
            x: y[0].sample_values.reverse(),
            y: y[0].otu_ids.reverse(),
            type: "bar",
            orientation:"h",
            name:y[0].id.toString(),
            marker: {
                color: 'rgba(55,128,191,0.8)',
                width: 2,
              },
            categoryorder:'total descending'
            // order:descending
        }];
         console.log(y[0].id);
        var layout={
            height:600,
            width:800
        };
        
        Plotly.newPlot("bar", data,layout);
        
    };
   init();

});


// On change to the DOM, call getData()
d3.select("#selDataset").on("change", getData);

function optionChanged(value){
    // var match = js.keys(js).find(key => js[key] === value);
    // console.log("match:", match);
    return value;
  }
  
  console.log(y); // 'Bob', 47
// Function called by DOM changes


// Update the restyled plot's values
function updatePlotly(newdata) {
    // var layout={
    //     height:600,
    //     width:800
    // };
    Plotly.newPlot("bar", newdata);
  }
  
function getData() {
  var dropdownMenu = d3.select("#selDataset");
  console.log(dropdownMenu)
  // Assign the value of the dropdown menu option to a variable
  var dataset = dropdownMenu.property("value");
  console.log("dataset:",dataset);
  var match = y.filter(obj => {
    return obj.id === dataset;
  });
  console.log("match:",match);
  var  updated_data = [{
    x: match[0].sample_values.reverse(),
    y: match[0].otu_ids.reverse(),
    type: "bar",
    orientation:"h",
    name:match[0].id,
    marker: {
        color: 'rgba(55,128,191,0.8)',
        width: 2,
      },
    categoryorder:'total descending'

    // order:descending
}];
    console.log("updated_data  :",updated_data);
// new Promise((resolve, reject) => {
//     reject(new Error("Whoops!"));
//   }).catch(alert); // Error: Whoops!
    // Call function to update the chart
    updatePlotly(updated_data);
}
