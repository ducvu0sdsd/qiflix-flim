
import './formsignup.scss'
import React, { ReactNode, useEffect, useRef, useState } from 'react'

const FormSignUp = () => {

    const [focuses, setFocuses] = useState<{ focusPassword: boolean, focusConfirm: boolean }>({ focusPassword: false, focusConfirm: false })
    const [step, setStep] = useState<number>(1)
    const formStepParentRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (formStepParentRef.current) {
            formStepParentRef.current.style.marginLeft = `${550 * (step - 1) * -1}px`
        }
    }, [step])

    return (
        <section id='form-sign-up' className='col-lg-12' style={{ height: `${window.innerHeight}px` }}>
            <div className='form'>
                <span><b>STEP 1 OF 3</b></span>
                <div className='process'>
                    <div className={`process-child process-child-1 ${(step === 1 || step === 2 || step === 3) && 'process-child-active'}`}></div>
                    <div className={`process-child process-child-2 ${(step === 2 || step === 3) && 'process-child-active'}`}></div>
                    <div className={`process-child process-child-3 ${(step === 3) && 'process-child-active'}`}></div>
                </div>
                <div ref={formStepParentRef} className='form-step-parent'>
                    <div className='form-step-1 form-step'>
                        <h3>Welcome back!
                            Joining Qiflix is easy.</h3>
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

                    </div>
                    <div className='form-step-3 form-step'>

                    </div>
                </div>
            </div>
        </section>
    )
}

export default FormSignUp
