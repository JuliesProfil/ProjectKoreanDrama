import pg from "pg";
import SuperLogger from "./SuperLogger.mjs";

//-----------
import dotenv from "dotenv";
dotenv.config();

//-----------



/// TODO: is the structure / design of the DBManager as good as it could be?

class DBManager {

    #credentials = {};

    constructor() {
        this.#credentials = {
            connectionString,
            ssl: (process.env.DB_SSL === "true") ? process.env.DB_SSL : false
        };

    }

    


    async createUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('INSERT INTO tblUsers(fdUsername, fdEmail, fdPassword) VALUES($1::Text, $2::Text, $3::Text) RETURNING fdUserID;', [user.name, user.email, user.pswHash]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            if (output.rows.length == 1) {
                // We stored the user in the DB.
                user.id = output.rows[0].fduserid;
            }

        } catch (error) {
            console.error(error);
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return user;

    }




    async updateUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Update tblUsers set fdUserName = $1, fdEmail = $2, fdPassword = $3 where fdUserID = $4;', [user.name, user.email, user.pswHash, user.id]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            //TODO Did we update the user?

            // Check if exactly one row was updated
        if (output.rows.length === 1) {
            // User was successfully updated
            const updatedUser = output.rows[0];
            return updatedUser;

        } else {
            // No rows were updated 
            console.log('User not updated');
        }


        } catch (error) {
            //TODO : Error handling?? Remember that this is a module seperate from your server 
            console.error(error);
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return user;

    }



    async deleteUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Delete from tblUsers  where fdUserID = $1;', [user.id]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            //TODO: Did the user get deleted?
            // hva er dette når brukeren blir slettet?
            if (output.rows.length === 1) {
                // User was successfully deleted
                return true;
                //Hvordan får eg en massage ut her?????

            } else {
                // No rows were affected, user might not exist
                return false;
                //blir false her!!!
            }

        } catch (error) {
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return user;
    }



    

    /// Gets User and Email so someone can login -----------
    async getUserFromPasswordAndEmail(email, password) {
        const sql = 'SELECT * FROM tblUsers WHERE fdEmail = $1 AND fdPassword = $2';
        const params = [email, password];
        
        const client = new pg.Client(this.#credentials);
        
        try {
            await client.connect();
            const rows = (await client.query(sql, params)).rows;
            
            if (rows && rows.length === 1) {
                return rows[0];
            } else {
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        } finally {
            client.end();
        }
    }
    /// Gets User and Email-----------


     /// Gets Email so someone can check for already existing -----------
     async getUserFromEmail(email) {
        const sql = 'SELECT * FROM tblUsers WHERE fdEmail = $1';
        const params = [email];
        
        const client = new pg.Client(this.#credentials);
        
        try {
            await client.connect();
            const rows = (await client.query(sql, params)).rows;
            
            if (rows && rows.length === 1) {
                return rows[0];
            } else {
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        } finally {
            client.end();
        }
    }
    /// Gets Email-----------


      // List all users-----------
      async listAllUsersFromDatabase() {
        const sql = 'SELECT * FROM tblUsers';
        
        const client = new pg.Client(this.#credentials);
        
        try {
            await client.connect();
            const rows = (await client.query(sql)).rows;
            
            return rows;

        } catch (error) {
            console.error(error);
            return null;
        } finally {
            client.end();
        }
    }




}







    








// The following is thre examples of how to get the db connection string from the enviorment variables.
// They accomplish the same thing but in different ways.
// It is a judgment call which one is the best. But go for the one you understand the best.

// 1:
//let connectionString = process.env.ENVIORMENT == "local" ? process.env.DB_CONNECTIONSTRING_LOCAL : process.env.DB_CONNECTIONSTRING_PROD;

// 2:
let connectionString = process.env.DB_CONNECTIONSTRING_LOCAL;
if (process.env.ENVIORMENT != "local") {
    connectionString = process.env.DB_CONNECTIONSTRING_PROD;
}

//3: 
//connectionString = process.env["DB_CONNECTIONSTRING_" + process.env.ENVIORMENT.toUpperCase()];


// We are using an enviorment variable to get the db credentials 
if (connectionString == undefined) {
    throw ("You forgot the db connection string");
}



//export default new DBManager(connectionString); //Trenge eg den eller går den under??

export default DBManager;