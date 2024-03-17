import express, { response } from "express";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import Dramas from "../modules/dramas.mjs";
import { authenticateLogin } from "../modules/userMiddleware.mjs";


import DBManager from "../modules/storageManager.mjs";

const dbm = new DBManager();


const DRAMAS_API = express.Router();
DRAMAS_API.use(express.json()); 






//Post sereis data---------------------------------------------------
DRAMAS_API.post('/', async (req, res, next) => { 
    
    const dramas = req.body;
    console.log("Here is the body data:", req.body);
    
    for (let i = 0; i < dramas.length; i++) {
        const drama = dramas[i];
        if (!drama.fdTitle || !drama.fdDescription || !drama.fdGenre || !drama.fdEpisodeNumber || !drama.fdReleaseDate) {
            console.log("Something is wrong!")
            return res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send({ message: 'Invalid request body' });
        }
    };

    
    try {
        const insertedDrama = await dbm.postMultipleDramas(dramas);

        res.status(HTTPCodes.SuccesfullRespons.Ok).send({ message: 'Inserted Ok', code: 200, data: insertedDrama });
    } catch (error) {
        console.error(error);
        res.status(HTTPCodes.ServerErrorRespons.InternalError).send({ message: 'An error occurred while posting dramas' });
    }
});









//Get dramas data -----------------------------------------------
DRAMAS_API.get('/all', async (req, res, next) => {

    try {
        const allDramas = await dbm.listAllDramasFromDatabase();

        if (allDramas !== null) {
            res.status(HTTPCodes.SuccesfullRespons.Ok).json({ msg: "Here are all the dramas", allDramas });
        } else {
            res.status(HTTPCodes.ClientSideErrorRespons.NotFound).json({ msg: "Dramas not found" }).end();
        }
    } catch (error) {
        console.error(error);
        res.status(HTTPCodes.ServerErrorRespons.InternalError).send("Failed to fetch dramas from the database").end();
    }
});






//Post review data---------------------------------------------------
DRAMAS_API.post('/review', authenticateLogin, async (req, res, next) => { 
    const { userID, dramaID, commentText, ratingNumber, isFavorite } = req.body;

    console.log("Here is the review body:", req.body)


    if (userID && dramaID && commentText && ratingNumber && typeof isFavorite === 'boolean') {

    try {
      
        const reviewData = await dbm.createReview({ 
            userId: userID, 
            dramaId: dramaID, 
            comment: commentText, 
            rating: ratingNumber,  
            isFavorite: isFavorite
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
DRAMAS_API.get('/allReviews', async (req, res, next) => {

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








export default DRAMAS_API;
