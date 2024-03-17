document.addEventListener("DOMContentLoaded", function () {
    localStorage.removeItem("selectedDramaId");

    const btnDramas = document.getElementById("btnDramas");
    btnDramas.addEventListener("click", function () {
        localStorage.removeItem("selectedDramaId");
        showAllDramas();
    });
});



async function showAllDramas() {
    //postJsonDramaData(); //Put into admin verifications so it can only run once!!

    loadNewTemplate("tlDramas", divContent, true);

    getData("/dramas/all",
        (res) => {
            console.log("Here is all the dramas: ", res);
            localStorage.setItem("dramasData", res);

            showDramas(res);
        },
        (error) => {
            console.error(error);
        });
}



// Function to post multiple dramas - JSON data
async function postJsonDramaData() {
    jsonData = loadInternalData("dataModelDramas", "tblDramas")

    postData("/dramas/", jsonData,
        (res) => {
            console.log("Here is the json data posted: ", jsonData);
        },
        (error) => {
            console.error(error);
        });
}


function loadInternalData(source, attribute = "data", ) {
    let data = JSON.parse(document.getElementById(source).innerText)[attribute];
    return data;
}



async function showDramas(res) {
    const dramaContent = document.getElementById("dramaContent");
    dramaContent.innerHTML = "";

    const genreSelector = document.getElementById("genreSelector");

    genreSelector.addEventListener("change", function () {
        const selectedGenre = genreSelector.value;
        showDramaByGenere(res.allDramas, selectedGenre);
    });

    showDramasAllGeneres(res.allDramas);

}



function convertDate(releaseDate) {
    let date = new Date(releaseDate);
    let convertedDate = date.toDateString();
    return convertedDate;
}


async function showDramasAllGeneres(dramas) {
    for (let i = 0; i < dramas.length; i++) {
        const drama = dramas[i];

        let convertedDate = convertDate(drama.fdreleasedate);

        const dramaDiv = document.createElement("div");
        dramaDiv.innerHTML = `
            <h3>${drama.fdtitle}</h3>
            <img src="${drama.fdcoverimageurl}"></img>
            <p><b>Release date:</b> ${convertedDate}</p>
            <br>
            <br>
        `;
        dramaContent.appendChild(dramaDiv);


        dramaDiv.addEventListener("click", function () {
            localStorage.setItem("selectedDramaId", drama.fddramaid);

            loadNewTemplate("tlOneDrama", divContent, true);

            getAllReviews();
            loadOneDrama(drama);

            const btnAddReview = document.getElementById("btnAddReview");
            btnAddReview.addEventListener("click", function () {
                postReview();
                getAllReviews();

            });

        });
    }
}



async function showDramaByGenere(dramas, genre) {

    dramaContent.innerHTML = "";
    for (let i = 0; i < dramas.length; i++) {
        const drama = dramas[i];

        let convertedDate = convertDate(drama.fdreleasedate);

        if (drama.fdgenre.includes(genre)) {
            const dramaDiv = document.createElement("div");
            dramaDiv.innerHTML = `
                <h3>${drama.fdtitle}</h3>
                <img src="${drama.fdcoverimageurl}"></img>
                <p><b>Release date:</b> ${convertedDate}</p>
                <br>
                <br>
            `;
            dramaContent.appendChild(dramaDiv);


            dramaDiv.addEventListener("click", function () {
                localStorage.setItem("selectedDramaId", drama.fddramaid);

                loadNewTemplate("tlOneDrama", divContent, true);

                getAllReviews();
                loadOneDrama(drama);

                const btnAddReview = document.getElementById("btnAddReview");
                btnAddReview.addEventListener("click", function () {
                    postReview();
                    getAllReviews();
                });
            });
        }
    }
}




async function loadOneDrama(selectedDrama) {
    const oneDramaContent1 = document.getElementById("oneDramaContent1");
    oneDramaContent1.innerHTML = "";
    const oneDramaContent2 = document.getElementById("oneDramaContent2");
    oneDramaContent2.innerHTML = "";

    const genres = selectedDrama.fdgenre.split(",");
    let listGenre = "<ul>";
    genres.forEach(genre => {
        listGenre += "<li>" + genre;
    });
    listGenre += "</ul>";

    let convertedDate = convertDate(selectedDrama.fdreleasedate);

    const oneDramaDiv1 = document.createElement("div");
    oneDramaDiv1.innerHTML = `
        <h1>${selectedDrama.fdtitle}</h1>
        <img src="${selectedDrama.fdcoverimageurl}"></img> 
    `;
    oneDramaContent1.appendChild(oneDramaDiv1);

    const oneDramaDiv2 = document.createElement("div");
    oneDramaDiv2.innerHTML = `
        <p><b>Description of the plot:</b> ${selectedDrama.fddescription}</p>
        <p><b>Genres:</b> ${listGenre}</p> 
        <p><b>Number of episodes:</b> ${selectedDrama.fdepisodenumber}</p>
        <p><b>Release date:</b> ${convertedDate}</p>
        <br>
    `;
    oneDramaContent2.appendChild(oneDramaDiv2);
};