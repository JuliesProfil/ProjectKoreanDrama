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




const USER_API = express.Router();
USER_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.

const users = [];





/*
// Function to find a user by email
function findUserByEmail(email) {
    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        if (user.email === email) {
            return user;
        }
    }
}


// Function to finding a user in the users array by ID
function findUserById(userId) {
    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        if (user.id === userId) {
            return user;
        }
    }
}
*/



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
            


                //TODO: What happens if this fails? 
                user = await user.save(); 
                
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


    /*
    if (user) {
        if (user.password === password) {
            res.status(HTTPCodes.SuccessfulRespons.Ok).send("You are logged in!").end();
        } else {
            res.status(HTTPCodes.ClientSideErrorRespons.Unauthorized).send("Incorrect email or password!").end();
        }
    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.Unauthorized).send("User not found!").end();
    }
    */

});





//Edit and update user by ID-------------------------------------
USER_API.put('/:id', (req, res, next) => {    
        
    /// TODO: Edit user
    const user = new User(); //TODO: The user info comes as part of the request 
    user.save();
})





//Delete user by ID-------------------------------------
USER_API.delete('/:id',  (req, res) => {

// TODO: Delete user.
    
    const user = new User(); //TODO: Actual user
    user.delete();


})






//Get user data -----------------------------------------------
USER_API.get('/', (req, res, next) => {

    // Tip: All the information you need to get the id part of the request can be found in the documentation 
    // https://expressjs.com/en/guide/routing.html (Route parameters)

    /// TODO: 
    // Return user object

    const userId = req.params.id; // Getting user ID from request parameters

     // Finding a user in the users array by ID
    //let user = findUserById(userId);
    
})



















export default USER_API