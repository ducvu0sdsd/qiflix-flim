
import './signupheader.scss'
import React from 'react'
import Qiflix from '../../resources/qiflix.png'

const SignUpHeader = () => {
    return (
        <header className='col-lg-12' id='header-signup'>
            <div className='col-lg-2'>
                <img src={Qiflix} width={'60%'} />
            </div>
            <button className='btn-sign-in'>Sign In</button>
        </header>
    )
}

export default SignUpHeader
