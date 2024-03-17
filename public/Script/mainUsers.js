let divHeader = null;
let divContent = null;
let divFooter = null;

document.addEventListener("DOMContentLoaded", contentLoaded);

function contentLoaded() {
  sessionStorage.clear();
  //localStorage.clear();
  divContent = document.getElementById("divContent");

  const loginData = JSON.parse(sessionStorage.getItem('loginData'));

  if (loginData && loginData.fduserid) {
    showHomePage();
  } else {
    //showHomePage();
    showLogin();
  }
}


function createUser() {
  const createUsername = document.getElementById("createUsername");
  const createEmail = document.getElementById("createEmail");
  const createPassword = document.getElementById("createPassword");
  sha256(createPassword).then((pswHash) => {
    console.log(pswHash);

  const data = {
    userName: createUsername.value,
    userEmail: createEmail.value,
    userPassword: pswHash
  };

  postData("/user/", data,
    (res) => {
      console.log("Du er har laget en ny bruker!", res.data);
      sessionStorage.setItem('userInfo', JSON.stringify(res.data));
    
      showLogin();
    },
    (error) => {
      console.log(error, "Something went wrong!");

    });
  });
  return false;
}



function loginUser() {
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");
  sha256(loginPassword).then((pswHash) => {
  console.log(pswHash);

    //const isAdmin = (loginEmail === 'a@a.no' && loginPassword === 'a');

    const data = {
      userEmail: loginEmail.value,
      userPassword: pswHash
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
  });
  return false;

}



function logoutUser() {
  sessionStorage.removeItem('loginData');
  console.log("You are logged out!")

  /*
  document.getElementById('adminUserButtons').style.display = 'none';
  document.getElementById('regularUserButtons').style.display = 'none';
*/

  showHomePage();
  //showHomePage();
}





function updateUser() {
  const updateUserName = document.getElementById("updateUserName");
  const updateEmail = document.getElementById("updateEmail");
  const updatePassword = document.getElementById("updatePassword");
  const loginData = JSON.parse(sessionStorage.getItem('loginData'));
  
  sha256(updatePassword).then((pswHash) => {
    console.log(pswHash);

  const data = {
    userID: loginData.fduserid,
    userName: updateUserName.value,
    userEmail: updateEmail.value,
    userPassword: pswHash
  };


  console.log("User login update data:", loginData)

  //if (loginData && loginData.fduserid) {
    putData("/user/", data,
      (res) => {
        console.log(res);
        sessionStorage.setItem('loginData', JSON.stringify(res.data));
        console.log(res.data);
        alert("User updated successfully!");
        showLogin();
      },
      (error) => {
        console.error(error);
        alert("Failed to update user.");
        showLogin();
      }
    );
  //}
});
}





function deleteUser() {

  const loginData = JSON.parse(sessionStorage.getItem('loginData'));

  const data = {
    userID: parseInt(document.getElementById("deleteUserId").value)
  };

  console.log("User login delete data:", loginData)


  //if (loginData && loginData.fduserid) {
    deleteData("/user/delete", data,
      (res) => {
        console.log(res);
        sessionStorage.removeItem('loginData', JSON.stringify(res.data)); 
        alert("User deleted successfully!");
        showLogin(); 
      },
      (error) => {
        console.error(error);
        alert("Failed to delete user.");
      }
    );
  //}
}








async function userProfile() {

  const updateUserName = document.getElementById("updateUserName");
  const updateEmail = document.getElementById("updateEmail");
  const updatePassword = document.getElementById("updatePassword");
  const loginData = JSON.parse(sessionStorage.getItem('loginData'));
  sha256(updatePassword).then((pswHash) => {
    console.log(pswHash);

  const data = {
    userID: loginData.fduserid,
    userName: updateUserName.value,
    userEmail: updateEmail.value,
    userPassword: pswHash
  };

  console.log("User info:", loginData)

  if (loginData && loginData.fduserid) {
    showUserProfile();
  } else {
    showHomePage()
  }
})
}











async function listUsers() {

  const loginData = JSON.parse(sessionStorage.getItem('loginData'));

  const data = {
    userID: loginData.fduserid,
  };

  console.log("Your user info:", loginData)


  //if (loginData && loginData.fduserid) {
    getData("/user/adminGetAll",
      (res) => {
        console.log("Here is all the users: ", res, data); 


        showListUsers();
        showAllUsers(res);

      },
      (error) => {
        console.error(error);
      });
  //}

}


function showAllUsers(res) {
  const userListDiv = document.getElementById("listAllUsersContainer");
  userListDiv.innerHTML = ""; 

  for (let i = 0; i < res.getUsers.length; i++) {
    const user = res.getUsers[i];

    const userItem = document.createElement("div");
    userItem.innerHTML = `
    <ul>
        <b>This is user ${user.fduserid}</b>
        <li>Username: ${user.fdusername}</li>
        <li>Email: ${user.fdemail}</li>
    </ul>
`;
    userListDiv.appendChild(userItem);
  }

}




function showListUsers() {
  loadNewTemplate("tlListAllUsers", divContent, true);
}

function showHomePage() {
  loadNewTemplate("tlHomePage", divContent, true);
}


function showCreateUser() {
  loadNewTemplate("tlCreateUser", divContent, true);

  let loginUserLink = document.getElementById("loginUserLink");
  loginUserLink.addEventListener("click", showLogin);

  let createUserForm = document.getElementById("createUserForm");
  createUserForm.addEventListener("submit", function() {
      createUser();
  });
}


function showLogin() {
  loadNewTemplate("tlLogin", divContent, true);

  let createUserLink = document.getElementById("createUserLink");
  createUserLink.addEventListener("click", showCreateUser);

  let loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", function() {
      loginUser();
  });
}



function showUserProfile() {
  loadNewTemplate("tlUserProfile", divContent, true);

  let updateUserForm = document.getElementById("updateUserForm");
  updateUserForm.addEventListener("submit", function() {
      updateUser();
  });

  let deleteUserForm = document.getElementById("deleteUserForm");
  deleteUserForm.addEventListener("submit", function() {
      deleteUser();
  });

  showUpdateUser();
  showDeleteUser();

  const loginData = JSON.parse(sessionStorage.getItem('loginData'));

  if (loginData != null) {
    const listUserName = document.getElementById("listUserName");
    const listEmail = document.getElementById("listEmail");

    listUserName.innerText = loginData.fdusername;
    listEmail.innerText = loginData.fdemail;
  }
}



function showUpdateUser() {
  //loadNewTemplate("tlUpdateUser", divContent, true);

  const loginData = JSON.parse(sessionStorage.getItem('loginData'));
  console.log("LoginData update after:", loginData);


  if (loginData != null) {
    const updateUserName = document.getElementById("updateUserName");
    const updateEmail = document.getElementById("updateEmail");
    const loginData = JSON.parse(sessionStorage.getItem('loginData'));
    const updatePassword = document.getElementById("updatePassword");
    sha256(updatePassword).then((pswHash) => {
      console.log(pswHash);

    updateUserName.value = loginData.fdusername;
    updateEmail.value = loginData.fdemail;
    updatePassword.value = loginData.fdpassword;
  }
    )}
}


function showDeleteUser() {
  //loadNewTemplate("tlDeleteUser", divContent, true);

  const loginData = JSON.parse(sessionStorage.getItem('loginData'));
  console.log("LoginData delete after:", loginData);


  if (loginData != null) {
    const deleteUserId = document.getElementById("deleteUserId");

    const loginData = JSON.parse(sessionStorage.getItem('loginData'));

    deleteUserId.value = loginData.fduserid;

  }
}














