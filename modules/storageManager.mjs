import pg from "pg";
import SuperLogger from "./SuperLogger.mjs";
import User from "./user.mjs";

import dotenv from "dotenv";
dotenv.config();


    if (process.env.DB_CONNECTIONSTRING == undefined) {
        throw ("You forgot the db connection string");
    }
let connectionString = process.env.DB_CONNECTIONSTRING_LOCAL;
if (process.env.ENVIORMENT != "local") {
    connectionString = process.env.DB_CONNECTIONSTRING_PROD;
}



class DBManager {

    #credentials = {};
    constructor(connectionString) {
    //constructor() {
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

            if (output.rows.length == 1) {
                user.id = output.rows[0].id;
                console.log("User created successfully");
            } else {
                console.log("User not created");
            }

        } catch (error) {
            console.error(error);
        } finally {
            client.end(); 
        }
        return user;
    }




    async updateUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('UPDATE tblUser SET fdUserName = $1, fdEmail = $2, fdPassword = $3 WHERE fdUserID = $4;', [user.name, user.email, user.pswHash, user.id]);

        if (output.rowCount == 1) {
            user.id = output.rows[0];
            console.log("User updated successfully");
        } else {
            console.log("User not updated");
        }
        } catch (error) {
            console.error(error);
        } finally {
            client.end(); 
        }
        return user;
    }



    async deleteUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();

            let output = await client.query('DELETE FROM tblUserDramaList  WHERE fdUserID = $1;', [user.id]);

            output = await client.query('DELETE FROM tblUser  WHERE fdUserID = $1;', [user.id]);
            
            if (output.rowCount === 1) {
                console.log("User deleted successfully");
                return true;
            } else {
                console.log("User not deleted");
                return false;
            }
        } catch (error) {
            console.error(error);
        } finally {
            client.end();
        }
        return user;
    }



    
    
    async getUserFromPasswordAndEmail(email, password) {
        const sql = 'SELECT * FROM tblUser WHERE fdEmail = $1 AND fdPassword = $2';
        const params = [email, password];
        
        const client = new pg.Client(this.#credentials);
        
        try {
            await client.connect();
            const rows = (await client.query(sql, params)).rows;
            
            if (rows && rows.length === 1) {
                console.log("User found.");
                return rows[0];
            } else {
                console.log("User not found.");
                return null;
            }
        } catch (error) {
            console.error(error);
        } finally {
            client.end();
        }
    }



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


    
      async listAllUsersFromDatabase() {
        const sql = 'SELECT * FROM tblUser';
        
        const client = new pg.Client(this.#credentials);
        
        try {
            await client.connect();
            const rows = (await client.query(sql)).rows;
            console.log("Successful.");
            return rows;

        } catch (error) {
            console.error(error);
        } finally {
            client.end();
        }
    }


    async listAllDramasFromDatabase() {
        const sql = 'SELECT * FROM tblDrama';
        
        const client = new pg.Client(this.#credentials);
        
        try {
            await client.connect();
            const rows = (await client.query(sql)).rows;
            console.log("Successful.");
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
                'INSERT INTO tblDrama(fdTitle, fdDescription, fdGenre, fdEpisodeNumber, fdReleaseDate, fdCoverImageURL) VALUES($1, $2, $3, $4, $5, $6) RETURNING *;',
                [drama.fdTitle, drama.fdDescription, drama.fdGenre, drama.fdEpisodeNumber, drama.fdReleaseDate, drama.fdCoverImageURL]
            );
            
    
            if (output.rows.length > 0) {
                drama.fddramaid  = output.rows[0].fddramaid;
                console.log("It posted")
            } else {
                console.log("It did not post.")
                return null;
            }
        } catch (error) {
            console.error(error);
        } finally {
            client.end();
        }
        return drama;
    }
    


    //To post multiple dramas
    async postMultipleDramas(dramaData) {
        const insertedDramas = [];

        try {
            for (let i = 0; i < dramaData.length; i++) {
                const drama = await this.postSingleDrama(dramaData[i]);
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
    
            if (output.rows.length === 1) {
                review.id = output.rows[0].fdUserDramaListID;
                console.log("The review was created.")
                return review;
            } else {
                console.log("The review failed.")
            }
        } catch (error) {
            console.error( error);
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


//let dbm = new DBManager(connectionString);

//export default new DBManager(connectionString); 
export default new DBManager(connectionString); 
//export default DBManager;
//export default connectionString;