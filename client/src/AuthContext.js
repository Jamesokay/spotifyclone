import React, { useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = React.createContext()


function AuthProvider({ children }) {
  const code = new URLSearchParams(window.location.search).get("code")
  const [accessToken, setAccessToken] = useState()

  useEffect(() => {
    axios
      .post("/login", {code})
      .then(res => {
        setAccessToken(res.data.accessToken)
      })
      .catch(error => {
        console.log(error)
      })
  }, [code])

  return <AuthContext.Provider value={accessToken}>{children}</AuthContext.Provider>
}

export {AuthContext, AuthProvider}
