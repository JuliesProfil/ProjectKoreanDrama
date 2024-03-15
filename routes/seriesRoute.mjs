import express, { response } from "express";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import Series from "../modules/series.mjs";

import DBManager from "../modules/storageManager.mjs";

const dbm = new DBManager();


const SERIES_API = express.Router();
SERIES_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.






//Post sereis data---------------------------------------------------
SERIES_API.post('/', async (req, res, next) => { 
    const series = req.body;
    
    //const { fdTitle, fdDescription, fdGenre, fdEpisodeNumber, fdReleaseDate } = series[0];
    console.log("Here is the body data:", req.body);


    for (const issue of series) {
        if (!issue.fdTitle || !issue.fdDescription || !issue.fdGenre || !issue.fdEpisodeNumber || !issue.fdReleaseDate) {
            console.log("Something is wrong!")
            return res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send({ message: 'Invalid request body' });
        }
    }
    
    
/*
    const drama = {
        fdTitle,
        fdDescription,
        fdGenre,
        fdEpisodeNumber,
        fdReleaseDate
    };
    */

    try {
        const insertedDrama = await dbm.postMultipleDramas(series);

        res.status(HTTPCodes.SuccesfullRespons.Ok).send({ message: 'Inserted Ok', code: 200, data: insertedDrama });
    } catch (error) {
        console.error(error);
        res.status(HTTPCodes.ServerErrorRespons.InternalError).send({ message: 'An error occurred while posting series' });
    }
});









//Get series data -----------------------------------------------
SERIES_API.get('/all', async (req, res, next) => {

    try {
        const allSeries = await dbm.listAllSeriesFromDatabase();

        if (allSeries !== null) {
            res.status(HTTPCodes.SuccesfullRespons.Ok).json({ msg: "Here are all the series", allSeries });
        } else {
            res.status(HTTPCodes.ClientSideErrorRespons.NotFound).json({ msg: "Series not found" }).end();
        }
    } catch (error) {
        console.error(error);
        res.status(HTTPCodes.ServerErrorRespons.InternalError).send("Failed to fetch series from the database").end();
    }
});






//Post review data---------------------------------------------------
SERIES_API.post('/review', async (req, res, next) => { 
    const { userID, dramaID, commentText, ratingNumber, status, isFavorite, hasWatched } = req.body;

    console.log("Here is the review body:", req.body)


    if (userID && dramaID && commentText && ratingNumber && status && typeof isFavorite === 'boolean' && typeof hasWatched === 'boolean') {

    try {
      
        const reviewData = await dbm.createReview({ 
            userId: userID, 
            dramaId: dramaID, 
            comment: commentText, 
            rating: ratingNumber, 
            status: status, 
            isFavorite: isFavorite, 
            hasWatched: hasWatched 
        });

        res.status(HTTPCodes.SuccesfullRespons.Ok).json({ reviewData }).end();
    } catch (error) {
        console.error("Error posting review:", error);
        res.status(HTTPCodes.ServerErrorRespons.InternalError).send("An error occurred while posting the review").end();
    }

} else {
    res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send({message: "Mangler data felt"}).end();
}
});





//Get review data -----------------------------------------------
SERIES_API.get('/allReviews', async (req, res, next) => {

    try {
        const allReviews = await dbm.listAllReviewsFromDatabase();

        if (allReviews !== null) {
            res.status(HTTPCodes.SuccesfullRespons.Ok).json({ msg: "Here are all the reviews", allReviews });
        } else {
            res.status(HTTPCodes.ClientSideErrorRespons.NotFound).json({ msg: "Reviews not found" }).end();
        }
    } catch (error) {
        console.error(error);
        res.status(HTTPCodes.ServerErrorRespons.InternalError).send("Failed to fetch reviews from the database").end();
    }
});












//SERIES_API.get("/:id", Series.listAll);

export default SERIES_API;
