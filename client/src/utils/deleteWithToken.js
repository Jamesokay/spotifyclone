export const deleteWithToken = async (url, token) => {
    try {
        const response = await fetch(url, 
            {
                method: 'DELETE', 
                headers: {'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'}
            })
        if (!response.ok) {throw new Error(`An error has occured: ${response.status}`)}
        return response
    } catch (err) {console.error(err)} 
}