import React, { useState } from 'react'
import './publicheader.scss'
import Qiflix from '../../resources/qiflix.png'
import Banner from '../../resources/banner.png'
import { Link, useNavigate } from 'react-router-dom'
import $ from 'jquery'
import axios from 'axios'

const PublicHeader = () => {

  const navigate = useNavigate()
  const [focus, setFocus] = useState<boolean>(false)



  const handleCreateVerifyCode = () => {
    const emailSignUp = $('.txt-email-sign-up').val()
    if (/^[a-zA-Z0-9._%+-]+(@gmail.com)$/.test(emailSignUp)) {
      axios.get(`/auths/create-verify-code/${emailSignUp}`)
        .then(res => {
          if (res.data === true) {
            navigate(`/sign-up-page/${emailSignUp}`)
          }
        })
    }
  }

  return (
    <header id='public--header' style={{ height: `${window.innerHeight}px` }} className='col-lg-12'>
      <div className="header">
        <div className='col-lg-2 logo'>
          <img src={Qiflix} width={'60%'} />
        </div>
        <div className='col-lg-2 sign--parent'>
          <Link to={'/sign-in-page'}><button className='sign-in'>Sign in</button></Link>
        </div>
      </div>

      <div id='banner--public'>
        <div className='banner'>
          <div className='wapper--banner'></div>
          <img alt='The Banner of the public header' src={Banner} width={'100%'} />
        </div>
        <div className="greeting">
          <span className='message--1'>Welcome to your family !!!</span><br />
          <span className='message--2'>The biggest domestic and international hits. Everything here is free.</span><br />
          <span className='message--1'>Join today. Cancel anytime.</span><br />
          <div className="sign-up-now">
            <div className='input-email'>
              <span className={`lbl-email-address ${(focus) ? 'lbl-email-address-focused' : ''}`}>Email address</span>
              <input onFocus={() => setFocus(true)} onBlur={(e) => { e.target.value === '' && setFocus(false) }} type='email' className='txt-email-sign-up' />
            </div>
            <button onClick={() => handleCreateVerifyCode()}>Sign Up Now &gt;</button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default PublicHeader
