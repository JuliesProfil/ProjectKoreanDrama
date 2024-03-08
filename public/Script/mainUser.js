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
      console.log("hva er feil?", res.data);

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
    
}





function deleteUser() {

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

}


function showDeleteUser() {
  loadNewTemplate("tlDeleteUser", divContent, true);

}








