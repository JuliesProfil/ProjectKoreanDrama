
export function authenticateLogin(req, res, next){
    let userData = req.headers.authorization.split(" ")[1];
    
        if(userData){
            userData = JSON.parse(userData);
            if(!userData || !userData.fduserid){
                res.status(HTTPCodes.ClientSideErrorRespons.Unauthorized).send({msg: "User not logged in. "}).end();
                return;
            }
        } 
        next();
    }
