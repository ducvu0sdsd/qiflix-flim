
import './signinheader.scss'
import React, { useContext, useState } from 'react'
import Banner from '../../resources/banner.png'
import Qiflix from '../../resources/qiflix.png'
import { Link, useNavigate } from 'react-router-dom'
import $ from 'jquery'
import axios from 'axios'
import { ThemeContext } from '../Context'
import { NotificationStatus } from '../Notification'

const SignInHeader = () => {
    const [focuses, setFocuses] = useState<{ focusAddress: boolean, focusPassword: boolean }>({ focusAddress: false, focusPassword: false })
    const [loadingSignIn, setLoadingSignIn] = useState<boolean>(false)
    const { datas, handles } = useContext(ThemeContext) || {}
    const navigate = useNavigate()

    const handleSignIn = () => {
        // navigate('/manage-profile-page')
        const email = $('#sign-in-header .txt-email').val()
        const password = $('#sign-in-header .txt-password').val()
        if (!/^[a-zA-Z0-9._%+-]+(@gmail.com)$/.test(email)) {
            handles?.handleSetNotification({ type: NotificationStatus.WARNING, message: 'Please, enter valid email' })
            return
        }
        if (!/.{6,20}/.test(password)) {
            handles?.handleSetNotification({ type: NotificationStatus.WARNING, message: 'Please, enter valid password' })
            return
        }
        setLoadingSignIn(true)
        axios.post('/auths/sign-in', { email, password })
            .then(res => {
                localStorage.setItem('accessToken', JSON.stringify(res.data.accessToken))
                localStorage.setItem('refreshToken', JSON.stringify(res.data.refreshToken))
                navigate('/manage-profile-page')
                setLoadingSignIn(false)
                handles?.handleSetNotification({ type: NotificationStatus.SUCCESS, message: 'Logged in successfully' })
            })
            .catch(res => {
                let message: string = res.response.data.message
                message = message.split(":")[1]
                handles?.handleSetNotification({ type: NotificationStatus.FAIL, message })
                setLoadingSignIn(false)
            })
    }

    return (
        <header id='sign-in-header' className='col-lg-12'>
            <div className="header">
                <div className='col-lg-2 logo'>
                    {window.innerHeight <= 800 ? <img src={Qiflix} width={'60%'} /> : <img src={Qiflix} width={'45%'} />}
                </div>
            </div>
            <div className='banner'>
                <div className='banner-wapper col-lg-12'></div>
                {window.innerHeight >= 800 ? <img src={Banner} height={"100%"} /> : <img src={Banner} width={"100%"} />}
                <div className="form-sign-in">
                    <h5>HELLO! WELCOME TO THE FAMILY.</h5>
                    <span className='message'>Help us get to know you better. You know, because family stays close.</span>
                    <div className='input-email'>
                        <span onClick={() => setFocuses({ focusAddress: true, focusPassword: focuses.focusPassword })} className={`lbl-email-address ${(focuses.focusAddress) ? 'lbl-email-address-focused' : ''}`}>Email address</span>
                        <input onFocus={() => setFocuses({ focusAddress: true, focusPassword: focuses.focusPassword })} onBlur={(e) => { e.target.value === '' && setFocuses({ focusAddress: false, focusPassword: focuses.focusPassword }) }} type='email' className='txt-email txt ' />
                    </div>
                    <div className='input-email'>
                        <span onClick={() => setFocuses({ focusAddress: focuses.focusAddress, focusPassword: true })} className={`lbl-email-address ${(focuses.focusPassword) ? 'lbl-email-address-focused' : ''}`}>Password</span>
                        <input onFocus={() => setFocuses({ focusAddress: focuses.focusAddress, focusPassword: true })} onBlur={(e) => { e.target.value === '' && setFocuses({ focusAddress: focuses.focusAddress, focusPassword: false }) }} type='password' className='txt-password txt ' />
                    </div>
                    <button onClick={() => handleSignIn()} className='btn-sign-in'>{loadingSignIn ? <div className="spinner-border text-light" role="status" /> : <>Sign in</>}</button>
                    <span className='option'>Forgot Password ?</span>
                    <span className='option'>Don't have an account? <b><Link className='link' style={{ color: 'white', textDecoration: 'underline' }} to={'/'}>Sign Up</Link></b></span>
                </div>
            </div>
        </header>
    )
}

export default SignInHeader
