
import React, { useEffect, useRef, useState } from 'react'
import './privateheader.scss'
import Qiflix from '../../resources/qiflix.png'
import $ from 'jquery'
import { UserInterface } from '../Context/interfaces'
import { useNavigate } from 'react-router-dom'

const PrivateHeader = ({ users, currentUser }: { users: UserInterface[], currentUser: UserInterface | undefined }) => {

    const navigate = useNavigate()
    const [hover, setHover] = useState<boolean>(false)
    const timeout = useRef<NodeJS.Timeout | null>(null);
    if (!localStorage.getItem('currentUser')) {
        navigate('/manage-profile-page')
    }

    useEffect(() => {
        const optionUser = $('.options-user')
        if (optionUser) {
            if (hover === true) {
                clearTimeout(timeout.current!)
                optionUser.css('display', 'flex')
                timeout.current = setTimeout(() => { optionUser.css('opacity', '1') }, 200)
            } else {
                clearTimeout(timeout.current!)
                optionUser.css('opacity', '0')
                timeout.current = setTimeout(() => { optionUser.css('display', 'none') }, 200)
            }
        }
    }, [hover])

    window.onclick = (e) => {
        const target = e.target as HTMLElement
        const isAvatarWrapper = target?.classList.contains('avatar-wrapper');
        const iUserItem = target?.classList.contains('user-item');
        const isAvatarUser = target?.classList.contains('avatar-user-img');
        const isUserName = target?.classList.contains('user-name');
        const isAvatar = target?.classList.contains('avatar-img');
        if (!isAvatar && !iUserItem && !isAvatarWrapper && !isAvatarUser && !isUserName) {
            setHover(false)
        }
    }

    const handleSignOut = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('currentUser')
        window.location.reload()
    }

    const handleChangeUser = (name: string) => {
        localStorage.setItem('currentUser', JSON.stringify(name))
        window.location.reload()
    }

    const handleNavigateManageProfile = () => {
        localStorage.removeItem('currentUser')
        navigate('/manage-profile-page')
    }

    return (
        <header id='private-header' className='col-lg-12'>
            <div className="col-lg-7 logo-menu">
                <div className='logo-menu__logo col-lg-2'>
                    <img src={Qiflix} width={'80%'} />
                </div>
                <div className="logo-menu__menu col-lg-5">
                    <div className="menu__menu-item">
                        Home
                    </div>
                    <div className="menu__menu-item">
                        Home
                    </div>
                    <div className="menu__menu-item">
                        Home
                    </div>
                    <div className="menu__menu-item">
                        Home
                    </div>
                    <div className="menu__menu-item">
                        Home
                    </div>
                </div>
            </div>
            <div className="col-lg-2 user-notify-search">
                <i className='bx bx-search' ></i>
                <i className='bx bx-bell' ></i>
                <div className='avatar-wrapper'>
                    <div className="avatar">
                        <img onClick={() => setHover(!hover)} className='avatar-img' src={currentUser?.avatar} width={'100%'} />
                    </div>
                    <div className='options-user'>
                        {users.map((user, index) => {
                            return (
                                <div onClick={() => handleChangeUser(user.name)} key={index} className='user-item'>
                                    <div className='avatar-user'>
                                        <img width={'100%'} src={user.avatar} className='avatar-user-img' />
                                    </div>
                                    <span className='user-name'>{user.name}</span>
                                </div>
                            )
                        })}
                        <div className='user-item' onClick={() => handleNavigateManageProfile()}>
                            <div className='avatar-user'>
                                <i style={{ fontSize: '30px' }} className="fa-regular fa-pen-to-square"></i>
                            </div>
                            <span className='user-name'>Manage Profiles</span>
                        </div>
                        <div className='user-item' onClick={() => handleSignOut()}>
                            <div className='avatar-user'>
                                <i className='bx bx-log-out-circle'></i>
                            </div>
                            <span className='user-name'>Sign Out</span>
                        </div>
                    </div>
                </div>

            </div>
        </header>
    )
}

export default PrivateHeader
