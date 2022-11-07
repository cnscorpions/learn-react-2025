import React, { useState, useEffect, useContext, createContext } from 'react'
import firebase from './firebase'
import { createUser } from './db'
import Router from 'next/router'

const authContext = createContext()

function useProvideAuth() {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleUser = (rawUser) => {
    if (rawUser) {
      const user = formatUser(rawUser)

      createUser(user.uid, user)

      setLoading(false)
      setUser(user)
      return user
    } else {
      setLoading(false)
      setUser(false)
      return false
    }
  }

  const signinWithGitHub = () => {
    setLoading(true)
    return firebase
           .auth()
           .signInWithPopup(new firebase.auth.GithubAuthProvider())
           .then(res => handleUser(res.user))
  }

  const signinWithGoogle = (redirect) => {
    setLoading(true)
    return firebase
           .auth()
           .signInWithPopup(new firebase.auth.GoogleAuthProvider())
           .then(res => {
              handleUser(res.user)

              if (redirect) {
                Router.push(redirect)
              }
           })
  }

  const signout = () => {
    setLoading(true)
    return firebase
           .auth()
           .signOut()
           .then(() => handleUser(false))
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(handleUser);

    return () => unsubscribe();
  }, [])
    
  return {
    user,
    loading,
    signinWithGitHub,
    signinWithGoogle,
    signout
  }
}

export const useAuth = () => {
  return useContext(authContext)
}


export function AuthProvider({ children }) {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

const formatUser = (user) => {
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    provider: user.providerData[0].providerId,
    photoUrl: user.photoURL,
  }
}