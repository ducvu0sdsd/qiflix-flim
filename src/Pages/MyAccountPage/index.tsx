
import React, { useContext } from 'react'
import './myAccountPage.scss'
import PrivateHeader from '../../Components/PrivateHeader'
import { ThemeContext } from '../../Components/Context'
import Footer from '../../Components/Footer'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const MyAccountPage = () => {

    const { datas, handles } = useContext(ThemeContext) || {}

    return (
        <motion.section
            initial={{ x: window.innerWidth * -1 }}
            animate={{ x: 0 }}
            exit={{ x: window.innerWidth, transition: { duration: 0.2 } }}
        >
            <PrivateHeader users={datas?.users || []} currentUser={datas?.currentUser} />
            <section id='my-account-page'>
                <div className='section__header'>
                    <h1>My Account</h1>
                </div>
                <div className="section__body col-lg-12">
                    <h2 className='col-lg-3'>Account Information</h2>
                    <div className="card-profile col-lg-7">
                        <div className='card-profile-item col-lg-12'>
                            <p><b>Account Owner : </b>{datas?.account?.fullname}</p><button>Change Name</button>
                        </div>
                        <div className='card-profile-item col-lg-12'>
                            <p><b>Email Address : </b>{datas?.account?.email}</p>
                        </div>
                        <div className='card-profile-item col-lg-12'>
                            <p><b>Phone : </b>{datas?.account?.phone}</p><button>Change Phone</button>
                        </div>
                        <div className='card-profile-item col-lg-12'>
                            <p><b>Address : </b>{datas?.account?.address}</p><button>Change Address</button>
                        </div>
                        <div className='card-profile-item col-lg-12'>
                            <p><b>Password : </b>******</p><button>Change Password</button>
                        </div>
                    </div>
                </div>
                <div className="section__body col-lg-12">
                    <h2 className='col-lg-3'>Users Management</h2>
                    <div className="card-profile-item col-lg-7">
                        <div className='imgs col-lg-9'>
                            {datas?.users.map((user, item) => {
                                return (
                                    <div className='image-user'>
                                        <img width={'100%'} src={user.avatar} />
                                    </div>
                                )
                            })}
                        </div>
                        <Link className='link' to={'/manage-profile-page'}><button>Edit Users</button></Link>
                    </div>
                </div>
            </section>
            <Footer />
        </motion.section>
    )
}

export default MyAccountPage