// Define variables

let bellyButtonData={};
let y=[];

// Read input file 
d3.json("samples.json").then(function(data){

  // store data read in a variable
    bellyButtonData = data;
    console.log(data) // Dump the data

    //Now we want to read the sample values and sort them in decreasing order
    let count = bellyButtonData.samples.length;
    let x=[];
    for (var i=0;i< count;i++){
        x[i]=bellyButtonData.samples[i];
        x[i].sample_values.sort(function sortFunction(a, b) {return b - a;});
        //Generating a json object with sample values and otu_ids
        y.push({"id":bellyButtonData.samples[i].id,"otu_ids":x[i].otu_ids.slice(0,10), "sample_values":x[i].sample_values.slice(0,10)});
        
        //Select the id 
        d3.select("#selDataset").append("option").attr("value",bellyButtonData.samples[i].id).text(bellyButtonData.samples[i].id);
        // Add the OTU string to the IDs since that is the ask in assignment
        for (var j=0 ;j< y[i].otu_ids.length;j++) {
            y[i].otu_ids[j]= 'OTU '+y[i].otu_ids[j].toString();
        }

    }
    // Init function 
    function init() {

      // Define data for bar plot
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
            height:800,
            width:800
        };
        
        Plotly.newPlot("bar", data,layout);
      // Define init data for bubble  plot
        var  data1 = [{
          x: bellyButtonData.samples[0].otu_ids,
          y: bellyButtonData.samples[0].sample_values,
          text: bellyButtonData.samples[0].otu_labels,
          mode:"markers",
          marker: {
              color: bellyButtonData.samples[0].otu_ids,
              size:(bellyButtonData.samples[0].sample_values),
            }
      }];

      var layout={
          title:'Bubble plot',
          showlegend:false,
          height:600,
          width:800
      };
      
       Plotly.newPlot("bubble", data1,layout);
      
       // Display init metadata 
       let string=""
       for (var keys in bellyButtonData.metadata[0]) {
         console.log(keys, '::', bellyButtonData.metadata[0][keys])
       string +=  keys.toUpperCase() + ":" + bellyButtonData.metadata[0][keys] +`<br>`;
       }
       document.getElementById("sample-metadata").innerHTML =string;
     

// Display init gauge counter. 
       var data = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: bellyButtonData.metadata[0].wfreq,
          title: { text: "Weekly Wash Freq", font: { size: 24 } },
          gauge: {
            axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
            bar: { color: "darkblue" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
              { range: [0, 1], color: "violet" },
              { range: [1,2], color: "indigo" },
              { range: [2,3], color: "lightblue" },
              { range: [3,4], color: "blue" },
              { range: [4,5], color: "green" },
              { range: [5,6], color: "yellow" },
              { range: [6,7], color: "orange" },
              { range: [7,8], color: "red" },
              { range: [8,9], color: "purple" }
              
              
            ],
            threshold: {
              line: { color: "red", width: 4 },
              thickness: 0.75,
              value: 7
            }
          }
        }
      ];
      
      var layout = {
        width: 500,
        height: 400,
        margin: { t: 25, r: 25, l: 25, b: 25 },
        paper_bgcolor: "lavender",
        font: { color: "darkblue", family: "Arial" },
        // Tried to add an arrow in the gauge but in vain
        // annotations: [
        //   {
        //     ax: 0.5,
        //     ay: 0,
        //     axref: 'x',
        //     ayref: 'y',
        //     x: 0.5,
        //     y: 1,
        //     xref: 'x',
        //     yref: 'y',
        //     showarrow: true,
        //     arrowhead: 9,
        //   }
        // ]
      };
     
      Plotly.newPlot('gauge', data, layout);

      };
    
    init();


 });


// On change to the DOM, call getData()
d3.select("#selDataset").on("change", getData);

// Check when the value is  changed 
function optionChanged(value){

    return value;
  }


// Update the restyled plot's values
function updatePlotly(newdata,newdata1) {

    Plotly.newPlot("bar", newdata);
    Plotly.newPlot("bubble", newdata1);
  }
  
  // Get the new data ujsing JS for by matching the ID with the id field in data set
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
  // Update matched data
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
  }];

  // This is for bubble plot
  var match1 = bellyButtonData.samples.filter(obj => {
    return obj.id === dataset;
  });
  //This is for meta data field
  var match2 = bellyButtonData.metadata.filter(obj => {
    return obj.id === Number(dataset);
  });

// log the metadata string by loopijng through the dictionary object. Add a break after each row

  let string=""
  for (var keys in match2[0]) {
    console.log(keys, ':', match2[0][keys])
  string +=  keys.toUpperCase() + ":" + match2[0][keys] +`<br>`;


  // Here is another way to print the string but above is better since it is more generic

  // document.getElementById("sample-metadata").innerHTML += `<br>`+"Ethnicity: "+ match2[0].ethnicity;
  // document.getElementById("sample-metadata").innerHTML += `<br>`+"BellyButton Type: "+ match2[0].bbtype;
  // document.getElementById("sample-metadata").innerHTML += `<br>`+"Gender: "+ match2[0].gender;
  // document.getElementById("sample-metadata").innerHTML += `<br>`+"Id: "+ match2[0].id;
  // document.getElementById("sample-metadata").innerHTML += `<br>`+"Location: "+ match2[0].location;
  // document.getElementById("sample-metadata").innerHTML += `<br>`+"Wash Frequency "+ match2[0].wfreq;

}

// This call  adds the string to sample-metadata id
  document.getElementById("sample-metadata").innerHTML =string;

  // Bubble plot updated data.

  var  updated_data1 = [{
    x: match1[0].otu_ids,
    y: match1[0].sample_values,
    text:match1[0].otu_labels,
    mode:"markers",
    name: match1[0].id.toString(),
    marker: {
        color: match1[0].otu_ids,
        size: match1[0].sample_values
      }
    // order:descending
  }];
  console.log("data1.y:",updated_data1[0].y, "match1[0].sample_values", match1[0].sample_values);
  var layout={
    title:'Bubble plot',
    showlegend:false,
    height:600,
    width:800
  };
  // Gauge plot updated data

  var gaugeData = [
    {
      type: "indicator",
      mode: "gauge+number",
      value: match2[0].wfreq,
      title: { text: "Weekly Wash Freq", font: { size: 24 } },
      gauge: {
        axis: { range: [null, 9 ], tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "darkblue" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 1], color: "violet" },
          { range: [1,2], color: "indigo" },
          { range: [2,3], color: "blue" },
          { range: [3,4], color: "blue" },
          { range: [4,5], color: "green" },
          { range: [5,6], color: "yellow" },
          { range: [6,7], color: "orange" },
          { range: [7,8], color: "red" },
          { range: [8,9], color: "purple" }
          
          
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 7
        }
      }
    }
  ];
  
  var layout = {
    width: 500,
    height: 400,
    margin: { t: 25, r: 25, l: 25, b: 25 },
    paper_bgcolor: "lavender",
    font: { color: "darkblue", family: "Arial" }
  };
  
  Plotly.newPlot('gauge', gaugeData, layout);

  console.log("updated_data  :",updated_data);
  console.log("updated_data1 :",updated_data1);
  // PLot the bar and bubble plots. The gauge plot as plotted earlier on line 290
  updatePlotly(updated_data, updated_data1);


};
