document.addEventListener("DOMContentLoaded", function () {
    localStorage.removeItem("selectedDramaId");
    showAllSeries();
});

async function showAllSeries() {
    //postExampleSeriesData(); //Put into admin verifications so it can only run once!!

    loadNewTemplate("tlSeries", divContent, true);

    // Makes a GET request to get the series data
    getData("/series/all",
        (res) => {
            console.log("Here is all the series: ", res); // Log response
            localStorage.setItem("seriesData", res);
            console.log("Series data", res)

            displaySeries(res);
        },
        (error) => {
            console.error(error);
        });
}





// Function to post multiple dramas - JSON data
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





async function displaySeries(res) {
    const seriesContent = document.getElementById("seriesContent");
    seriesContent.innerHTML = ""; 

    const genreSelector = document.getElementById("genreSelector");

    genreSelector.addEventListener("change", function () {
        const selectedGenre = genreSelector.value;
        showSeriesByGenre(res.allSeries, selectedGenre);
    });

    showSeriesAllGeneres(res.allSeries);

}




async function showSeriesAllGeneres(series) {
    for (let i = 0; i < series.length; i++) {
        const drama = series[i];

        let releaseDate = drama.fdreleasedate;
        let date = new Date(releaseDate);
        let convertedDate = date.toDateString();

        const dramaDiv = document.createElement("div");
        dramaDiv.innerHTML = `
            <h3>${drama.fdtitle}</h3>
            <img src="${drama.fdcoverimageurl}"></img>
            <p><b>Release date:</b> ${convertedDate}</p>
            <br>
            <br>
        `;
        seriesContent.appendChild(dramaDiv);

        dramaDiv.addEventListener("click", function () {
            //localStorage.setItem("theSeries", drama.fddramaid);
            localStorage.setItem("selectedDramaId", drama.fddramaid);

            loadNewTemplate("tlOneSeries", divContent, true);

            getAllReviews();
            loadOneSeries(drama);

            const btnAddReview = document.getElementById("btnAddReview");

            btnAddReview.addEventListener("click", function () {
                postReviewData();

            });

        });
    }
}



async function showSeriesByGenre(series, genre) {

    seriesContent.innerHTML = ""; 
    for (let i = 0; i < series.length; i++) {
        const drama = series[i];

        let releaseDate = drama.fdreleasedate;
        let date = new Date(releaseDate);
        let convertedDate = date.toDateString();


        if (drama.fdgenre.includes(genre)) {
            const dramaDiv = document.createElement("div");
            dramaDiv.innerHTML = `
                <h3>${drama.fdtitle}</h3>
                <img src="${drama.fdcoverimageurl}"></img>
                <p><b>Release date:</b> ${convertedDate}</p>
                <br>
                <br>
            `;
            seriesContent.appendChild(dramaDiv);

            dramaDiv.addEventListener("click", function () {
                //localStorage.setItem("theSeries", drama.fddramaid);
                localStorage.setItem("selectedDramaId", drama.fddramaid);

                loadNewTemplate("tlOneSeries", divContent, true);

                getAllReviews();
                loadOneSeries(drama);

                const btnAddReview = document.getElementById("btnAddReview");

                btnAddReview.addEventListener("click", function () {
                    postReviewData();

                });
            });
        }
    }
}







async function loadOneSeries(selectedDrama) {
    const oneSeriesContent = document.getElementById("oneSeriesContent");
    oneSeriesContent.innerHTML = ""; 

    const genres = selectedDrama.fdgenre.split(",");
    let listGenre = "<ul>";

    genres.forEach(genre => {
        listGenre += "<li>" + genre;
    });
    listGenre += "</ul>";

    const oneDramaDiv = document.createElement("div");
    oneDramaDiv.innerHTML = `
        <h2>${selectedDrama.fdtitle}</h2>
        <img src="${selectedDrama.fdcoverimageurl}"></img> 
        <p><b>Description of the plot:</b> ${selectedDrama.fddescription}</p>
        <p><b>Genres:</b> ${listGenre}</p> //FIX!!! HUSK FIKS BILDE OG!!
        <p><b>Number of episodes:</b> ${selectedDrama.fdepisodenumber}</p>
        <p><b>Release date:</b> ${selectedDrama.fdreleasedate}</p>
        <br>
    `;
    oneSeriesContent.appendChild(oneDramaDiv);
}








async function postReviewData() {

    const loginData = JSON.parse(sessionStorage.getItem('loginData'));

    //let theSeries = parseInt(localStorage.getItem("theSeries"));
    let commentInput = document.getElementById("commentInput").value;
    let ratingInput = document.getElementById("ratingInput").value;
    let statusInput = document.getElementById("statusInput").value;
    let isFavoriteInput = document.getElementById("isFavoriteInput").checked;
    let hasWatchedInput = document.getElementById("hasWatchedInput").checked;

    let reviewData = {
        userID: loginData.fduserid,
        dramaID: theSeries,
        commentText: commentInput,
        ratingNumber: ratingInput,
        status: statusInput,
        isFavorite: isFavoriteInput,
        hasWatched: hasWatchedInput
    };

    /*
    if (commentInput.trim() === "") {
        alert("Please write a review.");
        return;
    } else if (ratingInput < 1 || ratingInput > 5) {
        alert("Please give a rating between 1 and 5.");
        return;
    }
    */

    postData("/series/review", reviewData,
        (res) => {
            console.log("Review posted successfully:", res.reviewData);
            alert("Review posted successfully!");

            //localStorage.setItem("reviewData", res.reviewData);

        },
        (error) => {
            console.error("Error posting review:", error);
            alert("Error posting review.");
        });
}









async function getAllReviews() {

    const selectedDramaId = localStorage.getItem("selectedDramaId");

    getData("/series/allReviews",
        (res) => {
            console.log("Here are all the reviews: ", res);
            localStorage.setItem("reviewData", res);

            displayAllReviews(res.allReviews, selectedDramaId);
            displayAverageRatings(res.allReviews, selectedDramaId);


        },
        (error) => {
            console.error(error);
        });
}










async function displayAllReviews(reviews, selectedDramaId) {
    const listAllReviewsContainer = document.getElementById("listAllReviewsContainer");
    listAllReviewsContainer.innerHTML = ""; 

    let numberOfReviews = 0;
    for (let i = 0; i < reviews.length; i++) {
        const review = reviews[i];
        // Checks if the review dramaId number is the same as the selectedDramaId
        if (review.fddramaid === parseInt(selectedDramaId)) {
            const reviewDiv = document.createElement("div");
            reviewDiv.innerHTML = `
                <p>Review: ${review.fdreview}</p>
                <br>
            `;
            listAllReviewsContainer.appendChild(reviewDiv);
            numberOfReviews++;
        }
    }
    if (numberOfReviews === 0) {

        const reviewDiv = document.createElement("div");
        reviewDiv.innerHTML = "There are no reviews for this drama yet."
        listAllReviewsContainer.appendChild(reviewDiv);
    }
}



async function displayAverageRatings(reviews, selectedDramaId) {
    const averageRatingContainer = document.getElementById("averageRatingContainer");
    averageRatingContainer.innerHTML = ""; // Clear 

    let sumRating = 0;
    let numberOfRatings = 0;
    for (let i = 0; i < reviews.length; i++) {
        const review = reviews[i];
       // Checks if the review dramaId number is the same as the selectedDramaId
        if (review.fddramaid === parseInt(selectedDramaId)) {
            sumRating += parseFloat(review.fdrating);
            numberOfRatings++;
        }
    }

    const ratingDiv = document.createElement("div");
    if (numberOfRatings > 0) {
        const averageRating = sumRating / numberOfRatings;

        ratingDiv.innerHTML = `<p>Average rating for this drama: ${averageRating.toFixed(0)}<p>
            <br>`;
        averageRatingContainer.appendChild(ratingDiv);
    } else {
        ratingDiv.innerHTML = `<p> There are no ratings for this drama yet. <p>
            <br>`;
        averageRatingContainer.appendChild(ratingDiv);
    }
}




