import axios from "axios"
import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext<
  | {
      user: any
      isAuthenticated: boolean
      setUser: (user: any) => void
      authChecked: boolean
      setIsAuthenticated: (isAuthenticated: boolean) => void
    }
  | undefined
>(undefined)

export const AuthProvider = ({ children }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [user, setUser] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/auth/me")
        setIsAuthenticated(true)
        setUser(res.data)
        console.log(res.data);
      } catch (err) {
        setIsAuthenticated(false)
      } finally {
        setAuthChecked(true)
      }
    }
    fetchData()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setUser,
        authChecked,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)!

export { AuthContext }
