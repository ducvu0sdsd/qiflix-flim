
import './signinheader.scss'
import React, { useState } from 'react'
import Banner from '../../resources/banner.png'
import Qiflix from '../../resources/qiflix.png'
import { Link, useNavigate } from 'react-router-dom'

const SignInHeader = () => {
    const navigate = useNavigate()
    const [focuses, setFocuses] = useState<{ focusAddress: boolean, focusPassword: boolean }>({ focusAddress: false, focusPassword: false })

    const handleSignIn = () => {
        navigate('/manage-profile-page')
    }

    return (
        <header id='sign-in-header' className='col-lg-12'>
            <div className="header">
                <div className='col-lg-2 logo'>
                    <img src={Qiflix} width={'60%'} />
                </div>
            </div>
            <div className='banner'>
                <div className='banner-wapper col-lg-12'></div>
                <img src={Banner} width={"100%"} />
                <div className="form-sign-in">
                    <h5>HELLO! WELCOME TO THE FAMILY.</h5>
                    <span className='message'>Help us get to know you better. You know, because family stays close.</span>
                    <div className='input-email'>
                        <span className={`lbl-email-address ${(focuses.focusAddress) ? 'lbl-email-address-focused' : ''}`}>Email address</span>
                        <input onFocus={() => setFocuses({ focusAddress: true, focusPassword: focuses.focusPassword })} onBlur={(e) => { e.target.value === '' && setFocuses({ focusAddress: false, focusPassword: focuses.focusPassword }) }} type='email' className='txt-email-sign-up' />
                    </div>
                    <div className='input-email'>
                        <span className={`lbl-email-address ${(focuses.focusPassword) ? 'lbl-email-address-focused' : ''}`}>Password</span>
                        <input onFocus={() => setFocuses({ focusAddress: focuses.focusAddress, focusPassword: true })} onBlur={(e) => { e.target.value === '' && setFocuses({ focusAddress: focuses.focusAddress, focusPassword: false }) }} type='password' className='txt-email-sign-up' />
                    </div>
                    <button onClick={() => handleSignIn()} className='btn-sign-in'>Sign in</button>
                    <span className='option'>Forgot Password ?</span>
                    <span className='option'>Don't have an account? <b><Link to={'/sign-up-page'}>Sign Up</Link></b></span>
                </div>
            </div>
        </header>
    )
}

export default SignInHeader
