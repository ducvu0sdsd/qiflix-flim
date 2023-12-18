
import React from 'react'
import SignInHeader from '../../Components/SignInHeader'
import Footer from '../../Components/Footer'
import { motion } from 'framer-motion'

const SignInPage = () => {

    const titleElement = document.querySelector('head title');
    if (titleElement) {
        titleElement.textContent = "Qiflix";
    }

    return (
        <motion.div
            style={{ overflow: 'hidden' }}
            initial={{ x: window.innerWidth * -1 }}
            animate={{ x: 0 }}
            exit={{ x: window.innerWidth, transition: { duration: 0.2 } }}
        >
            <SignInHeader />
            <Footer />
        </motion.div>
    )
}

export default SignInPage
