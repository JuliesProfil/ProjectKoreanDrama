import 'dotenv/config'
import express from 'express' 
import USER_API from './routes/usersRoute.mjs'; 
import DRAMAS_API from './routes/dramasRoute.mjs';

import SuperLogger from './modules/SuperLogger.mjs';

import printDeveloperStartupInportantInformationMSG from "./modules/developerHelpers.mjs";

printDeveloperStartupInportantInformationMSG();



// Creating an instance of the server
const server = express();
// Selecting a port for the server to use.
const port = (process.env.PORT || 8080);
server.set('port', port);



const logger = new SuperLogger();
server.use(logger.createAutoHTTPRequestLogger()); 


// Defining a folder that will contain static files.
server.use(express.static('public'));

// Telling the server to use the USER_API (all urls that uses this code will have to have the /user after the base address)
server.use("/user", USER_API);
server.use("/dramas", DRAMAS_API);



// Start the server 
server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});
