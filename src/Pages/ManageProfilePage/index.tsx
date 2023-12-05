
import React, { useContext, useEffect, useRef, useState } from 'react'
import './manageprofilepage.scss'
import { Link, useNavigate } from 'react-router-dom'
import Qiflix from '../../resources/qiflix.png'
import $ from 'jquery'
import axios from 'axios'
import { TypeHTTP, apiUser } from '../../Utils/api'
import { ThemeContext } from '../../Components/Context'
import { UserInterface } from '../../Components/Context/interfaces'

enum Screen {
    LIST_USERS = 'list_user',
    CREATE_USER = 'create_user',
    UPDATE_USER = 'update_user'
}

const ManageProfilePage = () => {
    const navigate = useNavigate()
    const fileRefCreate = useRef<HTMLInputElement | null>(null);
    const [screen, setScreen] = useState<Screen>(Screen.LIST_USERS);
    const [name, setName] = useState<string>('')
    const [gender, setGender] = useState('');
    const [avatarCreate, setAvatarCreate] = useState<string>('https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg')
    const { datas, handles } = useContext(ThemeContext) || {}
    const [currentUser, setCurrentUser] = useState<UserInterface>()

    const titleElement = document.querySelector('head title');
    if (titleElement) {
        titleElement.textContent = "Manage Profile";
    }

    const handleUpdateAvatarClick = (type: string) => {
        if (type === 'create') {
            fileRefCreate.current?.click()
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

    const handleSubmitCreate = () => {
        if (!/(^[A-ZÀ-Ỹ]{1}[a-zà-ỹ]+)(\s[A-ZÀ-Ỹ][a-zà-ỹ]+){0,}$/.test(name)) {
            return
        }
        if (gender === '') {
            return
        }
        apiUser({ type: TypeHTTP.POST, body: { name, gender, avatar: avatarCreate, account_id: datas?.account?._id }, path: '/users' })
            .then((result) => {
                handles?.setUsers(prev => [...prev, result])
                setScreen(Screen.LIST_USERS)
            })
    }

    const handleDeleteUser = () => {
        apiUser({ type: TypeHTTP.DELETE, path: `/users/${currentUser?._id}` })
            .then(result => {
                handles?.setUsers(prev => {
                    return prev.filter(item => item._id !== result._id)
                })
                setScreen(Screen.LIST_USERS)
            })
    }

    const handleSetCurrentUser = (name: string) => {
        localStorage.setItem('currentUser', JSON.stringify(name))
        const json = localStorage.getItem('currentUser')
        const username = json && JSON.parse(json)
        if (username) {
            navigate('/home-page')
        }
    }

    return (
        <section id='manage-profile-page' className='col-lg-12' style={{ height: `${window.innerHeight}px` }}>
            <img className='logo' src={Qiflix} width={'150px'} />
            {screen === Screen.LIST_USERS ? (
                <>
                    <h2>Manage Profiles</h2>
                    <div className='profiles'>
                        {datas?.users?.map((user, index) => (
                            <div key={index} className='profile__parent'>
                                <div onClick={() => handleSetCurrentUser(user.name)} className="profile__child">
                                    <img src={user.avatar} width={'100%'} />
                                </div>
                                <div onClick={() => { setScreen(Screen.UPDATE_USER); setCurrentUser(user) }} className="update-profile">
                                    <i className='bx bx-pencil'></i>
                                </div>
                            </div>
                        ))}
                        <div onClick={() => setScreen(Screen.CREATE_USER)} className="profile__child">
                            <i className='bx bx-plus'></i>
                        </div>
                    </div>
                </>
            ) : screen === Screen.CREATE_USER ? (
                <>
                    <h2>Create Profile</h2>
                    <div className='create-form col-lg-5'>
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
                                <span className='col-lg-10'>Create Pin <span style={{ fontWeight: '500' }}>(When creating a pin code, the user will enter 4 numeric characters)</span></span>
                                <button style={{ backgroundColor: 'green' }}>Create</button>
                            </div>
                        </div>
                    </div>
                    <div className='btns col-lg-5'>
                        <button onClick={() => setScreen(Screen.LIST_USERS)} >Cancel</button>
                        <button onClick={handleSubmitCreate} style={{ backgroundColor: 'white', color: 'black' }}>Complete</button>
                    </div>
                </>
            ) : (
                <>
                    <h2>Update Profile</h2>
                    <div className='create-form col-lg-5'>
                        <div className='create-form__avatar col-lg-5'>
                            <div className='avatar col-lg-10'>
                                <img width={'100%'} src={currentUser?.avatar} />
                            </div>
                            <div className="update-avatar">
                                <i className='bx bx-pencil'></i>
                            </div>
                            <input onChange={handleChangeImage} accept=".png, .jpg, .jpeg" className='file' type='file' ref={fileRefCreate} />
                        </div>
                        <div className='create-form__inputs col-lg-7'>
                            <div className="form-input col-lg-12">
                                <label>Profile Name *</label>
                                <input type='text' className='txt-profile-name col-lg-10' />
                            </div>
                            <div className="form-input col-lg-12">
                                <label>Gender *</label>
                                <div className='radios'>
                                    <div className='radio-item'><input checked={currentUser?.gender === 'male'} onChange={(e) => setGender(e.target.value)} type='radio' name='gender' value='male' /> Male</div>
                                    <div className='radio-item'><input checked={currentUser?.gender === 'female'} onChange={(e) => setGender(e.target.value)} type='radio' name='gender' value='female' /> Female</div>
                                    <div className='radio-item'><input checked={currentUser?.gender === 'other'} onChange={(e) => setGender(e.target.value)} type='radio' name='gender' value='other' /> Other</div>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-12 create-form__pins'>
                            <div className='col-lg-12 pin'>
                                <span className='col-lg-10'>Create Pin <span style={{ fontWeight: '500' }}>(When creating a pin code, the user will enter 4 numeric characters)</span></span>
                                <button style={{ backgroundColor: 'green' }}>Create</button>
                            </div>
                            <div className='col-lg-12 pin'>
                                <span>Remove Pin</span>
                                <button disabled>Remove</button>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-5 delete-user'>
                        <span>Delete User</span>
                        <button onClick={() => handleDeleteUser()}>Delete</button>
                    </div>
                    <div className='btns col-lg-5'>
                        <button onClick={() => setScreen(Screen.LIST_USERS)}>Cancel</button>
                        <button style={{ backgroundColor: 'white', color: 'black' }}>Complete</button>
                    </div>
                </>
            )}
        </section>
    )
}

export default ManageProfilePage