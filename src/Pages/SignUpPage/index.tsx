
import React from 'react'
import SignUpHeader from '../../Components/SignUpHeader'
import FormSignUp from './components/FormSignUp'
import { useParams } from 'react-router-dom'

const SignUpPage = () => {

    const { email } = useParams()

    return (
        <div>
            <SignUpHeader />
            <FormSignUp email={email} />
        </div>
    )
}

export default SignUpPage
