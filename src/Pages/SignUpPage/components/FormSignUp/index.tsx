
import './formsignup.scss'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import $ from 'jquery'
import LoadingComplete from '../../../../resources/loading-sign-up.gif'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

interface FormSignUpProp {
    email: string | undefined
}

interface AccountInterface {
    email: string,
    verify: string,
    _id: string
}

const FormSignUp = ({ email }: FormSignUpProp) => {
    const navigate = useNavigate()
    const [focuses, setFocuses] = useState<{ focusPassword: boolean, focusConfirm: boolean }>({ focusPassword: false, focusConfirm: false })
    const [step, setStep] = useState<number>(1)
    const [stepCurrent, setStepCurrent] = useState<number>(1)
    const [account, setAccount] = useState<AccountInterface>()
    const formStepParentRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (account) {
            if (account.verify === 'Success') {
                setStepCurrent(4)
                setStep(4)
                navigate('/sign-in-page')
            } else {
                const stepAccount: number = parseInt(account.verify.replace('Step ', ''))
                setStepCurrent(stepAccount)
                setStep(stepAccount)
            }
        }
    }, [account])

    useEffect(() => {
        if (formStepParentRef.current) {
            formStepParentRef.current.style.marginLeft = `${550 * (step - 1) * -1}px`
        }
    }, [step])

    useEffect(() => {
        axios.get(`/accounts/get-by-email/${email}`)
            .then(res => {
                setAccount(res.data)
            })
    }, [email])

    const handleChangeStep = (step_index: number) => {
        if (step_index <= stepCurrent) {
            setStep(step_index)
        }
    }

    const handleConfirmVerifyCode = () => {
        const verifyCode = $('.txt-verify-code').val()
        if (/[0-9]{6}/.test(verifyCode)) {
            axios.post('/auths/confirm-verify-code', { email: email, verifyCode: verifyCode })
                .then(res => {
                    setAccount(res.data)
                })
        }
    }

    const handleUpdateBasisInformation = () => {
        const fullName = $('.txt-name').val()
        const phone = $('.txt-phone').val()
        const address = $('.txt-address').val()
        if (!/(^[A-ZÀ-Ỹ]{1}[a-zà-ỹ]+)(\s[A-ZÀ-Ỹ][a-zà-ỹ]+){0,}$/.test(fullName)) {
            return
        }
        if (!/[0-9]{10}/.test(phone)) {
            return
        }
        if (address === '') {
            return
        }
        if (account) {
            axios.put(`/auths/update-basis-information-by-id/${account._id}`, {
                fullname: fullName,
                phone: phone,
                address: address,
                verify: 'Step 3'
            })
                .then(res => {
                    setAccount(res.data)
                })
        }

    }

    const handleUpdatePassword = () => {
        const password = $('.txt-password').val()
        const confirmPassword = $('.txt-confirm-password').val()
        if (!/.{6,20}/.test(password)) {
            return
        }
        if (password !== confirmPassword) {
            return
        }
        if (account) {
            axios.put(`/auths/update-password-by-id/${account._id}`, { password: password, verify: 'Success' })
                .then(res => {
                    setAccount(res.data)
                })
        }
    }

    return (
        <section id='form-sign-up' className='col-lg-12' style={{ height: `${window.innerHeight}px` }}>
            <div className='form'>
                <span><b>STEP {step} OF 4</b></span>
                <div className='process'>
                    <div onClick={() => handleChangeStep(1)} className={`process-child process-child-1 ${(stepCurrent === 1 || stepCurrent === 2 || stepCurrent === 3) && 'process-child-active'}`}></div>
                    <div onClick={() => handleChangeStep(2)} className={`process-child process-child-2 ${(stepCurrent === 2 || stepCurrent === 3) && 'process-child-active'}`}></div>
                    <div onClick={() => handleChangeStep(3)} className={`process-child process-child-3 ${(stepCurrent === 3) && 'process-child-active'}`}></div>
                    <div onClick={() => handleChangeStep(4)} className={`process-child process-child-4 ${(stepCurrent === 4) && 'process-child-active'}`}></div>
                </div>
                <div ref={formStepParentRef} className='form-step-parent'>
                    <div className='form-step-1 form-step'>
                        <h4>Verify Email</h4>
                        <span>Please open your mailbox and enter the email confirmation code below.</span>
                        <label style={{ marginTop: '15px' }}>Email Address</label>
                        <span className='lbl-email'>{email}</span>
                        <div className='input-group'>
                            <span className={`lbl-password-focus ${focuses.focusPassword && 'lbl-password-focused'}`}>Verify Code</span>
                            <input onFocus={() => setFocuses(() => ({ ...focuses, focusPassword: true }))} onBlur={(e) => { e.target.value == '' && setFocuses(() => ({ ...focuses, focusPassword: false })) }} type='password' className='txt-verify-code txt' />
                        </div>
                        <button onClick={() => handleConfirmVerifyCode()} className='btn-next'>Next</button>
                    </div>
                    <div className='form-step-2 form-step'>
                        <h4>Please enter your information.</h4>
                        <div className='input-group'>
                            <span className={`lbl-password-focus ${focuses.focusPassword && 'lbl-password-focused'}`}>Full Name</span>
                            <input onFocus={() => setFocuses(() => ({ ...focuses, focusPassword: true }))} onBlur={(e) => { e.target.value == '' && setFocuses(() => ({ ...focuses, focusPassword: false })) }} type='text' className='txt-name txt' />
                        </div>
                        <div className='input-group'>
                            <span className={`lbl-password-focus ${focuses.focusPassword && 'lbl-password-focused'}`}>Phone Number</span>
                            <input onFocus={() => setFocuses(() => ({ ...focuses, focusPassword: true }))} onBlur={(e) => { e.target.value == '' && setFocuses(() => ({ ...focuses, focusPassword: false })) }} type='text' className='txt-phone txt' />
                        </div>
                        <div className='input-group'>
                            <span className={`lbl-password-focus ${focuses.focusPassword && 'lbl-password-focused'}`}>Address</span>
                            <input onFocus={() => setFocuses(() => ({ ...focuses, focusPassword: true }))} onBlur={(e) => { e.target.value == '' && setFocuses(() => ({ ...focuses, focusPassword: false })) }} type='text' className='txt-address txt' />
                        </div>
                        <button onClick={() => handleUpdateBasisInformation()} className='btn-next'>Next</button>
                    </div>
                    <div className='form-step-3 form-step'>
                        <h4>Welcome back!
                            Joining Qiflix is easy.</h4>
                        <span>Enter your password and you'll be watching in no time.</span>
                        <label style={{ marginTop: '15px' }}>Email Address</label>
                        <span className='lbl-email'>{email}</span>
                        <div className='input-group'>
                            <span className={`lbl-password-focus ${focuses.focusPassword && 'lbl-password-focused'}`}>Enter New Password</span>
                            <input onFocus={() => setFocuses(() => ({ ...focuses, focusPassword: true }))} onBlur={(e) => { e.target.value == '' && setFocuses(() => ({ ...focuses, focusPassword: false })) }} type='password' className='txt-password txt' />
                        </div>
                        <div className='input-group'>
                            <span className={`lbl-password-focus ${focuses.focusConfirm && 'lbl-password-focused'}`}>Enter Confirm Password</span>
                            <input onFocus={() => setFocuses(() => ({ ...focuses, focusConfirm: true }))} onBlur={(e) => { e.target.value == '' && setFocuses(() => ({ ...focuses, focusConfirm: false })) }} type='password' className='txt-confirm-password txt' />
                        </div>
                        <button onClick={() => handleUpdatePassword()} className='btn-next'>Next</button>
                    </div>
                    <div className='form-step-4 form-step' style={{ alignItems: 'center', paddingTop: '20px' }}>
                        {/* <>
                            <h4>Please wait for us for a few seconds.</h4>
                            <img src={LoadingComplete} width={'30%'} />
                        </> */}
                        <h4 className='notify--success'>Sign Up Success !!!</h4>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FormSignUp
