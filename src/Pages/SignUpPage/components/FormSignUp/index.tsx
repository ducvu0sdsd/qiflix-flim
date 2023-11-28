
import './formsignup.scss'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import LoadingComplete from '../../../../resources/loading-sign-up.gif'

const FormSignUp = () => {

    const [focuses, setFocuses] = useState<{ focusPassword: boolean, focusConfirm: boolean }>({ focusPassword: false, focusConfirm: false })
    const [step, setStep] = useState<number>(1)
    const [stepCurrent, setStepCurrent] = useState<number>(3)
    const formStepParentRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (formStepParentRef.current) {
            formStepParentRef.current.style.marginLeft = `${550 * (step - 1) * -1}px`
        }
    }, [step])

    const handleChangeStep = (step_index: number) => {
        if (step_index <= stepCurrent) {
            setStep(step_index)
        }
    }

    return (
        <section id='form-sign-up' className='col-lg-12' style={{ height: `${window.innerHeight}px` }}>
            <div className='form'>
                <span><b>STEP {step} OF 3</b></span>
                <div className='process'>
                    <div onClick={() => handleChangeStep(1)} className={`process-child process-child-1 ${(stepCurrent === 1 || stepCurrent === 2 || stepCurrent === 3) && 'process-child-active'}`}></div>
                    <div onClick={() => handleChangeStep(2)} className={`process-child process-child-2 ${(stepCurrent === 2 || stepCurrent === 3) && 'process-child-active'}`}></div>
                    <div onClick={() => handleChangeStep(3)} className={`process-child process-child-3 ${(stepCurrent === 3) && 'process-child-active'}`}></div>
                    <div onClick={() => handleChangeStep(4)} className={`process-child process-child-4 ${(stepCurrent === 4) && 'process-child-active'}`}></div>
                </div>
                <div ref={formStepParentRef} className='form-step-parent'>
                    <div className='form-step-1 form-step'>
                        <h4>Welcome back!
                            Joining Qiflix is easy.</h4>
                        <span>Enter your password and you'll be watching in no time.</span>
                        <label style={{ marginTop: '15px' }}>Email Address</label>
                        <span className='lbl-email'>vutienduc26122002@gmail.com</span>
                        <div className='input-group'>
                            <span className={`lbl-password-focus ${focuses.focusPassword && 'lbl-password-focused'}`}>Enter New Password</span>
                            <input onFocus={() => setFocuses(() => ({ ...focuses, focusPassword: true }))} onBlur={(e) => { e.target.value == '' && setFocuses(() => ({ ...focuses, focusPassword: false })) }} type='password' className='txt-password' />
                        </div>
                        <div className='input-group'>
                            <span className={`lbl-password-focus ${focuses.focusConfirm && 'lbl-password-focused'}`}>Enter Confirm Password</span>
                            <input onFocus={() => setFocuses(() => ({ ...focuses, focusConfirm: true }))} onBlur={(e) => { e.target.value == '' && setFocuses(() => ({ ...focuses, focusConfirm: false })) }} type='password' className='txt-password' />
                        </div>
                        <button onClick={() => setStep(step + 1)} className='btn-next'>Next</button>
                    </div>
                    <div className='form-step-2 form-step'>
                        <h4>Please enter your information.</h4>
                        <div className='input-group'>
                            <span className={`lbl-password-focus ${focuses.focusPassword && 'lbl-password-focused'}`}>Full Name</span>
                            <input onFocus={() => setFocuses(() => ({ ...focuses, focusPassword: true }))} onBlur={(e) => { e.target.value == '' && setFocuses(() => ({ ...focuses, focusPassword: false })) }} type='password' className='txt-password' />
                        </div>
                        <div className='input-group'>
                            <span className={`lbl-password-focus ${focuses.focusPassword && 'lbl-password-focused'}`}>Phone Number</span>
                            <input onFocus={() => setFocuses(() => ({ ...focuses, focusPassword: true }))} onBlur={(e) => { e.target.value == '' && setFocuses(() => ({ ...focuses, focusPassword: false })) }} type='password' className='txt-password' />
                        </div>
                        <div className='input-group'>
                            <span className={`lbl-password-focus ${focuses.focusPassword && 'lbl-password-focused'}`}>Address</span>
                            <input onFocus={() => setFocuses(() => ({ ...focuses, focusPassword: true }))} onBlur={(e) => { e.target.value == '' && setFocuses(() => ({ ...focuses, focusPassword: false })) }} type='password' className='txt-password' />
                        </div>
                        <button onClick={() => setStep(step + 1)} className='btn-next'>Next</button>
                    </div>
                    <div className='form-step-3 form-step'>
                        <h4>Only this last step remains. Let's overcome it together.</h4>
                        <span>Please open your mailbox and enter the email confirmation code below.</span>
                        <label style={{ marginTop: '15px' }}>Email Address</label>
                        <span className='lbl-email'>vutienduc26122002@gmail.com</span>
                        <div className='input-group'>
                            <span className={`lbl-password-focus ${focuses.focusPassword && 'lbl-password-focused'}`}>Verify Code</span>
                            <input onFocus={() => setFocuses(() => ({ ...focuses, focusPassword: true }))} onBlur={(e) => { e.target.value == '' && setFocuses(() => ({ ...focuses, focusPassword: false })) }} type='password' className='txt-password' />
                        </div>
                        <button onClick={() => setStep(step + 1)} className='btn-next'>Next</button>
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
