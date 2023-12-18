import { motion } from 'framer-motion'
import './FormHandlePin.scss'
import React, { useContext, useEffect, useState } from 'react'
import $ from 'jquery'
import { ThemeContext } from '../../../../Components/Context'
import { NotificationStatus } from '../../../../Components/Notification'
import { useNavigate } from 'react-router-dom'

export enum TypeFormPin {
    CREATE = 'create',
    UPDATE = "update",
    DELETE = "delete",
    CONFIRM = "confirm",
    NONE = 'none'
}

export interface FromHandlePinProps {
    type: TypeFormPin
    setStatusFormPin: React.Dispatch<React.SetStateAction<{ display: boolean, type: TypeFormPin }>>
    setPin: React.Dispatch<React.SetStateAction<string>>
    pin: string | ''
}

const FormHandlePin = ({ type, setStatusFormPin, setPin, pin }: FromHandlePinProps) => {

    const [statusConfirm, setStatusConfirm] = useState<{ prevValue: string, display: boolean }>({ prevValue: '', display: false })
    const [valueConfirm, setValueConfirm] = useState<string>('')
    const { datas, handles } = useContext(ThemeContext) || {}
    const navigate = useNavigate()
    useEffect(() => {
        $('body').css('overflow', 'hidden')
        $('.input-pin-create .input-pin-item-1').focus()
    }, [])

    useEffect(() => {
        if (statusConfirm.display) {
            $('.input-pin-confirm-create .input-pin-item-1').focus()
        }
    }, [statusConfirm.display])

    useEffect(() => {
        setStatusConfirm({ prevValue: '', display: false })
        setValueConfirm('')
        document.querySelectorAll('.input-pin-item').forEach((item) => {
            const inputItem = item as HTMLInputElement;
            inputItem.value = ''
        })
    }, [type])

    const handleEnteredInput = (num: number, e: any) => {
        if (/[0-9]{1}/.test(e.target.value)) {
            if (num != 4) {
                if (!statusConfirm.display) {
                    setStatusConfirm({ prevValue: statusConfirm.prevValue + e.target.value, display: false })
                    $(`.input-pin-item-${num + 1}`).focus()
                } else {
                    setValueConfirm(valueConfirm + e.target.value)
                    $(`.input-pin-item-${num + 1}`).focus()
                }
            } else {
                if (type === TypeFormPin.CONFIRM) {
                    if (pin === statusConfirm.prevValue + e.target.value) {
                        handles?.handleSetNotification({ type: NotificationStatus.SUCCESS, message: "Go To HomePage" })
                        navigate('/home-page')
                    } else {
                        handles?.handleSetNotification({ type: NotificationStatus.FAIL, message: "PIN code does not match" })
                        document.querySelectorAll('.input-pin-item').forEach((item) => {
                            const inputItem = item as HTMLInputElement;
                            inputItem.value = ''
                        })
                        $('.input-pin-create .input-pin-item-1').focus()
                        setStatusConfirm({ display: false, prevValue: '' })

                    }
                } else {
                    if (!statusConfirm.display) {
                        setStatusConfirm({ prevValue: statusConfirm.prevValue + e.target.value, display: true })
                    } else {
                        if (valueConfirm + e.target.value === statusConfirm.prevValue) {
                            handles?.handleSetNotification({ type: NotificationStatus.SUCCESS, message: type === TypeFormPin.CREATE ? 'Create Pin Successful' : 'Update Pin Successful' })
                            setStatusFormPin({ display: false, type: TypeFormPin.NONE })
                            setPin(statusConfirm.prevValue)
                        } else {
                            handles?.handleSetNotification({ type: NotificationStatus.FAIL, message: type === TypeFormPin.CREATE ? "Create Pin And Confirm Pin Don't Match" : "Update Pin And Confirm Pin Don't Match" })
                            setStatusFormPin({ display: false, type: TypeFormPin.NONE })
                        }
                    }
                    document.querySelectorAll('.input-pin-item').forEach((item) => {
                        const inputItem = item as HTMLInputElement;
                        inputItem.value = ''
                    })
                }
            }
        } else {
            e.target.value = ''
            e.target.focus()
        }
    }

    return (
        <motion.section
            initial={{ x: window.innerWidth * -1 }}
            animate={{ x: 0 }}
            exit={{ x: window.innerWidth, transition: { duration: 0.2 } }}
            style={{ height: `${window.innerHeight}px` }}
            onClick={() => setStatusFormPin({ display: false, type: TypeFormPin.NONE })}
            id='form-handle-pin'>
            <div
                onClick={(e: any) => { e.stopPropagation(); }}
                className='form-pin'>
                <i
                    onClick={() => setStatusFormPin({ display: false, type: TypeFormPin.NONE })}
                    className='btn-exit bx bx-x'></i>
                {type === TypeFormPin.CREATE ?
                    statusConfirm.display ?
                        <>
                            <h2>Confirm Pin</h2>
                            <div className='input-pin input-pin-confirm-create'>
                                <input onChange={(e: any) => handleEnteredInput(1, e)} type='text' className='input-pin-item-1 input-pin-item' />
                                <input onChange={(e: any) => handleEnteredInput(2, e)} type='text' className='input-pin-item-2 input-pin-item' />
                                <input onChange={(e: any) => handleEnteredInput(3, e)} type='text' className='input-pin-item-3 input-pin-item' />
                                <input onChange={(e: any) => handleEnteredInput(4, e)} type='text' className='input-pin-item-4 input-pin-item' />
                            </div>
                        </>
                        :
                        <>
                            <h2>Create New Pin</h2>
                            <div className='input-pin input-pin-create'>
                                <input onChange={(e: any) => handleEnteredInput(1, e)} type='text' className='input-pin-item-1 input-pin-item' />
                                <input onChange={(e: any) => handleEnteredInput(2, e)} type='text' className='input-pin-item-2 input-pin-item' />
                                <input onChange={(e: any) => handleEnteredInput(3, e)} type='text' className='input-pin-item-3 input-pin-item' />
                                <input onChange={(e: any) => handleEnteredInput(4, e)} type='text' className='input-pin-item-4 input-pin-item' />
                            </div>
                        </>
                    :
                    type === TypeFormPin.UPDATE ?
                        statusConfirm.display ?
                            <>
                                <h2>Confirm Pin</h2>
                                <div className='input-pin input-pin-confirm-create'>
                                    <input onChange={(e: any) => handleEnteredInput(1, e)} type='text' className='input-pin-item-1 input-pin-item' />
                                    <input onChange={(e: any) => handleEnteredInput(2, e)} type='text' className='input-pin-item-2 input-pin-item' />
                                    <input onChange={(e: any) => handleEnteredInput(3, e)} type='text' className='input-pin-item-3 input-pin-item' />
                                    <input onChange={(e: any) => handleEnteredInput(4, e)} type='text' className='input-pin-item-4 input-pin-item' />
                                </div>
                            </>
                            :
                            <>
                                <h2>Update New Pin</h2>
                                <div className='input-pin input-pin-create'>
                                    <input onChange={(e: any) => handleEnteredInput(1, e)} type='text' className='input-pin-item-1 input-pin-item' />
                                    <input onChange={(e: any) => handleEnteredInput(2, e)} type='text' className='input-pin-item-2 input-pin-item' />
                                    <input onChange={(e: any) => handleEnteredInput(3, e)} type='text' className='input-pin-item-3 input-pin-item' />
                                    <input onChange={(e: any) => handleEnteredInput(4, e)} type='text' className='input-pin-item-4 input-pin-item' />
                                </div>
                            </>

                        :
                        type === TypeFormPin.DELETE ?
                            <>
                                <h2>Do You Want Delete Pin Of This User ?</h2>
                                <div className='input-pin input-pin-confirm-create'>
                                    <button onClick={() => { setPin(""); setStatusFormPin({ display: false, type: TypeFormPin.NONE }) }} className="btn btn-primary">Yes</button>
                                    <button className="btn btn-danger">No</button>
                                </div>
                            </>
                            :
                            type === TypeFormPin.CONFIRM &&
                            <>
                                <h2>Enter Pin</h2>
                                <div className='input-pin input-pin-create'>
                                    <input onChange={(e: any) => handleEnteredInput(1, e)} type='text' className='input-pin-item-1 input-pin-item' />
                                    <input onChange={(e: any) => handleEnteredInput(2, e)} type='text' className='input-pin-item-2 input-pin-item' />
                                    <input onChange={(e: any) => handleEnteredInput(3, e)} type='text' className='input-pin-item-3 input-pin-item' />
                                    <input onChange={(e: any) => handleEnteredInput(4, e)} type='text' className='input-pin-item-4 input-pin-item' />
                                </div>
                            </>

                }
            </div>

        </motion.section>
    )
}

export default FormHandlePin