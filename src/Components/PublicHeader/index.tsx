import React, { useContext, useState } from 'react'
import './publicheader.scss'
import Qiflix from '../../resources/qiflix.png'
import Banner from '../../resources/banner.png'
import { Link, useNavigate } from 'react-router-dom'
import $ from 'jquery'
import axios from 'axios'
import { ThemeContext } from '../Context'
import { NotificationStatus } from '../Notification'
import { delay, motion } from 'framer-motion'

const PublicHeader = () => {

  const navigate = useNavigate()
  const [focus, setFocus] = useState<boolean>(false)
  const [loadingSignUp, setLoadingSignUp] = useState<boolean>(false)
  const { datas, handles } = useContext(ThemeContext) || {}


  const handleCreateVerifyCode = () => {
    const emailSignUp = $('.txt-email-sign-up').val()
    if (/^[a-zA-Z0-9._%+-]+(@gmail.com)$/.test(emailSignUp)) {
      setLoadingSignUp(true)
      axios.get(`/auths/create-verify-code/${emailSignUp}`)
        .then(res => {
          if (res.data === true) {
            navigate(`/sign-up-page/${emailSignUp}`)
            setLoadingSignUp(false)
          }
        })
    } else {
      handles?.handleSetNotification({ type: NotificationStatus.WARNING, message: 'Please, enter valid email' })
    }
  }

  return (
    <header id='public--header' style={{ height: `${window.innerHeight <= 800 ? window.innerHeight : 600}px`, width: `${window.innerWidth}px` }} className='col-lg-12'>
      <div className="header">
        <div className='col-lg-2 logo'>
          <img src={Qiflix} width={window.innerWidth <= 600 ? '45%' : '60%'} />
        </div>
        <div className='col-lg-2 sign--parent'>
          <Link to={'/sign-in-page'}><button className='sign-in'>Sign in</button></Link>
        </div>
      </div>

      <div id='banner--public'>
        {window.innerHeight <= 900 ?
          <div className='banner'>
            <div className='wapper--banner'></div>
            <img alt='The Banner of the public header' src={Banner} width={'100%'} />
          </div> :
          <div style={{ width: '100%' }} className='banner'>
            <div className='wapper--banner'></div>
            <img alt='The Banner of the public header' src={Banner} height={'110%'} />
          </div>
        }
        <motion.div
          initial={{ opacity: 0, transform: 'translateY(-70%) translateX(-50%)' }}
          animate={{ opacity: 1, transform: 'translateY(-50%) translateX(-50%)' }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="greeting">

          <span className='message--1'>Welcome to your family !!!</span><br />
          <span className='message--2'>The biggest domestic and international hits. Everything here is free.</span><br />
          <span className='message--1'>Join today. Cancel anytime.</span><br />
          <div className="sign-up-now">
            <div className='input-email'>
              <span onClick={() => setFocus(true)} className={`lbl-email-address ${(focus) ? 'lbl-email-address-focused' : ''}`}>Email address</span>
              <input onFocus={() => setFocus(true)} onBlur={(e) => { e.target.value === '' && setFocus(false) }} type='email' className='txt-email-sign-up' />
            </div>
            <motion.button whileHover={{ scale: 1.05, boxShadow: '0px 0px 8px rgb(255,255,255)' }} onClick={() => handleCreateVerifyCode()}>{loadingSignUp ? <div className="spinner-border text-light" role="status" /> : <>Sign Up Now &gt;</>}</motion.button>
          </div>
        </motion.div>
      </div>
    </header>
  )
}

export default PublicHeader
