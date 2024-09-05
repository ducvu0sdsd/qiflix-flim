
import React, { useContext, useEffect, useRef, useState } from 'react'
import './myAccountPage.scss'
import PrivateHeader from '../../Components/PrivateHeader'
import { ThemeContext } from '../../Components/Context'
import Footer from '../../Components/Footer'
import { motion } from 'framer-motion'
import { Link, useNavigate, useNavigation } from 'react-router-dom'
import { Input } from '@material-tailwind/react'
import { AccountInterface, UserInterface } from '../../Components/Context/interfaces'
import { apiUser, TypeHTTP } from '../../Utils/api'
import { NotificationStatus } from '../../Components/Notification'

const MyAccountPage = () => {
    const navigate = useNavigate()
    const { datas, handles } = useContext(ThemeContext) || {}
    const [account, setAccount] = useState<AccountInterface | undefined>()

    useEffect(() => {
        if (datas?.account) {
            setAccount(datas.account)
        }
    }, [datas?.account])

    const handleUpdate = () => {
        apiUser({ path: `/accounts/${account?._id}`, type: TypeHTTP.PUT, body: account })
            .then(res => {
                console.log(res)
                handles?.handleSetNotification({ type: NotificationStatus.SUCCESS, message: 'Update Successfully' })
            })
    }

    return (
        <motion.section
            initial={{ x: window.innerWidth * -1 }}
            animate={{ x: 0 }}
            exit={{ x: window.innerWidth, transition: { duration: 0.2 } }}
        >
            <PrivateHeader users={datas?.users || []} currentUser={datas?.currentUser} />
            <section id='my-account-page'>
                <div className="section__body col-lg-12">
                    {datas?.users.map((user, item) => {
                        return (
                            <div onClick={() => navigate('/manage-profile-page')} className='image-user'>
                                <img src={user.avatar} />
                                <span>{user.name}</span>
                            </div>
                        )
                    })}
                </div>

                <div className="section__information col-lg-12">
                    <input onChange={e => setAccount(account ? { ...account, fullname: e.target.value } : account)} value={account?.fullname} type="text" className="form-control" placeholder="Account Owner" />
                    <input onChange={e => setAccount(account ? { ...account, email: e.target.value } : account)} value={account?.email} type="text" className="form-control" placeholder="Email Address" />
                    <input onChange={e => setAccount(account ? { ...account, phone: e.target.value } : account)} value={account?.phone} type="text" className="form-control" placeholder="Phone" />
                    <input onChange={e => setAccount(account ? { ...account, address: e.target.value } : account)} value={account?.address} type="text" className="form-control" placeholder="Address" />
                    <div></div>
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <button onClick={() => handleUpdate()}>Update</button>
                    </div>
                </div>
            </section>
            <Footer />
        </motion.section>
    )
}

export default MyAccountPage