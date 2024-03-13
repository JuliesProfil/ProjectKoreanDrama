


async function showSeries() {
    //postExampleSeriesData(); //Put into admin verifications so it can only run once!!

    loadNewTemplate("tlSeries", divContent, true);


    // Makes a GET request to get the series data
    getData("/series/all",
        (res) => {
            console.log("Here is all the series: ", res); // Log response

            displaySeries(res);
        },
        (error) => {
            console.error(error);
        });
}




function displaySeries(res) {
    
            // Process the series data and generate HTML content
            const seriesContent = document.getElementById("seriesContent");
            seriesContent.innerHTML = ""; // Clear existing content

            for (let i = 0; i < res.allSeries.length; i++) {
                 const drama = res.allSeries[i];

            // Create a div element for each drama
            const dramaDiv = document.createElement("div");
            dramaDiv.innerHTML = `<p> ${drama.fdtitle}</p>`;
            seriesContent.appendChild(dramaDiv);
            }
    
  } 


/*
async function showSeries() {
    loadNewTemplate("tlSeries", divContent, true);

    postExampleSeriesData();
}
*/



// Function to post multiple dramas
async function postExampleSeriesData(){
    jsonData = loadInternalData("dataModelDramas","tblDramas") 
    
    console.log("Here is all the series not posted:", jsonData);

    // Makes a POST request to get the series data
    postData("/series/", jsonData,
    (res) => {
        console.log("Here is what was posted: ", jsonData); // Log response
    },
    (error) => {
        console.error(error);
    });    
}




function loadInternalData(source, attribute = "data", ) {
    let data = JSON.parse(document.getElementById(source).innerText)[attribute];
    return data;
}

// This function loads data from a internal source (i.e. a script tag with type application/json)
// The source is the id of the script element
// The attribute is the data attribut to extract (defaults to data)
// The parser is a function that can change the data before it is returnd. 