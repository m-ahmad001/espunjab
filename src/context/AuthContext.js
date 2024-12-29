// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'
import toast from 'react-hot-toast'
import supabase from 'src/configs/supabase'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  const initAuth = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    const userId = user?.id
    if (userId) {


      // await axios
      //   .get(authConfig.meEndpoint, {
      //     headers: {
      //       Authorization: storedToken
      //     }
      //   })
      const { data, error } = await supabase.from('users').select('*').eq('user_id', userId).single()
      setLoading(false)
      setUser({ ...data })
    } else {
      localStorage.removeItem('userData')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('accessToken')
      setUser(null)
      setLoading(false)

      // if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
      //   router.replace('/login')
      // }
    }
  }
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      debugger
      if (event == "PASSWORD_RECOVERY") {
        const newPassword = prompt("What would you like your new password to be?");

        const { data, error } = await supabase.auth
          .updateUser({ password: newPassword })

        if (data) alert("Password updated successfully!")
        if (error) alert("There was an error updating your password.")
      }
    })
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = async (params, errorCallback) => {
    // signin
    const { data: user, error } = await supabase.auth.signInWithPassword({
      email: params.email,
      password: params.password
    })
    if (error?.message) {
      console.log('🚀 ~ handleLogin ~ error:', error.message)

      return toast.error(error.message)
    }
    const { data: userDate, error: err } = await supabase.from('users').select().eq('user_id', user?.user?.id).single()
    if (err) {
      return toast.error(err.message)
    }

    params.rememberMe ? window.localStorage.setItem(authConfig.storageTokenKeyName, user?.session?.access_token) : null
    const returnUrl = router.query.returnUrl
    setUser({ ...userDate })
    params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(userDate)) : null
    const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
    router.replace(redirectURL)

    // axios
    //   .post(authConfig.loginEndpoint, params)
    //   .then(async response => {
    //     params.rememberMe
    //       ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
    //       : null
    //     const returnUrl = router.query.returnUrl
    //     setUser({ ...response.data.userData })
    //     params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.userData)) : null
    //     const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
    //     router.replace(redirectURL)
    //   })
    //   .catch(err => {
    //     if (errorCallback) errorCallback(err)
    //   })
  }

  const handleRegister = async (params, errorCallback) => {
    const { username, firstName, lastName, phoneNumber, role, email, password, user_id, ip, reffer_id } = params
    let refId = null
    if (reffer_id !== undefined && reffer_id !== null) {
      const { data: ref, error: refError } = await supabase
        .from('users')
        .select('id')
        .eq('username', reffer_id)
        .single()
      if (refError) {
        // Handle the error if needed
        console.error(refError.message)
      }
      refId = ref?.id
    }

    const { data, error } = await supabase
      .from('users')
      .insert({
        username,
        firstName,
        lastName,
        phoneNumber,
        role,
        email,
        password,
        user_id,
        ip,
        reffer_id: refId
      })
      .select()
      .single()
    if (error) {
      return toast.error(error.message)
    }

    // axios.post(authConfig.registerEndpoint, params)

    params?.rememberMe ? window.localStorage.setItem(authConfig.storageTokenKeyName, data?.session?.access_token) : null
    const returnUrl = router.query.returnUrl
    setUser({ ...data })
    params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(data)) : null
    const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
    router.replace(redirectURL)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    initAuth: initAuth
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
