
import React from 'react'
import SignUpHeader from '../../Components/SignUpHeader'
import FormSignUp from './components/FormSignUp'
import { useParams } from 'react-router-dom'

const SignUpPage = () => {

    const { email } = useParams()
    const titleElement = document.querySelector('head title');
    if (titleElement) {
        titleElement.textContent = "Qiflix";
    }

    return (
        <div>
            <SignUpHeader />
            <FormSignUp email={email} />
        </div>
    )
}

export default SignUpPage
