
import './notification.scss'
import React, { useEffect, useRef, useState } from 'react'
import $ from 'jquery'

export enum NotificationStatus {
    SUCCESS = "success",
    FAIL = "fail",
    WARNING = "warning",
    NONE = "none"
}

interface NotificationProp {
    statusProp: NotificationStatus,
    message: string
}

const Notification = ({ statusProp, message }: NotificationProp) => {
    const [status, setStatus] = useState<NotificationStatus>(NotificationStatus.NONE)
    const timeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => setStatus(statusProp), [statusProp])

    useEffect(() => {
        const notification = $('#notification')
        const statusName = $('#notification .status-name')
        if (status !== NotificationStatus.NONE && notification) {
            const statusColor = $('.status-color')
            switch (status) {
                case NotificationStatus.SUCCESS:
                    statusName.html("Success")
                    statusColor.css('background-color', 'green')
                    break;
                case NotificationStatus.FAIL:
                    statusName.html("Fail")
                    statusColor.css('background-color', 'red')
                    break;
                case NotificationStatus.WARNING:
                    statusName.html("Warning")
                    statusColor.css('background-color', 'yellow')
                    break;
                default:
                    break;
            }
            if (timeout.current == null) {
                notification.css('display', 'block')
                timeout.current = setTimeout(() => {
                    notification.css('opacity', '1')
                    timeout.current = setTimeout(() => {
                        notification.css('opacity', '0')
                        timeout.current = setTimeout(() => {
                            timeout.current = null
                            notification.css('display', 'none')
                            setStatus(NotificationStatus.NONE)
                        }, 200)
                    }, 2000)
                }, 200)
            }
        }
    }, [status])

    return (
        <div id='notification' className='col-lg-12'>
            <div className='col-lg-12 head'>
                <div className='status-color'></div>
                <span className='status-name'></span>
            </div>
            <div className='message'>
                {message}
            </div>
            <i className='bx bx-x btn-exit'></i>
        </div>
    )
}

export default Notification
