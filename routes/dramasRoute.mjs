import express, { response } from "express";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import { authenticateLogin } from "../modules/userMiddleware.mjs";


import DBManager from "../modules/storageManager.mjs";


const DRAMAS_API = express.Router();
DRAMAS_API.use(express.json()); 






//Post drama data---------------------------------------------------
DRAMAS_API.post('/', async (req, res, next) => { 
    
    const dramas = req.body;
    console.log("Here is the body data:", req.body);
    
    for (let i = 0; i < dramas.length; i++) {
        const drama = dramas[i];
        if (!drama.fdTitle || !drama.fdDescription || !drama.fdGenre || !drama.fdEpisodeNumber || !drama.fdReleaseDate) {
            console.log("Something is wrong!")
            return res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).json({ message: 'Invalid request body' });
        }
    };

    
    try {
        const insertedDrama = await DBManager.postMultipleDramas(dramas);

        res.status(HTTPCodes.SuccesfullRespons.Ok).json({ message: 'Inserted Ok', code: 200, data: insertedDrama });
    } catch (error) {
        console.error(error);
        res.status(HTTPCodes.ServerErrorRespons.InternalError).json({ message: 'An error occurred while posting dramas' });
    }
});






//Get drama data -----------------------------------------------
DRAMAS_API.get('/all', async (req, res, next) => {

    try {
        const allDramas = await DBManager.listAllDramasFromDatabase();

        if (allDramas !== null) {
            res.status(HTTPCodes.SuccesfullRespons.Ok).json({ message: "Here are all the dramas", allDramas });
        } else {
            res.status(HTTPCodes.ClientSideErrorRespons.NotFound).json({ message: "Dramas not found" }).end();
        }
    } catch (error) {
        console.error(error);
        res.status(HTTPCodes.ServerErrorRespons.InternalError).json("Failed to fetch dramas from the database").end();
    }
});






//Post review data---------------------------------------------------
DRAMAS_API.post('/review', authenticateLogin, async (req, res, next) => { 
    const { userID, dramaID, commentText, ratingNumber, isFavorite } = req.body;
    console.log("Here is the review body:", req.body)

    if (userID && dramaID && commentText && ratingNumber && typeof isFavorite === 'boolean') {

    try {
      
        const reviewData = await DBManager.createReview({ 
            userId: userID, 
            dramaId: dramaID, 
            comment: commentText, 
            rating: ratingNumber,  
            isFavorite: isFavorite
        });

        res.status(HTTPCodes.SuccesfullRespons.Ok).json({ reviewData }).end();
    } catch (error) {
        console.error("Error posting review:", error);
        res.status(HTTPCodes.ServerErrorRespons.InternalError).json({message: "An error occurred while trying to post the review"}).end();
    }

} else {
    res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).json({message: "Missing data fields."}).end();
}
});





//Get review data -----------------------------------------------
DRAMAS_API.get('/allReviews', async (req, res, next) => {

    try {
        const allReviews = await DBManager.listAllReviewsFromDatabase();

        if (allReviews !== null) {
            res.status(HTTPCodes.SuccesfullRespons.Ok).json({ message: "Here are all the reviews", allReviews });
        } else {
            res.status(HTTPCodes.ClientSideErrorRespons.NotFound).json({ message: "Reviews not found" }).end();
        }
    } catch (error) {
        console.error(error);
        res.status(HTTPCodes.ServerErrorRespons.InternalError).json("Failed to fetch reviews from the database").end();
    }
});







export default DRAMAS_API;
