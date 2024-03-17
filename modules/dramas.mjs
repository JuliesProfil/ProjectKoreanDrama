import { HTTPCodes } from "./httpConstants.mjs";
import DBManager from "./storageManager.mjs";
const dbm = new DBManager();


class Dramas {

  constructor() {
    ///TODO: Are these the correct fields for your project?
    this.title = "";
    this.description = "";
    this.genre = "";
    this.episodeNumber = 0;
    this.releaseDate = 0;
    this.coverImageURL;;
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



export default Dramas;