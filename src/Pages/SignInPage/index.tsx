
import React from 'react'
import SignInHeader from '../../Components/SignInHeader'
import Footer from '../../Components/Footer'

const SignInPage = () => {

    const titleElement = document.querySelector('head title');
    if (titleElement) {
        titleElement.textContent = "Qiflix";
    }

    return (
        <>
            <SignInHeader />
            <Footer />
        </>
    )
}

export default SignInPage
