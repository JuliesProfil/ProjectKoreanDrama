async function postData(url, data, okHandler, errorHandler) {
    try {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        const response = await fetch(url, requestOptions);
        const responseData = await handleResponse(response);
        okHandler(responseData);
    } catch (error) {
        errorHandler(error);
    }
}

async function putData(url, data, okHandler, errorHandler) {
    try {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        const response = await fetch(url, requestOptions);
        const responseData = await handleResponse(response);
        okHandler(responseData);
    } catch (error) {
        errorHandler(error);
    }
}

async function getData(url, okHandler, errorHandler) {
    try {
        const response = await fetch(url);
        const responseData = await handleResponse(response);
        okHandler(responseData);
    } catch (error) {
        errorHandler(error);
    }
}

async function deleteData(url, okHandler, errorHandler) {
    try {
        const requestOptions = {
            method: 'DELETE'
        };

        const response = await fetch(url, requestOptions);
        const responseData = await handleResponse(response);
        okHandler(responseData);
    } catch (error) {
        errorHandler(error);
    }
}


async function handleResponse(response) {
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    return response.json();
}


