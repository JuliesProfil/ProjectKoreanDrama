import { HTTPCodes } from "../modules/httpConstants.mjs";
import DBManager from "./storageManager.mjs";
const dbm = new DBManager();


class Series {

  constructor() {
    ///TODO: Are these the correct fields for your project?
    this.title = "";
    this.description = "";
    this.genre = "";
    this.episodeNumber = 0;
    this.releaseDate = 0;
    //this.coverImageURL;;
    this.id = null;
  }

/*
  async save() {
    try {
      if (this.id === null) {
        return await dbm.createUser(this);
      } else {
        return await dbm.updateUser(this);
      }
    } catch (error) {
      console.error("Error saving user:", error);
      return false; //it failed
    }
  }



  async delete() {
    try {
      return await dbm.deleteUser(this);
    } catch (error) {
      console.error("Error deleting user:", error);
      return false; //it failed
    }
  }
  */
}



export default Series;










/*
// This is a database test to simulate data from the server
const myDB = {
    seris: [
        {userId: 1, id: 1, name: "Death's game", rating: 5},
        {userId: 1, id: 2, name: "Vagabond", rating: 3},
        {userId: 2, id: 3, name: "Kingdom", rating: 6}

    ],

    getUserSeries: function(aUserId){
        const userSeries = [];
        for(let i = 0; i < this.seris.length; i++){
            if(this.seris[i].userId === aUserId){
                userSeries.push(this.seris[i]); 
            }
        };
        return userSeries;
    }
}


class Series {

    //Middleweare function for /series/ -> routes
    static listAll(req, res){
        //Gets user ID from url
        const userId = parseInt(req.params.id);

        //From database
        const dbSeries = myDB.getUserSeries(userId);
        const userSeries = [];
        dbSeries.forEach(element => {
            const newSeries = new Series();
            newSeries.name = element.name;
            newSeries.rating = element.rating;
            userSeries.push(newSeries);
        });

        const resStr = JSON.stringify(userSeries);
        res.status(HTTPCodes.SuccesfullRespons.Ok).send(resStr).end();
    }

    constructor() {
        //TODO: add series elements
        this.name = "";
        this.rating = 0;
    }


}


export default Series;

*/