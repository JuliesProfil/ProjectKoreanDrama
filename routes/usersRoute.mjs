import express, {
    response
} from "express";
import User from "../modules/user.mjs";
import {
    HTTPCodes
} from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";

import DBManager from "../modules/storageManager.mjs";

const dbm = new DBManager();

//import {getUserFromPasswordAndEmail } from "../modules/storageManager.mjs"
//import {getUserFromEmail } from "../modules/storageManager.mjs"



const USER_API = express.Router();
USER_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.

const users = [];




USER_API.get('/', (req, res, next) => {
    SuperLogger.log("Demo of logging tool");
    SuperLogger.log("A important msg", SuperLogger.LOGGING_LEVELS.CRTICAL);
})




//Create a new user---------------------------------------------------
USER_API.post('/', async (req, res, next) => { //async from teacher

    // This is using javascript object destructuring.
    // Recomend reading up https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#syntax
    // https://www.freecodecamp.org/news/javascript-object-destructuring-spread-operator-rest-parameter/

    const { userName, userEmail, userPassword } = req.body;

    if (userName != "" && userEmail != "" && userPassword != "") {

        try {
            ///TODO: Does the user exist?
            console.log(`userEmail = ${userEmail}`);
            let exists = await dbm.getUserFromEmail(userEmail);


            if (!exists) {
                console.log("User does not exist!")
            //Create a new user
            let user = new User();
            user.name = userName;
            user.email = userEmail;
            ///TODO: Do not save passwords.
            user.pswHash = userPassword;
            


                //TODO: What happens if this fails? //from teacher
                user = await user.save(); //from teacher
                //res.status(HTTPCodes.SuccesfullRespons.Ok).json(JSON.stringify(user)).end(); //from teacher
                
                 // Log the saved user information
                 console.log('Saved user info:', user);

                //users.push(user); 
                res.status(HTTPCodes.SuccesfullRespons.Ok).send({msg:"You sucsessfully made a new user!"}).end();


            } else {
                res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).json({msg:"A user with this email already exists"}).end();
            }


        } catch (error) {
            console.error(error);
            res.status(HTTPCodes.ServerErrorRespons.InternalError).send("An error occurred while creating the user").end();
            send({message: "An error occurred while creating the user"}).end();

        }


    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send({message: "Mangler data felt"}).end();
    }

});






//Login user---------------------------------------------------
USER_API.post('/login', async (req, res, next) => {

    const { userEmail, userPassword } = req.body;
    //const user = await findUserByEmail(email);

    try {
        console.log(`Email = ${userEmail}`, `Password = ${userPassword}`);
        const userInfo = await dbm.getUserFromPasswordAndEmail(userEmail, userPassword);

        if(userInfo){
            res.status(HTTPCodes.SuccesfullRespons.Ok).send({message: "User Ok", code: 200, data: userInfo}).end();
          }else{
            res.status(HTTPCodes.ClientSideErrorRespons.Unauthorized).send({message: "Wrong user name or password!", data: null}).end();
          }

        } catch (error) {
            console.error(error);
            res.status(HTTPCodes.ServerErrorRespons.InternalError).send("An error occurred while creating the user").end();
            
        }

});





//Edit and update user by ID-------------------------------------
USER_API.put('/', async (req, res, next) => {

    const { userID, userName, userEmail, userPassword } = req.body;

    try {
        const user = new User(); 
        user.id = userID; // Set the user ID

        // Assign properties directly from request body
        user.name = userName;
        user.email = userEmail;
        user.pswHash = userPassword;

        // Call updateUser method to update user data in the database
        const updatedUser = await user.save();

        // Send success response with updated user data
        res.status(HTTPCodes.SuccesfullRespons.Ok).send(updatedUser).end();
    } catch (error) {
        console.error(error);
        res.status(HTTPCodes.ServerErrorRespons.InternalError).send("Failed to update user").end();
    }



    
    /// TODO: Edit user
    // Code to update user based on ID

    //From teacher:
    /// TODO: Edit user
    //const user = new User(); //TODO: The user info comes as part of the request 
    //user.save();
})







//Delete user by ID-------------------------------------
USER_API.delete('/delete', async (req, res) => {

    const { userID } = req.body;
    console.log("This is the current user:", userID);


    try {
        // Calls deleteUser to delete the user
        const user = new User(); 
        user.id = userID; 
        const deletedUser = await user.delete(userID); 
       

        if (deletedUser) {
            res.status(HTTPCodes.SuccesfullRespons.Ok).json( {message: "User deleted successfully"} , deletedUser).end();

        } else {
            res.status(HTTPCodes.ClientSideErrorRespons.NotFound).json({msg:"User not found or could not be deleted"}).end();
        }
    } catch (error) {
        console.error(error);
        res.status(HTTPCodes.ServerErrorRespons.InternalError).send({msg:"Failed to delete user"}).end();
    }


})




// TODO: Delete user.
    //From teacher:
    //const user = new User(); //TODO: Actual user
    //user.delete();



//Get user data -----------------------------------------------
USER_API.get('/all', async (req, res, next) => {

    // Tip: All the information you need to get the id part of the request can be found in the documentation 
    // https://expressjs.com/en/guide/routing.html (Route parameters)

    /// TODO: 
    // Return user object

    //const userId = req.params.id; // Getting user ID from request parameters

     // Finding a user in the users array by ID
    //let user = findUserById(userId);


    const { userID } = req.body;
    console.log("This is the current user:", userID);

    try {

        const user = new User(); 
        user.id = userID; 
        
        const getUsers = await dbm.listAllUsersFromDatabase();


    if (getUsers != null) {
        res.status(HTTPCodes.SuccesfullRespons.Ok).json({msg:"Here are all the users", getUsers});
    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.NotFound).json({msg: "Users is not found and may not exist"}).end(); //If user doesn't exist
    }
} catch (error) {
    console.error(error);
    res.status(HTTPCodes.ServerErrorRespons.InternalError).send("Failed to fetch users from database").end();
}
})




















export default USER_API