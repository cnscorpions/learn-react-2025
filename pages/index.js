import Head from 'next/head'
import { useAuth } from '../lib/auth'
import styles from '../styles/Home.module.css'

export default function Home() {

  const auth = useAuth();

  return (
    auth.user ? (
      <div>
        <p>Email: {auth.user.email}</p>
        <button onClick={(e) => auth.signout()}>Sign Out</button>
      </div>
    ) : (
      <button onClick={(e) => auth.signinWithGitHub()}>Sign In</button>
    )
  )
}
