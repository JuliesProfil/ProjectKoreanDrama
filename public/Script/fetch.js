async function postData(url, data, okHandler, errorHandler) {
    try {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearear " + sessionStorage.getItem("loginData")
            },
            body: JSON.stringify(data)
        };

        const response = await fetch(url, requestOptions);
        const responseData = await handleResponse(response);
        okHandler(responseData);
    } catch (error) {
        errorHandler("Error in postData", error);
    }
}

async function putData(url, data, okHandler, errorHandler) {
    try {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearear " + sessionStorage.getItem("loginData")
                
            },
            body: JSON.stringify(data)
        };

        const response = await fetch(url, requestOptions);
        const responseData = await handleResponse(response);
        okHandler(responseData);
    } catch (error) {
        errorHandler("Error in putData", error);
    }
}

async function getData(url, okHandler, errorHandler) {
    try {
         const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization":"Bearear " + sessionStorage.getItem("loginData")
            }
        };

        const response = await fetch(url, requestOptions);
        const responseData = await handleResponse(response);
        okHandler(responseData);
    } catch (error) {
        errorHandler("Error in getData", error);
    }
}

async function deleteData(url, data, okHandler, errorHandler) {
    try {
        const requestOptions = {
            method: 'DELETE',

            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearear " + sessionStorage.getItem("loginData")
            },
            body: JSON.stringify(data)
        };

        const response = await fetch(url, requestOptions);
        const responseData = await handleResponse(response);
        okHandler(responseData);
    } catch (error) {
        errorHandler("Error in deleteData", error);
    }
}


async function handleResponse(response) {
    if (!response.ok) {
        throw new Error(`The error: ${response.status}`);
    }
    return response.json();
}