
import './formsignup.scss'
import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react'
import $ from 'jquery'
import LoadingComplete from '../../../../resources/loading-sign-up.gif'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { ThemeContext } from '../../../../Components/Context'
import { NotificationStatus } from '../../../../Components/Notification'
import { secondsToTimeForSignUp } from '../../../../Utils/movie'

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
    const [focuses, setFocuses] = useState<{ focusPassword: boolean, focusConfirm: boolean, focusFullName: boolean, focusPhone: boolean, focusAddress: boolean }>({ focusPassword: false, focusConfirm: false, focusAddress: false, focusFullName: false, focusPhone: false })
    const [step, setStep] = useState<number>(1)
    const [stepCurrent, setStepCurrent] = useState<number>(1)
    const [account, setAccount] = useState<AccountInterface>()
    const [loadingSignUp, setLoadingSignUp] = useState<boolean>(false)
    const formStepParentRef = useRef<HTMLDivElement | null>(null)
    const { datas, handles } = useContext(ThemeContext) || {}
    const [timeRemaining, setTimeRemaining] = useState<number>(120)
    const int = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        int.current = setTimeout(() => {
            if (timeRemaining !== 0) {
                setTimeRemaining((prevTime) => prevTime - 1);
            }
        }, 1000);
    }, [timeRemaining]);

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
            setLoadingSignUp(true)
            axios.post('/auths/confirm-verify-code', { email: email, verifyCode: verifyCode })
                .then(res => {
                    setAccount(res.data)
                    handles?.handleSetNotification({ type: NotificationStatus.SUCCESS, message: 'Successful Authentication' })
                    setLoadingSignUp(false)
                })
                .catch(res => {
                    handles?.handleSetNotification({ type: NotificationStatus.FAIL, message: res.response.data.message })
                    setLoadingSignUp(false)
                })
        }
    }

    const handleUpdateBasisInformation = () => {
        const fullName = $('.txt-name').val()
        const phone = $('.txt-phone').val()
        const address = $('.txt-address').val()
        if (!/(^[A-ZÀ-Ỹ]{1}[a-zà-ỹ]+)(\s[A-ZÀ-Ỹ][a-zà-ỹ]+){0,}$/.test(fullName)) {
            handles?.handleSetNotification({ type: NotificationStatus.WARNING, message: 'Please Enter FullName as Vu Tien Duc' })
            return
        }
        if (!/[0-9]{10}/.test(phone)) {
            handles?.handleSetNotification({ type: NotificationStatus.WARNING, message: 'Please Enter FullName as 0902491471' })
            return
        }
        if (address === '') {
            handles?.handleSetNotification({ type: NotificationStatus.WARNING, message: 'Please Enter Address' })
            return
        }
        if (account) {
            setLoadingSignUp(true)
            axios.put(`/auths/update-basis-information-by-id/${account._id}`, {
                fullname: fullName,
                phone: phone,
                address: address,
                verify: 'Step 3'
            })
                .then(res => {
                    handles?.handleSetNotification({ type: NotificationStatus.SUCCESS, message: 'Successful Updating Basis Information' })
                    setAccount(res.data)
                    setLoadingSignUp(false)
                })
                .catch(res => {
                    handles?.handleSetNotification({ type: NotificationStatus.FAIL, message: res.response.data.message })
                    setLoadingSignUp(false)
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
            setLoadingSignUp(true)
            axios.put(`/auths/update-password-by-id/${account._id}`, { password: password, verify: 'Success' })
                .then(res => {
                    handles?.handleSetNotification({ type: NotificationStatus.SUCCESS, message: 'Successful Create Account' })
                    setAccount(res.data)
                    setLoadingSignUp(false)
                })
                .catch(res => {
                    handles?.handleSetNotification({ type: NotificationStatus.FAIL, message: res.response.data.message })
                    setLoadingSignUp(false)
                })
        }
    }

    const handleCreateVerifyCode = () => {
        axios.get(`/auths/create-verify-code/${email}`)
            .then(res => {
                if (res.data === true) {
                    navigate(`/sign-up-page/${email}`)
                    setLoadingSignUp(false)
                    setTimeRemaining(120)
                    if (int.current) {
                        clearTimeout(int.current!)
                    }
                }
            })
    }

    return (
        <section id='form-sign-up' className='col-lg-12' style={{ height: `${window.innerHeight}px` }}>
            <div className='form'>
                <span><b>STEP {step} OF 3</b></span>
                <div className='process'>
                    <div onClick={() => handleChangeStep(1)} className={`process-child process-child-1 ${(stepCurrent === 1 || stepCurrent === 2 || stepCurrent === 3) && 'process-child-active'}`}></div>
                    <div onClick={() => handleChangeStep(2)} className={`process-child process-child-2 ${(stepCurrent === 2 || stepCurrent === 3) && 'process-child-active'}`}></div>
                    <div onClick={() => handleChangeStep(3)} className={`process-child process-child-3 ${(stepCurrent === 3) && 'process-child-active'}`}></div>
                </div>
                <div ref={formStepParentRef} className='form-step-parent'>
                    <div className='form-step-1 form-step'>
                        <h4>Verify Email</h4>
                        <span>Please open your mailbox and enter the email confirmation code below.</span>
                        <label style={{ marginTop: '15px' }}>Email Address</label>
                        <span className='lbl-email'>{email}</span>
                        <div className='input-group'>
                            <span className={`lbl-password-focus ${focuses.focusPassword && 'lbl-password-focused'}`}>Verify Code</span>
                            <input onFocus={() => setFocuses(() => ({ ...focuses, focusPassword: true }))} onBlur={(e) => { e.target.value === '' && setFocuses(() => ({ ...focuses, focusPassword: false })) }} type='password' className='txt-verify-code txt' />
                        </div>
                        <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ width: 'auto' }}>Don't Get Verify Code?<button onClick={() => handleCreateVerifyCode()} className='btn-resend'>ReSend</button></span>
                            <span style={{ width: 'auto' }}>{timeRemaining !== 0 ? <>Time remaining {secondsToTimeForSignUp(timeRemaining)}</> : <span style={{ color: 'red', width: 'auto' }}>Expired</span>}</span>
                        </span>
                        <button onClick={() => handleConfirmVerifyCode()} className='btn-next'>{loadingSignUp ? <div className="spinner-border text-light" role="status" /> : <>Next</>}</button>
                    </div>
                    <div className='form-step-2 form-step'>
                        <h4>Please enter your information.</h4>
                        <div className='input-group'>
                            <span className={`lbl-password-focus ${focuses.focusFullName && 'lbl-password-focused'}`}>Full Name</span>
                            <input onFocus={() => setFocuses(() => ({ ...focuses, focusFullName: true }))} onBlur={(e) => { e.target.value === '' && setFocuses(() => ({ ...focuses, focusFullName: false })) }} type='text' className='txt-name txt' />
                        </div>
                        <div className='input-group'>
                            <span className={`lbl-password-focus ${focuses.focusPhone && 'lbl-password-focused'}`}>Phone Number</span>
                            <input onFocus={() => setFocuses(() => ({ ...focuses, focusPhone: true }))} onBlur={(e) => { e.target.value === '' && setFocuses(() => ({ ...focuses, focusPhone: false })) }} type='text' className='txt-phone txt' />
                        </div>
                        <div className='input-group'>
                            <span className={`lbl-password-focus ${focuses.focusAddress && 'lbl-password-focused'}`}>Address</span>
                            <input onFocus={() => setFocuses(() => ({ ...focuses, focusAddress: true }))} onBlur={(e) => { e.target.value === '' && setFocuses(() => ({ ...focuses, focusAddress: false })) }} type='text' className='txt-address txt' />
                        </div>
                        <button onClick={() => handleUpdateBasisInformation()} className='btn-next'>{loadingSignUp ? <div className="spinner-border text-light" role="status" /> : <>Next</>}</button>
                    </div>
                    <div className='form-step-3 form-step'>
                        <h4>Welcome back!
                            Joining Qiflix is easy.</h4>
                        <span style={{ width: 'auto' }}>Enter your password and you'll be watching in no time.</span>
                        <label style={{ marginTop: '15px' }}>Email Address</label>
                        <span className='lbl-email'>{email}</span>
                        <div className='input-group'>
                            <span className={`lbl-password-focus ${focuses.focusPassword && 'lbl-password-focused'}`}>Enter New Password</span>
                            <input onFocus={() => setFocuses(() => ({ ...focuses, focusPassword: true }))} onBlur={(e) => { e.target.value === '' && setFocuses(() => ({ ...focuses, focusPassword: false })) }} type='password' className='txt-password txt' />
                        </div>
                        <div className='input-group'>
                            <span className={`lbl-password-focus ${focuses.focusConfirm && 'lbl-password-focused'}`}>Enter Confirm Password</span>
                            <input onFocus={() => setFocuses(() => ({ ...focuses, focusConfirm: true }))} onBlur={(e) => { e.target.value === '' && setFocuses(() => ({ ...focuses, focusConfirm: false })) }} type='password' className='txt-confirm-password txt' />
                        </div>
                        <button onClick={() => handleUpdatePassword()} className='btn-next'>{loadingSignUp ? <div className="spinner-border text-light" role="status" /> : <>Finish</>}</button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FormSignUp
