
import React from 'react'
import './privateheader.scss'
import Qiflix from '../../resources/qiflix.png'

const PrivateHeader = () => {
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
                <div className="avatar">
                    <img src='https://www.rainforest-alliance.org/wp-content/uploads/2021/06/jaguar-square-1-400x400.jpg.optimal.jpg' width={'100%'} />
                </div>
            </div>
        </header>
    )
}

export default PrivateHeader
