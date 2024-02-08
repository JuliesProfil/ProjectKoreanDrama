import { HTTPCodes } from "../modules/httpConstants.mjs";


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