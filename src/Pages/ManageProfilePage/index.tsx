
import React, { useContext, useEffect, useRef, useState } from 'react'
import './manageprofilepage.scss'
import { Link, useNavigate } from 'react-router-dom'
import Qiflix from '../../resources/qiflix.png'
import $ from 'jquery'
import axios from 'axios'
import { TypeHTTP, apiUser } from '../../Utils/api'
import { ThemeContext } from '../../Components/Context'
import { UserInterface } from '../../Components/Context/interfaces'
import { motion } from 'framer-motion'
import { NotificationStatus } from '../../Components/Notification'
import FormHandlePin, { TypeFormPin } from './components/FormHandlePin'

enum Screen {
    LIST_USERS = 'list_user',
    CREATE_USER = 'create_user',
    UPDATE_USER = 'update_user'
}

const ManageProfilePage = () => {
    const navigate = useNavigate()
    const fileRefCreate = useRef<HTMLInputElement | null>(null);
    const fileRefUpdate = useRef<HTMLInputElement | null>(null);
    const [screen, setScreen] = useState<Screen>(Screen.LIST_USERS);
    const [name, setName] = useState<string>('')
    const [gender, setGender] = useState('');
    const [pin, setPin] = useState<string>('')
    const [avatarCreate, setAvatarCreate] = useState<string>('https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg')
    const [avatarUpdate, setAvatarUpdate] = useState<string>('https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg')
    const { datas, handles } = useContext(ThemeContext) || {}
    const [currentUser, setCurrentUser] = useState<UserInterface>()
    const [loadingComplete, setLoadingComplete] = useState<boolean>(false)
    const [statusFormPin, setStatusFormPin] = useState<{ display: boolean, type: TypeFormPin }>({ display: false, type: TypeFormPin.NONE })

    useEffect(() => {
        handles?.setLoaded(!datas?.loaded)
    }, [])

    useEffect(() => {
        if (!statusFormPin.display) {
            $('body').css('overflow', 'auto')
        }
    }, [statusFormPin.display])

    useEffect(() => {
        $('.txt-profile-name-update').val(currentUser?.name)
        setGender(currentUser?.gender || '')
        setName(currentUser?.name || '')
        setAvatarUpdate(currentUser?.avatar || '')
        setPin(currentUser?.pin || '')
    }, [currentUser])

    const titleElement = document.querySelector('head title');
    if (titleElement) {
        titleElement.textContent = "Manage Profile";
    }

    const handleUpdateAvatarClick = (type: string) => {
        if (type === 'create') {
            fileRefCreate.current?.click()
        }
        else {
            fileRefUpdate.current?.click()
        }
    }

    const handleChangeImage = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = function () {
                if (reader.result) {
                    setAvatarCreate(reader.result.toString());
                }
            };
            reader.readAsDataURL(file);
        }
    }

    const handleChangeImageUpdate = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = function () {
                if (reader.result) {
                    setAvatarUpdate(reader.result.toString());
                }
            };
            reader.readAsDataURL(file);
        }
    }

    const handleSubmitCreate = () => {
        if (!loadingComplete) {
            if (!/(^[A-ZÀ-Ỹ]{1}[a-zà-ỹ]+)(\s[A-ZÀ-Ỹ][a-zà-ỹ]+){0,}$/.test(name)) {
                handles?.handleSetNotification({ type: NotificationStatus.WARNING, message: 'The name must be as Vu Tien Duc' })
                return
            }
            if (gender === '') {
                handles?.handleSetNotification({ type: NotificationStatus.WARNING, message: 'Please choose gender' })
                return
            }
            apiUser({ type: TypeHTTP.POST, body: { name, gender, avatar: avatarCreate, account_id: datas?.account?._id, pin: pin }, path: '/users' })
                .then((result) => {
                    handles?.handleSetNotification({ type: NotificationStatus.SUCCESS, message: 'Successful Create User "' + name + '"' })
                    window.location.reload()
                })
        }

    }

    const handleDeleteUser = () => {
        apiUser({ type: TypeHTTP.DELETE, path: `/users/${currentUser?._id}` })
            .then(result => {
                handles?.setUsers(prev => {
                    return prev?.filter(item => item._id !== result._id)
                })
                setScreen(Screen.LIST_USERS)
            })
    }

    const handleSetCurrentUser = (name: string, pin: string) => {
        localStorage.setItem('currentUser', JSON.stringify(name))
        const json = localStorage.getItem('currentUser')
        const username = json && JSON.parse(json)
        if (username) {
            if (pin !== '') {
                setStatusFormPin({ display: true, type: TypeFormPin.CONFIRM })
            } else {
                navigate('/home-page')
            }
        }
    }

    const handleSubmitUpdate = () => {
        if (!loadingComplete) {
            if (!/(^[A-ZÀ-Ỹ]{1}[a-zà-ỹ]+)(\s[A-ZÀ-Ỹ][a-zà-ỹ]+){0,}$/.test(name)) {
                handles?.handleSetNotification({ type: NotificationStatus.WARNING, message: 'The name must be as Vu Tien Duc' })
                return
            }
            if (gender === '') {
                handles?.handleSetNotification({ type: NotificationStatus.WARNING, message: 'Please choose gender' })
                return
            }
            apiUser({ type: TypeHTTP.PUT, body: { name, gender, avatar: avatarUpdate, account_id: datas?.account?._id, pin: pin }, path: `/users/${currentUser?._id}` })
                .then((result) => {
                    handles?.handleSetNotification({ type: NotificationStatus.SUCCESS, message: 'Successful Update User "' + name + '"' })
                    window.location.reload()
                })
        }
    }

    return (
        <motion.section
            initial={{ x: window.innerWidth * -1 }}
            animate={{ x: 0 }}
            exit={{ x: window.innerWidth, transition: { duration: 0.2 } }}
            id='manage-profile-page' className='col-lg-12' style={{ minHeight: `${window.innerHeight}px` }}>
            <img className='logo' src={Qiflix} width={'150px'} />
            {statusFormPin.display && <FormHandlePin pin={pin} setPin={setPin} setStatusFormPin={setStatusFormPin} type={statusFormPin.type} />}
            {screen === Screen.LIST_USERS ? (
                <>
                    <h3>Manage Profiles</h3>
                    {datas?.loadedUsers ?
                        <div className='profiles'>
                            {datas?.users?.map((user, index) => (
                                <div key={index} className='profile__parent'>
                                    <div onClick={() => { handleSetCurrentUser(user.name, user.pin || ''); setPin(user.pin || '') }} className="profile__child">
                                        <img src={user.avatar} width={'100%'} />
                                    </div>
                                    <div onClick={() => { setScreen(Screen.UPDATE_USER); setCurrentUser(user) }} className="update-profile">
                                        <i className='bx bx-pencil'></i>
                                    </div>
                                    <p>{user.name}</p>
                                </div>
                            ))}
                            <div onClick={() => { setScreen(Screen.CREATE_USER); setCurrentUser(undefined) }} className="profile__child">
                                <i className='bx bx-plus'></i>
                            </div>
                        </div>
                        :
                        <div className='profiles'>
                            <div className="spinner-border text-light" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    }
                </>
            ) : screen === Screen.CREATE_USER ? (
                <>
                    <h3 style={{ transform: window.innerWidth < 600 ? 'translateY(120px)' : 'translateY(0px)' }}>Create Profile</h3>
                    <div className='create-form col-lg-4'>
                        <div className='create-form__avatar col-lg-5'>
                            <div className='avatar col-lg-10'>
                                <img width={'100%'} src={avatarCreate} />
                            </div>
                            <div onClick={() => handleUpdateAvatarClick('create')} className="update-avatar">
                                <i className='bx bx-pencil'></i>
                            </div>
                            <input onChange={handleChangeImage} accept=".png, .jpg, .jpeg" className='file' type='file' ref={fileRefCreate} />
                        </div>
                        <div className='create-form__inputs col-lg-7'>
                            <div className="form-input col-lg-12">
                                <label>Profile Name *</label>
                                <input type='text' onChange={(e) => setName(e.target.value.toString())} className='txt-profile-name col-lg-10' />
                            </div>
                            <div className="form-input col-lg-12">
                                <label>Gender *</label>
                                <div className='radios'>
                                    <div className='radio-item'><input onChange={e => setGender(e.target.value)} type='radio' name='gender' value='male' /> Male</div>
                                    <div className='radio-item'><input onChange={e => setGender(e.target.value)} type='radio' name='gender' value='female' /> Female</div>
                                    <div className='radio-item'><input onChange={e => setGender(e.target.value)} type='radio' name='gender' value='other' /> Other</div>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-12 create-form__pins'>
                            <div className='col-lg-12 pin'>
                                {pin === '' ?
                                    <>
                                        <span className='col-lg-10'>Create Pin <span style={{ fontWeight: '500' }}>(When creating a pin code, the user will enter 4 numeric characters)</span></span>
                                        <button
                                            onClick={() => setStatusFormPin({ display: true, type: TypeFormPin.CREATE })}
                                            style={{ backgroundColor: 'green' }}>Create</button>
                                    </>
                                    :
                                    <>
                                        <span className='col-lg-10'>Created Pin <span style={{ fontWeight: '500' }}>(Create Pin Successful)</span></span>
                                        <button
                                            onClick={() => setStatusFormPin({ display: true, type: TypeFormPin.UPDATE })}
                                            style={{ backgroundColor: 'blue' }}>Update</button>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                    <div style={{ transform: window.innerWidth < 600 ? 'translateY(-150px)' : 'translateY(0px)' }} className='btns col-lg-4'>
                        <button onClick={() => setScreen(Screen.LIST_USERS)} >Cancel</button>
                        <button onClick={handleSubmitCreate} style={{ backgroundColor: 'white', color: 'black' }}>{loadingComplete ? <div className="spinner-border text-light" role="status" /> : <>Complete</>}</button>
                    </div>
                </>
            ) : (
                <>
                    <h3 style={{ transform: window.innerWidth < 600 ? 'translateY(120px)' : 'translateY(0px)' }}>Update Profile</h3>
                    <div className='create-form col-lg-4'>
                        <div className='create-form__avatar col-lg-5'>
                            <div className='avatar col-lg-10'>
                                <img width={'100%'} src={avatarUpdate} />
                            </div>
                            <div onClick={() => handleUpdateAvatarClick('update')} className="update-avatar">
                                <i className='bx bx-pencil'></i>
                            </div>
                            <input onChange={handleChangeImageUpdate} accept=".png, .jpg, .jpeg" className='file' type='file' ref={fileRefUpdate} />
                        </div>
                        <div className='create-form__inputs col-lg-7'>
                            <div className="form-input col-lg-12">
                                <label>Profile Name *</label>
                                <input type='text' onChange={(e) => setName(e.target.value.toString())} className='txt-profile-name-update col-lg-10' />
                            </div>
                            <div className="form-input col-lg-12">
                                <label>Gender *</label>
                                <div className='radios'>
                                    <div className='radio-item'><input checked={gender === 'male'} onChange={(e) => setGender(e.target.value)} type='radio' name='gender' value='male' /> Male</div>
                                    <div className='radio-item'><input checked={gender === 'female'} onChange={(e) => setGender(e.target.value)} type='radio' name='gender' value='female' /> Female</div>
                                    <div className='radio-item'><input checked={gender === 'other'} onChange={(e) => setGender(e.target.value)} type='radio' name='gender' value='other' /> Other</div>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-12 create-form__pins'>
                            <div className='col-lg-12 pin'>
                                {pin === '' ?
                                    <>
                                        <span className='col-lg-10'>Create Pin <span style={{ fontWeight: '500' }}>(When creating a pin code, the user will enter 4 numeric characters)</span></span>
                                        <button
                                            onClick={() => setStatusFormPin({ display: true, type: TypeFormPin.CREATE })}
                                            style={{ backgroundColor: 'green' }}>Create</button>
                                    </>
                                    :
                                    <>
                                        <span className='col-lg-10'>Created Pin <span style={{ fontWeight: '500' }}>(Create Pin Successful)</span></span>
                                        <button
                                            onClick={() => setStatusFormPin({ display: true, type: TypeFormPin.UPDATE })}
                                            style={{ backgroundColor: 'blue' }}>Update</button>
                                    </>
                                }
                            </div>
                            {pin !== '' ?
                                <>
                                    <div className='col-lg-12 pin'>
                                        <span>Remove Pin</span>
                                        <button onClick={() => setStatusFormPin({ display: true, type: TypeFormPin.DELETE })}>Remove</button>
                                    </div>
                                </>
                                :
                                <>
                                </>
                            }
                        </div>
                    </div>
                    <div style={{ transform: window.innerWidth < 600 ? 'translateY(-180px)' : 'translateY(0px)' }} className='col-lg-4 delete-user'>
                        <span>Delete User</span>
                        <button onClick={() => handleDeleteUser()}>Delete</button>
                    </div>
                    <div style={{ transform: window.innerWidth < 600 ? 'translateY(-205px)' : 'translateY(0px)' }} className='btns col-lg-4'>
                        <button onClick={() => setScreen(Screen.LIST_USERS)}>Cancel</button>
                        <button onClick={handleSubmitUpdate} style={{ backgroundColor: 'white', color: 'black' }}>Complete</button>
                    </div>
                </>
            )}
        </motion.section>
    )
}

export default ManageProfilePage