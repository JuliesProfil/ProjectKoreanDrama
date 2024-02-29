import express, { response } from "express";
import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";

const USER_API = express.Router();
USER_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.

const users = [];






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





USER_API.get('/', (req, res, next) => {
    SuperLogger.log("Demo of logging tool");
    SuperLogger.log("A important msg", SuperLogger.LOGGING_LEVELS.CRTICAL);
})


//Get user data by ID-----------------------------------------------
USER_API.get('/:id', (req, res, next) => {

    // Tip: All the information you need to get the id part of the request can be found in the documentation 
    // https://expressjs.com/en/guide/routing.html (Route parameters)

    /// TODO: 
    // Return user object

    const userId = req.params.id; // Getting user ID from request parameters

     // Finding a user in the users array by ID
    let user = findUserById(userId);
    
    if (user) {
        res.json(user);
    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.NotFound).send("User is not found and may not exist").end(); //If user doesn't exist
    }
})



//Create a new user---------------------------------------------------
USER_API.post('/', (req, res, next) => {

    // This is using javascript object destructuring.
    // Recomend reading up https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#syntax
    // https://www.freecodecamp.org/news/javascript-object-destructuring-spread-operator-rest-parameter/
    
    const { name, email, password } = req.body;

    if (name != "" && email != "" && password != "") {

        //Create a new user
        const user = new User();
        user.name = name;
        user.email = email;

        ///TODO: Do not save passwords.
        user.pswHash = password;


        ///TODO: Does the user exist?
        let exists = findUserByEmail(email);

        if (!exists) {
            users.push(user);
            res.status(HTTPCodes.SuccesfullRespons.Ok).end();
        } else {
            res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("A user with this email already exists").end();
        }


    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();
    }

});





//Login user---------------------------------------------------
USER_API.post('/login', (req, res, next) => {
    
    const { email, password } = req.body;
    const user = findUserByEmail(email);

    if (user){
        if (user.password === password) {
            res.status(HTTPCodes.SuccessfulRespons.Ok).send("You are logged in!").end();
        } else {
            res.status(HTTPCodes.ClientSideErrorRespons.Unauthorized).send("Incorrect email or password!").end();
        }       
    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.Unauthorized).send("User not found!").end();
    }

});




//Edit and update user by ID-------------------------------------
USER_API.put('/:id', (req, res) => {
    const userId = req.params.id;
    /// TODO: Edit user
    // Code to update user based on ID
})


//Delete user by ID-------------------------------------
USER_API.delete('/:id', (req, res) => {
    const userId = req.params.id;
    /// TODO: Delete user.
     // Code to delete user based on ID
})

export default USER_API
