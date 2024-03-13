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
    const seriesContent = document.getElementById("seriesContent");
    //seriesContent.innerHTML = ""; // Clear 

    for (let i = 0; i < res.allSeries.length; i++) {
        const drama = res.allSeries[i];

        const dramaDiv = document.createElement("div");
        dramaDiv.innerHTML = `
                <h3>${drama.fdtitle}</h3>
                <!--<img src="${drama.fdcoverimageurl}"></img>-->
                <p><b>Release date/year:</b> ${drama.fdreleasedate}</p> //BARE ÅR!!
                <br>
                <br>
            `;
        seriesContent.appendChild(dramaDiv);


        dramaDiv.addEventListener("click", function () {
            localStorage.setItem("theSeries", drama.fddramaid);
            loadNewTemplate("tlOneSeries", divContent, true);
            loadOneSeries(res.allSeries);
            //console.log("En serie!", res.allSeries)
            //loadNewTemplate("tlOneSeries", divContent, true);
            //location.href = "plantdetail.html";
        });
    }

}



async function loadOneSeries(dramas) {
    let theSeries = localStorage.getItem("theSeries");
    const oneSeriesContent = document.getElementById("oneSeriesContent");
    const oneDramaDiv = document.createElement("div");

    console.log("En serie ID!", theSeries);

    // Subtract 1 from theSeriesID to get the correct index
    let selectedIndex = parseInt(theSeries) - 1;

    if (selectedIndex >= 0 && selectedIndex < dramas.length) {
        const selectedDrama = dramas[selectedIndex];


        //<img src="${drama.fdcoverimageurl}"></img> //FIKS!!!

        oneDramaDiv.innerHTML = `
            <h2>${selectedDrama.fdtitle}</h2>
            <p><b>Description of the plot:</b> ${selectedDrama.fddescription}</p>
            <p><b>Genres:</b> ${selectedDrama.fdgenre}</p> //FIX!!! HUSK FIKS BILDE OG!!
            <p><b>Number of episodes:</b> ${selectedDrama.fdepisodenumber}</p>
            <p><b>Release date:</b> ${selectedDrama.fdreleasedate}</p>
            <br>
        `;
        oneSeriesContent.appendChild(oneDramaDiv);
    } else {
        console.error("Selected drama is not found!");
    }
}







/*
async function showSeries() {
    loadNewTemplate("tlSeries", divContent, true);

    postExampleSeriesData();
}
*/



// Function to post multiple dramas
async function postExampleSeriesData() {
    jsonData = loadInternalData("dataModelDramas", "tblDramas")

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