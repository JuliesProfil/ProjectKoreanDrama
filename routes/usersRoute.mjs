import express, { response } from "express";
import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import { authenticateLogin } from "../modules/userMiddleware.mjs";

//import DBManager from "../modules/storageManager.mjs";
//import connectionString from "../modules/storageManager.mjs";
//let DBManager = new DBManager();
//let DBManager = new DBManager(connectionString);

import DBManager from "../modules/storageManager.mjs";

//let DBManager = new DBManager();

const USER_API = express.Router();
USER_API.use(express.json()); 


USER_API.get('/', (req, res, next) => {
    SuperLogger.log("Demo of logging tool");
    SuperLogger.log("A important message", SuperLogger.LOGGING_LEVELS.CRTICAL);
})


//Create a new user---------------------------------------------------
USER_API.post('/', async (req, res, next) => {

    const { userName, userEmail, userPassword } = req.body;

        try {
            if (userName != "" && userEmail != "" && userPassword != "") {
            console.log(`userEmail = ${userEmail}`);
            let exists = await DBManager.getUserFromEmail(userEmail);

            if (!exists) {
                console.log("User does not exist!")
                let user = new User();
                user.name = userName;
                user.email = userEmail;
                user.pswHash = userPassword;
                user = await user.save(); 
               
                res.status(HTTPCodes.SuccesfullRespons.Ok).json({message:"You sucsessfully made a new user!"}).end();
            } else {
                res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).json({message: "A user with this email already exists"}).end();
            }
        } else {
            res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).json({message: "Missing data fieleds."}).end();
        }

        } catch (error) {
            console.error(error);
            res.status(HTTPCodes.ServerErrorRespons.InternalError).json({message: "Failed to create the user"}).end();
        }
});




//Login user---------------------------------------------------
USER_API.post('/login', async (req, res, next) => {

    const { userEmail, userPassword } = req.body;
 
    try {
        console.log(`Email = ${userEmail}`, `Password = ${userPassword}`);
        const userInfo = await DBManager.getUserFromPasswordAndEmail(userEmail, userPassword);

        if(userInfo){
            res.status(HTTPCodes.SuccesfullRespons.Ok).json({message: "User succsessfully authenticated.", data: userInfo}).end();
          }else{
            res.status(HTTPCodes.ClientSideErrorRespons.Unauthorized).json({message: "Wrong user name or password!"}).end();
          }
        } catch (error) {
            console.error(error);
            res.status(HTTPCodes.ServerErrorRespons.InternalError).json({message: "Failed to log in."}).end();  
        }
});





//Edit and update user -------------------------------------
USER_API.put('/', authenticateLogin, async (req, res, next) => {

    const { userID, userName, userEmail, userPassword } = req.body;

    try {
        const user = new User(); 
        user.id = userID; 
        user.name = userName;
        user.email = userEmail;
        user.pswHash = userPassword;

        const updatedUser = await user.save();

        if (updatedUser) {
            res.status(HTTPCodes.SuccesfullRespons.Ok).json({message: "User updated successfully", data: updatedUser}).end();
        } else {
            res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).json({message: "User not found or could not be updated"}).end();
        }
    } catch (error) {
        console.error(error);
        res.status(HTTPCodes.ServerErrorRespons.InternalError).json({message: "Failed to update user."}).end();
    }
})







//Delete user -------------------------------------
USER_API.delete('/delete', authenticateLogin,  async (req, res, next) => {

    const { userID } = req.body;
    console.log("This is the current user:", userID);
    
    try {
        const user = new User(); 
        user.id = userID; 
        const deletedUser = await user.delete(userID); 
       
        if (deletedUser) {
            res.status(HTTPCodes.SuccesfullRespons.Ok).json( {message: "User deleted successfully"} ).end();
        } else {
            res.status(HTTPCodes.ClientSideErrorRespons.NotFound).json({message: "User is not found."}).end();
        }
    } catch (error) {
        console.error(error);
        res.status(HTTPCodes.ServerErrorRespons.InternalError).json({message:"Failed to delete user."}).end();
    }
})

    



//Admin - List all users
USER_API.get('/adminGetAll', authenticateLogin, async (req, res) => {

    const { userID } = req.body;
    console.log("This is the current user:", userID);

    try {
        const user = new User(); 
        user.id = userID; 
        
        const getUsers = await DBManager.listAllUsersFromDatabase();

    if (getUsers != null) {
        res.status(HTTPCodes.SuccesfullRespons.Ok).json({message:"Users succsessfully listed. Here are all the users: ", data: getUsers});
    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.NotFound).json({message: "Users are not found."}).end(); 
    }
} catch (error) {
    console.error(error);
    res.status(HTTPCodes.ServerErrorRespons.InternalError).json("Failed to list all users.").end();
}
})




export default USER_API