export const putWithToken = async (url, token, reqBody) => {
    try {
        const response = await fetch(url, 
            {
                method: 'PUT', 
                headers: {'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'},
                body: reqBody? JSON.stringify(reqBody) : {}
            })
        if (!response.ok) {throw new Error(`An error has occured: ${response.status}`)}
        return response
    } catch (err) {console.error(err)} 
}