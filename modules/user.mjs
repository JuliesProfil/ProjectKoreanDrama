import DBManager from "./storageManager.mjs";

const dbm = new DBManager();


class User {

  constructor() {
    ///TODO: Are these the correct fields for your project?
    this.email;
    this.pswHash;
    this.name;
    this.id = null ;
  }


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
}



export default User;

















/*  
// If you dont want to use class, this is one alternative

const User = function () {
  return {
    email: "",
    pswHash: "",
    name: "",
    id: null,
    save: Save,
  };

  function Save() {
    console.log(this.name);
  }
};

}*/






/// TODO: What happens if the DBManager fails to complete its task?

    // We know that if a user object dos not have the ID, then it cant be in the DB.

  /*
    if (this.id == null) {
      return await dbm.createUser(this);
    } else {
      return await dbm.updateUser(this);
    }
  }



   async delete() {

    /// TODO: What happens if the DBManager fails to complete its task?
    dbm.deleteUser(this);
  }
}

  */