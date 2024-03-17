Create a New User
URL: /user/

Method: POST

Authentication required: NO

Data constraints:
{
    "userName": "[string]",
    "userEmail": "[valid email address]",
    "userPassword": "[string]"
}

Data example:
{
    "userName": "test",
    "userEmail": "test@test.no",
    "userPassword": "test"
}

Success Response:
Code: 200 OK

Content example:
{
    "message": "You successfully made a new user!"
}

Error Responses:
Code: 400 Bad Request

Content:
{
    "message": "A user with this email already exists"
}

Code: 400 Bad Request

Content:

{
    "message": "Missing data fields."
}

Code: 500 Internal Server Error
Content:
{
    "message": "Failed to create the user"
}


Login User
URL: /user/login

Method: POST

Authentication required: NO

Data constraints:
{
    "userEmail": "[valid email address]",
    "userPassword": "[string]"
}

Data example:
{
    "userEmail": "test@test.no",
    "userPassword": "test"
}

Success Response:
Code: 200 OK

Content example:
{
    "message": "User successfully authenticated.",
    "data": { "userInfo": { "user information object" }
    }
}

Error Responses:
Code: 401 Unauthorized

Content:
{
    "message": "Wrong user name or password!"
}

Code: 500 Internal Server Error
Content:
{
    "message": "Failed to log in."
}





Edit and Update User
URL: /user/

Method: PUT

Authentication required: YES

Data constraints:
{
    "userID": "[int]",
    "userName": "[string]",
    "userEmail": "[valid email address]",
    "userPassword": "[string]"
}

Data example:
{
    "userID": "40",
    "userName": "test",
    "userEmail": "test@test.no",
    "userPassword": "test"
}

Success Response:
Code: 200 OK

Content example:
{
    "message": "User updated successfully",
    "data": { "updatedUser": { "updated user object" } }
}

Error Responses:
Code: 400 Bad Request

Content:
{
    "message": "User not found or could not be updated"
}

Code: 500 Internal Server Error

Content:
{
    "message": "Failed to update user."
}

Delete User
URL: /user/delete

Method: DELETE

Authentication required: YES

Data constraints:
{
    "userID": "[string]"
}

Data example:
{
    "userID": "41"
}

Success Response:
Code: 200 OK

Content example:
{
    "message": "User deleted successfully"
}

Error Responses:
Code: 404 Not Found

Content:
{
    "message": "User is not found."
}

Code: 500 Internal Server Error

Content:
{
    "message": "Failed to delete user."
}
