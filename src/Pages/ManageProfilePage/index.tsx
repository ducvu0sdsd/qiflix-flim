
import React from 'react'
import './manageprofilepage.scss'
import { Link } from 'react-router-dom'

const ManageProfilePage = () => {
    return (
        <section id='manage-profile-page' className='col-lg-12' style={{ height: `${window.innerHeight}px` }}>
            <h1>Manage Profiles</h1>
            <div className='profiles'>
                <Link to={'/home-page'}>
                    <div className="profile__child">
                        <img src='https://www.rainforest-alliance.org/wp-content/uploads/2021/06/jaguar-square-1-400x400.jpg.optimal.jpg' width={'100%'} />
                    </div>
                </Link>
                <div className="profile__child">
                    <img src='https://www.rainforest-alliance.org/wp-content/uploads/2021/06/jaguar-square-1-400x400.jpg.optimal.jpg' width={'100%'} />
                </div>
                <div className="profile__child">
                    <img src='https://www.rainforest-alliance.org/wp-content/uploads/2021/06/jaguar-square-1-400x400.jpg.optimal.jpg' width={'100%'} />
                </div>
                <div className="profile__child">
                    <img src='https://www.rainforest-alliance.org/wp-content/uploads/2021/06/jaguar-square-1-400x400.jpg.optimal.jpg' width={'100%'} />
                </div>
                <div className="profile__child">
                    <i className='bx bx-plus'></i>
                </div>
            </div>
        </section>
    )
}

export default ManageProfilePage
