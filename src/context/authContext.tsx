import useAxios from "@/hooks/useAxios"
import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext<
  | {
      user: any
      isAuthenticated: boolean
      setUser: (user: any) => void
      authChecked: boolean
      setIsAuthenticated: (isAuthenticated: boolean) => void
      fetchData: () => Promise<void>
    }
  | undefined
>(undefined)

export const AuthProvider = ({ children }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [user, setUser] = useState([])
  const Axios = useAxios();
  const fetchData = async () => {
      try {
        setAuthChecked(false)
        const res = await Axios.get("/profile")
        setIsAuthenticated(true)
        setUser(res.data.data.user)
        console.log(res.data.data.user);
      } catch (err) {
        setIsAuthenticated(false)
      } finally {
        setAuthChecked(true)
      }
    }
  useEffect(() => {
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
        fetchData,
      }}
    >
      {authChecked && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)!

export { AuthContext }
