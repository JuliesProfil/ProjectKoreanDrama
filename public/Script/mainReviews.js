

async function postReview() {
    const loginData = JSON.parse(sessionStorage.getItem('loginData'));
    const selectedDramaId = localStorage.getItem("selectedDramaId");

    let commentInput = document.getElementById("commentInput").value;
    let ratingInput = document.getElementById("ratingInput").value;
    let isFavoriteInput = document.getElementById("isFavoriteInput").checked;

    let reviewData = {
        userID: loginData.fduserid,
        dramaID: parseInt(selectedDramaId),
        commentText: commentInput,
        ratingNumber: ratingInput,
        isFavorite: isFavoriteInput,
    };

    
    if (commentInput.trim() === "") {
        alert("Please write a review.");
        return;
    } else if (ratingInput < 1 || ratingInput > 5) {
        alert("Please give a rating between 1 and 5.");
        return;
    } else {

    }
    

    postData("/dramas/review", reviewData,
        (res) => {
            console.log("Review posted successfully:", res.reviewData);
            alert("Review posted successfully!");
            getAllReviews();

        },
        (error) => {
            console.error("Error posting review:", error);
            alert("Error posting review.");
        });
}







 async function getAllReviews() {

    const selectedDramaId = localStorage.getItem("selectedDramaId");

    getData("/dramas/allReviews",
        (res) => {
            console.log("Here are all the reviews: ", res);
            localStorage.setItem("reviewData", res);

            showAllReviews(res.allReviews, selectedDramaId);
            showAverageRating(res.allReviews, selectedDramaId);
        },
        (error) => {
            console.error(error);
        });
}





async function showAllReviews(reviews, selectedDramaId) {
    const listAllReviewsContainer = document.getElementById("listAllReviewsContainer");
    listAllReviewsContainer.innerHTML = ""; 

    let numberOfReviews = 0;
    for (let i = 0; i < reviews.length; i++) {
        const review = reviews[i];
        if (review.fddramaid === parseInt(selectedDramaId)) {
            const reviewDiv = document.createElement("div");
            reviewDiv.innerHTML = `
                <p> ${review.fdreview}</p>
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



async function showAverageRating(reviews, selectedDramaId) {
    const averageRatingContainer = document.getElementById("averageRatingContainer");
    averageRatingContainer.innerHTML = "";

    let sumOfRating = 0;
    let numberOfRatings = 0;
    for (let i = 0; i < reviews.length; i++) {
        const review = reviews[i];
        if (review.fddramaid === parseInt(selectedDramaId)) {
            sumOfRating += parseFloat(review.fdrating);
            numberOfRatings++;
        }
    }

    const ratingDiv = document.createElement("div");
    if (numberOfRatings > 0) {
        const averageRating = sumOfRating / numberOfRatings;

        ratingDiv.innerHTML = `<h3> ${averageRating.toFixed(1)} stars</h3>`;
        averageRatingContainer.appendChild(ratingDiv);
    } else {
        ratingDiv.innerHTML = `<p> There are no ratings for this drama yet. <p><br>`;
        averageRatingContainer.appendChild(ratingDiv);
    }
}

