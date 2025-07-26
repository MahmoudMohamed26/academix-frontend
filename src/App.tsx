import { Route, Routes } from "react-router"
import Login from "./website/Login"
import axios from "axios"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import PublicRoute from "./Auth/PublicRoutes"
import PrivateRoute from "./Auth/PrivateRoutes"
import Register from "./website/Register"

function App() {
  const { i18n } = useTranslation()

  useEffect(() => {
    axios.defaults.headers.common["x-language"] = i18n.resolvedLanguage
    axios.defaults.withCredentials = true
    axios.defaults.baseURL = import.meta.env.VITE_baseURL
    document.documentElement.dir = i18n.resolvedLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.resolvedLanguage!;
    window.localStorage.setItem('academixLanguage', i18n.resolvedLanguage!);
  }, [i18n.resolvedLanguage])

  return (
    <Routes>
      {/* Auth */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      {/* Auth */}

      {/* Dashboard */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Route>
      {/* Dashboard */}
    </Routes>
  )
}

export default App
