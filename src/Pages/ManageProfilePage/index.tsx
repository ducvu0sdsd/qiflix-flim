
import React, { useRef, useState } from 'react'
import './manageprofilepage.scss'
import { Link } from 'react-router-dom'
import Qiflix from '../../resources/qiflix.png'

enum Screen {
    LIST_USERS = 'list_user',
    CREATE_USER = 'create_user',
    UPDATE_USER = 'update_user'
}

const ManageProfilePage = () => {
    const fileRefCreate = useRef<HTMLInputElement | null>(null);
    const [screen, setScreen] = useState<Screen>(Screen.LIST_USERS);

    const handleUpdateAvatarClick = () => {
        fileRefCreate.current?.click()
    }

    return (
        <section id='manage-profile-page' className='col-lg-12' style={{ height: `${window.innerHeight}px` }}>
            <img className='logo' src={Qiflix} width={'150px'} />
            {screen === Screen.LIST_USERS ? (
                <>
                    <h2>Manage Profiles</h2>
                    <div className='profiles'>
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
                                <img width={'100%'} src='https://www.rainforest-alliance.org/wp-content/uploads/2021/06/jaguar-square-1-400x400.jpg.optimal.jpg' />
                            </div>
                            <div onClick={handleUpdateAvatarClick} className="update-avatar">
                                <i className='bx bx-pencil'></i>
                            </div>
                            <input className='file' type='file' ref={fileRefCreate} />
                        </div>
                        <div className='create-form__inputs col-lg-7'>
                            <div className="form-input col-lg-12">
                                <label>Profile Name *</label>
                                <input type='text' className='txt-profile-name col-lg-10' />
                            </div>
                            <div className="form-input col-lg-12">
                                <label>Gender *</label>
                                <div className='radios'>
                                    <div className='radio-item'><input type='radio' name='gender' value='male' /> Male</div>
                                    <div className='radio-item'><input type='radio' name='gender' value='female' /> Female</div>
                                    <div className='radio-item'><input type='radio' name='gender' value='other' /> Other</div>
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
                        <button style={{ backgroundColor: 'white', color: 'black' }}>Complete</button>
                    </div>
                </>
            ) : (
                <>
                    <h2>Update Profile</h2>
                    <div className='create-form col-lg-5'>
                        <div className='create-form__avatar col-lg-5'>
                            <div className='avatar col-lg-10'>
                                <img width={'100%'} src='https://www.rainforest-alliance.org/wp-content/uploads/2021/06/jaguar-square-1-400x400.jpg.optimal.jpg' />
                            </div>
                            <div className="update-avatar">
                                <i className='bx bx-pencil'></i>
                            </div>
                            <input type='file' />
                        </div>
                        <div className='create-form__inputs col-lg-7'>
                            <div className="form-input col-lg-12">
                                <label>Profile Name *</label>
                                <input type='text' className='txt-profile-name col-lg-10' />
                            </div>
                            <div className="form-input col-lg-12">
                                <label>Gender *</label>
                                <div className='radios'>
                                    <div className='radio-item'><input type='radio' name='gender' value='male' /> Male</div>
                                    <div className='radio-item'><input type='radio' name='gender' value='female' /> Female</div>
                                    <div className='radio-item'><input type='radio' name='gender' value='other' /> Other</div>
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
                        <button>Delete</button>
                    </div>
                    <div className='btns col-lg-5'>
                        <button >Cancel</button>
                        <button style={{ backgroundColor: 'white', color: 'black' }}>Complete</button>
                    </div>
                </>
            )}
        </section>
    )
}

export default ManageProfilePage


{/* <Link to={'/home-page'}>
                    <div className="profile__child">
                        <img src='https://www.rainforest-alliance.org/wp-content/uploads/2021/06/jaguar-square-1-400x400.jpg.optimal.jpg' width={'100%'} />
                    </div>
                </Link> */}