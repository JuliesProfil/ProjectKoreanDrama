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
            const output = await client.query('INSERT INTO tblUser(fdUsername, fdEmail, fdPassword) VALUES($1::Text, $2::Text, $3::Text) RETURNING fdUserID;', [user.name, user.email, user.pswHash]);

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
            const output = await client.query('Update tblUser set fdUserName = $1, fdEmail = $2, fdPassword = $3 where fdUserID = $4;', [user.name, user.email, user.pswHash, user.id]);

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
            const output = await client.query('Delete from tblUser  where fdUserID = $1;', [user.id]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            //TODO: Did the user get deleted?
            // hva er dette når brukeren blir slettet?
            if (output.rowCount === 1) {
                // User was successfully deleted
                return true;
                //Hvordan får eg en massage ut her?????
            } else {
                return false;
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
        const sql = 'SELECT * FROM tblUser WHERE fdEmail = $1 AND fdPassword = $2';
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
        const sql = 'SELECT * FROM tblUser WHERE fdEmail = $1';
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
        } finally {
            client.end();
        }
    }
    /// Gets Email-----------


    
      // List all users-----------
      async listAllUsersFromDatabase() {
        const sql = 'SELECT * FROM tblUser';
        
        const client = new pg.Client(this.#credentials);
        
        try {
            await client.connect();
            const rows = (await client.query(sql)).rows;
            
            return rows;

        } catch (error) {
            console.error(error);
        } finally {
            client.end();
        }
    }


    async listAllSeriesFromDatabase() {
        const sql = 'SELECT * FROM tblDramas';
        
        const client = new pg.Client(this.#credentials);
        
        try {
            await client.connect();
            const rows = (await client.query(sql)).rows;
            
            return rows;

        } catch (error) {
            console.error(error);
        } finally {
            client.end();
        }
    }



    
    async postSingleDrama(drama) {
        const client = new pg.Client(this.#credentials);
    
        try {
            await client.connect();
           
            const output = await client.query(
                'INSERT INTO tblDramas(fdTitle, fdDescription, fdGenre, fdEpisodeNumber, fdReleaseDate, fdRating, fdReview, fdCoverImageURL) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;',
                [drama.fdTitle, drama.fdDescription, drama.fdGenre, drama.fdEpisodeNumber, drama.fdReleaseDate, drama.fdRating, drama.fdReview, drama.fdCoverImageURL]
            );
            
    
            if (output.rows.length == 1) {
                // We stored the drama in the DB.
                drama.fdDramaID  = output.rows[0].fdDramaID;
                return drama;
            } else {
                return null;
            }
        } catch (error) {
            console.error(error);
        } finally {
            client.end();
        }
    }
    





    //To post multiple dramas
    async postMultipleDramas(dramasData) {
        const insertedDramas = [];

        try {
            for (let i = 0; i < dramasData.length; i++) {
                const drama = await this.postSingleDrama(dramasData[i]);
                insertedDramas.push(drama);
            }
        } catch (error) {
            console.error(error);
        }

        return insertedDramas;
    }
    




    async createReview(review) {
        const client = new pg.Client(this.#credentials);
    
        try {
            await client.connect();
            const output = await client.query(`
                INSERT INTO tblUserDramaList (fdUserID, fdDramaID, fdRating, fdReview, fdIsFavorite)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING fdUserDramaListID;
            `, [review.userId, review.dramaId, review.rating, review.comment, review.isFavorite]);
    
            // If the review was successfully inserted, it updates the review object with its ID
            if (output.rows.length === 1) {
                review.id = output.rows[0].fdUserDramaListID;
                return review;
            } else {
                throw new Error("Failed to insert review into database.");
            }
        } catch (error) {
            console.error("Error creating review:", error);
            throw error;
        } finally {
            client.end();
        }
    }



    async listAllReviewsFromDatabase() {
        const sql = 'SELECT * FROM tblUserDramaList';
        
        const client = new pg.Client(this.#credentials);
        
        try {
            await client.connect();
            const rows = (await client.query(sql)).rows;
            
            return rows;

        } catch (error) {
            console.error(error);
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