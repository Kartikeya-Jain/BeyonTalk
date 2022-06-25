import React from 'react'
import '../css/Login.css'
import { auth, provider } from '../firebase'
import { signInWithPopup } from 'firebase/auth'
import MessageLogo from '../assets/MessageLogo.png'
function Login() {
  const signIn = () => {
    signInWithPopup(auth, provider)
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
  }
  return (
    <div className='login'>
      <div className='login__logo'>
        <img
          src={MessageLogo}
          alt='Message Logo'
        />
      </div>
      <h3> Welcome to beyonTalk ❤️</h3>
      <div className='login__button'>
        <button onClick={signIn}>Login</button>
      </div>
    </div>
  )
}

export default Login
