"user strict"

let divHeader = null;
let divContent = null;
let divFooter = null;

document.addEventListener("DOMContentLoaded", domLoaded);



function domLoaded() {
  localStorage.clear();
  divContent = document.getElementById("divContent");

  //legg in check (if) for token => om man har token trenger man ikkje å få opp denne login siden, då kan man heller få home 

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  console.log("User info:", userInfo )

  if (userInfo && userInfo.fdUserID) {
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

      // Store user info in localStorage
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      console.log("Created user Info:", res.data )
      //Ka må eg gjøre for at det skal fungere


      // Log all users created in localStorage
      //console.log("All users in localStorage:", JSON.parse(localStorage.getItem('userInfo')));


      showLogin();

    },
    (error) => {
      console.log(error, "Something went wrong!");

    }
  );

  return false;
}


function loginUser() {
  const loginEMail = document.getElementById("loginEMail");
  const loginPassword = document.getElementById("loginPassword");

  const data = {
    userEmail: loginEMail.value,
    userPassword: loginPassword.value
  };

  postData("/user/login", data,
    (res) => {
      sessionStorage.setItem('loginData', JSON.stringify(res.data));
      console.log("Login Info:", res.data )


      //Hugs meldinger om det går greit eller ikke

       // Shows welcome page after successfully logging in
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


  console.log("User login updeate data:", loginData )

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

console.log("User login delete data:", loginData )


if (loginData && loginData.fduserid) {
    // Makes a DELETE request to delete the user data
    deleteData("/user/delete", data,
        (res) => {
            console.log(res); // Log response data if needed
            sessionStorage.removeItem('loginData', JSON.stringify(res.data)); // Remove user info from localStorage
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








async function listUsers() {

}











function showHomePage() {
  loadNewTemplate("tlHome", divContent, true);
}


function showCreateUser(){
  loadNewTemplate("tlCreateUser", divContent, true);
}


function showLogin(){
  loadNewTemplate("tlLogin", divContent, true);
}



  function showUserProfile() {

  }

  function showSeries() {
 
  }

  
function showListUsers() {
  loadNewTemplate("tlListAllUsers", divContent, true);
}


function showUpdateUser() {
  loadNewTemplate("tlUpdateUser", divContent, true);

  // Get the current user's information from sessionStorage
  const loginData = JSON.parse(sessionStorage.getItem('loginData'));
  console.log("LoginData update after:", loginData);


  if (loginData) {
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
 
 
   if (loginData) {
     // Display the current user information
     const deleteUserId = document.getElementById("deleteUserId");
     
     const loginData = JSON.parse(sessionStorage.getItem('loginData'));
 
     deleteUserId.value = loginData.fduserid;
     
   }
}








