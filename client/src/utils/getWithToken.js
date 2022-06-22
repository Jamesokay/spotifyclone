export const getWithToken = async (url, token) => {
    try {
        const response = await fetch(url, {headers: {'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'}})
        if (!response.ok) {throw new Error(`An error has occured: ${response.status}`)}
        let res = await response.json()
        return res
    } catch (err) {console.error(err)} 
}