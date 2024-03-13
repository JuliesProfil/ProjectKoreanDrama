"user strict"



let divHeader = null;
let divContent = null;
let divFooter = null;

document.addEventListener("DOMContentLoaded", domLoaded);



function domLoaded() {
  sessionStorage.clear();
  //localStorage.clear();
  divContent = document.getElementById("divContent");

  //legg in check (if) for token => om man har token trenger man ikkje å få opp denne login siden, då kan man heller få home 


  const loginData = JSON.parse(sessionStorage.getItem('loginData'));
  console.log("Login Info:", loginData)




  if (loginData && loginData.fduserid) {
    showHomePage();


  } else {
    //showHomePage();
    showLogin(); //Denne siden kan heller komme opp når man trenger å være logget inn, skjekker token/autoriasasjon
  }



}






function createUser() {
  const createUsername = document.getElementById("createUsername");
  const createEmail = document.getElementById("createEmail");
  const createPassword = document.getElementById("createPassword");

  const data = {
    userEmail: createEmail.value,
    userPassword: createPassword.value,
    userName: createUsername.value,
  };

  postData("/user/", data,
    (res) => {
      // ny er nå laget
      // Vis login template
      console.log("Du er har laget en ny bruker!", res.data);

      // Store user info in sessionStorage
      sessionStorage.setItem('userInfo', JSON.stringify(res.data));
      console.log("Created user Info:", res.data)
      //Ka må eg gjøre for at det skal fungere


    

      showLogin();

    },
    (error) => {
      console.log(error, "Something went wrong!");

    });

  return false;
}





function loginUser() {
  const loginEmail = document.getElementById("loginEMail");
  const loginPassword = document.getElementById("loginPassword");

  //const isAdmin = (loginEmail === 'a@a.no' && loginPassword === 'a');

  const data = {
    userEmail: loginEmail.value,
    userPassword: loginPassword.value,
  };

  postData("/user/login", data,
    (res) => {
      
      const loginData = res.data;
      /*
      if (isAdmin) {
        console.log("Hey");
        loginData.userType = 'admin';
      } else {
        console.log("Ney");
        loginData.userType = 'regular';
      }
      */

      sessionStorage.setItem('loginData', JSON.stringify(loginData));
      console.log("Login Info:", loginData);


      /*
      // Shows or hides buttons based on user type
      if (isAdmin) {
        document.getElementById('adminUserButtons').style.display = 'block';
        document.getElementById('regularUserButtons').style.display = 'none';
      } else {
        document.getElementById('adminUserButtons').style.display = 'none';
        document.getElementById('regularUserButtons').style.display = 'block';
      }
      */


      showHomePage();
    },
    (error) => {
      console.log(error);
      alert("Login failed.");
    }
  );

  return false;
}



function logoutUser() {
  // Clear session storage
  sessionStorage.removeItem('loginData');
  console.log("You are logged out!")

  /*
  // Reset the display of buttons to their initial state
  document.getElementById('adminUserButtons').style.display = 'none';
  document.getElementById('regularUserButtons').style.display = 'none';
*/

  showLogin();
  //showHomePage();
}





function updateUser() {
  const updateUserName = document.getElementById("updateUserName");
  const updateEmail = document.getElementById("updateEmail");
  const updatePassword = document.getElementById("updatePassword");
  const loginData = JSON.parse(sessionStorage.getItem('loginData'));

  const data = {
    userID: loginData.fduserid,
    userName: updateUserName.value,
    userEmail: updateEmail.value,
    userPassword: updatePassword.value
  };


  console.log("User login updeate data:", loginData)

  if (loginData && loginData.fduserid) {
    // Make a PUT request to update the user data
    putData("/user/", data,
      (res) => {
        console.log(res);
        sessionStorage.setItem('loginData', JSON.stringify(res.data));
        console.log(res.data);
        alert("User updated successfully!");
        showHomePage();
      },
      (error) => {
        console.error(error);
        alert("Failed to update user.");
      }
    );
  }
}





function deleteUser() {

  const loginData = JSON.parse(sessionStorage.getItem('loginData'));

  const data = {
    userID: loginData.fduserid,
  };

  console.log("User login delete data:", loginData)


  if (loginData && loginData.fduserid) {
    // Makes a DELETE request to delete the user data
    deleteData("/user/delete", data,
      (res) => {
        console.log(res); // Log response data if needed
        sessionStorage.removeItem('loginData', JSON.stringify(res.data)); // Remove user info from sessionStorage
        alert("User deleted successfully!");
        showHomePage(); // Redirect to home page after deletion
      },
      (error) => {
        console.error(error);
        alert("Failed to delete user.");
      }
    );
  }
}








async function userProfile() {

  const updateUserName = document.getElementById("updateUserName");
  const updateEmail = document.getElementById("updateEmail");
  const updatePassword = document.getElementById("updatePassword");
  const loginData = JSON.parse(sessionStorage.getItem('loginData'));

  const data = {
    userID: loginData.fduserid,
    userName: updateUserName.value,
    userEmail: updateEmail.value,
    userPassword: updatePassword.value
  };

  console.log("User info:", loginData)

  if (loginData && loginData.fduserid) {
    showUserProfile();
  } else {
    showHomePage()
  }
}











async function listUsers() {

  const loginData = JSON.parse(sessionStorage.getItem('loginData'));

  const data = {
    userID: loginData.fduserid,
  };

  console.log("Your user info:", loginData)


  if (loginData && loginData.fduserid) {
    // Makes a GET request to get the user data
    getData("/user/all",
      (res) => {
        console.log("Here is all the users: ", res); // Log response
        console.log("User: ", res.getUsers[0]);

        showListUsers();
        displayUsers(res);
       
      },
      (error) => {
        console.error(error);
      });
  }

}


function displayUsers(res) {
  // Process the series data and generate HTML content
  const userListDiv = document.getElementById("listAllUsersContainer");
  //userListDiv.innerHTML = ""; // Clear existing content

  for (let i = 0; i < res.getUsers.length; i++) {
    const user = res.getUsers[i];

    // Create a div element for each drama
    const userItem = document.createElement("div");
    userItem.innerHTML = `<p> ${user.fdusername}</p>` + " - " + `<p> ${user.fdemail}</p>`;
    userListDiv.appendChild(userItem);
  }
  
} 






function showListUsers() {
  loadNewTemplate("tlListAllUsers", divContent, true);
}




function showHomePage() {
  loadNewTemplate("tlHome", divContent, true);
}


function showCreateUser() {
  loadNewTemplate("tlCreateUser", divContent, true);
}


function showLogin() {
  loadNewTemplate("tlLogin", divContent, true);
}






function showUserProfile() {
  loadNewTemplate("tlListUser", divContent, true);

  // Get the user's information from sessionStorage
  const loginData = JSON.parse(sessionStorage.getItem('loginData'));

  if (loginData != null) {
    //Show the user information
    const listUserName = document.getElementById("listUserName");
    const listEmail = document.getElementById("listEmail");
    const listPassword = document.getElementById("listPassword");

    listUserName.innerText = loginData.fdusername;
    listEmail.innerText = loginData.fdemail;
    listPassword.innerText = loginData.fdpassword;

  }
}



function showUpdateUser() {
  loadNewTemplate("tlUpdateUser", divContent, true);

  // Get the current user's information from sessionStorage
  const loginData = JSON.parse(sessionStorage.getItem('loginData'));
  console.log("LoginData update after:", loginData);


  if (loginData != null) {
    // Display the current user information
    const updateUserName = document.getElementById("updateUserName");
    const updateEmail = document.getElementById("updateEmail");
    const updatePassword = document.getElementById("updatePassword");
    const loginData = JSON.parse(sessionStorage.getItem('loginData'));

    updateUserName.value = loginData.fdusername;
    updateEmail.value = loginData.fdemail;
    updatePassword.value = loginData.fdpassword;
  }
}


function showDeleteUser() {
  loadNewTemplate("tlDeleteUser", divContent, true);

  // Get the current user's information from sessionStorage
  const loginData = JSON.parse(sessionStorage.getItem('loginData'));
  console.log("LoginData delete after:", loginData);


  if (loginData != null) {
    // Display the current user information
    const deleteUserId = document.getElementById("deleteUserId");

    const loginData = JSON.parse(sessionStorage.getItem('loginData'));

    deleteUserId.value = loginData.fduserid;

  }
}