import express, { response } from "express";
import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import { authenticateLogin } from "../modules/userMiddleware.mjs";

import DBManager from "../modules/storageManager.mjs";

const dbm = new DBManager();


const USER_API = express.Router();
USER_API.use(express.json()); 


USER_API.get('/', (req, res, next) => {
    SuperLogger.log("Demo of logging tool");
    SuperLogger.log("A important msg", SuperLogger.LOGGING_LEVELS.CRTICAL);
})


//Create a new user---------------------------------------------------
USER_API.post('/', async (req, res, next) => {

    const { userName, userEmail, userPassword } = req.body;

    if (userName != "" && userEmail != "" && userPassword != "") {

        try {
            console.log(`userEmail = ${userEmail}`);
            let exists = await dbm.getUserFromEmail(userEmail);


            if (!exists) {
                console.log("User does not exist!")
            let user = new User();
            user.name = userName;
            user.email = userEmail;
            user.pswHash = userPassword;
            
                user = await user.save(); 
               

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
            res.status(HTTPCodes.ServerErrorRespons.InternalError).send({msg: "An error occurred while creating the user"}).end();  
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

        res.status(HTTPCodes.SuccesfullRespons.Ok).send(updatedUser).end();
    } catch (error) {
        console.error(error);
        res.status(HTTPCodes.ServerErrorRespons.InternalError).send({msg: "Failed to update user"}).end();
    }
})







//Delete user -------------------------------------
USER_API.delete('/delete',  async (req, res) => {

    const { userID } = req.body;
    console.log("This is the current user:", userID);
    
    let userData = req.headers.authorization.split(" ")[1];
    
    if(userData){
        userData = JSON.parse(userData);
        if(!userData || !userData.fduserid){
            res.status(HTTPCodes.ClientSideErrorRespons.Unauthorized).send({msg: "User not logged in. "}).end();
            return;
        }
    } 

    try {
        const user = new User(); 
        user.id = userID; 
        const deletedUser = await user.delete(userID); 
       

        if (deletedUser) {
            res.status(HTTPCodes.SuccesfullRespons.Ok).json( {message: "User deleted successfully"} ).end();

        } else {
            res.status(HTTPCodes.ClientSideErrorRespons.NotFound).json({msg:"User not found or could not be deleted"}).end();
        }
    } catch (error) {
        console.error(error);
        res.status(HTTPCodes.ServerErrorRespons.InternalError).send({msg:"Failed to delete user"}).end();
    }
})

    



//Admin - Get user data -----------------------------------------------
USER_API.get('/adminGetAll', authenticateLogin, async (req, res, next) => {

    const { userID } = req.body;
    console.log("This is the current user:", userID);

    try {

        const user = new User(); 
        user.id = userID; 
        
        const getUsers = await dbm.listAllUsersFromDatabase();


    if (getUsers != null) {
        res.status(HTTPCodes.SuccesfullRespons.Ok).json({msg:"Here are all the users", getUsers});
    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.NotFound).json({msg: "Users is not found and may not exist"}).end(); 
    }
} catch (error) {
    console.error(error);
    res.status(HTTPCodes.ServerErrorRespons.InternalError).send("Failed to find users from database").end();
}
})









export default USER_API