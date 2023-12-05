import React, { useContext, useEffect } from 'react'
import PrivateHeader from '../../Components/PrivateHeader'
import Footer from '../../Components/Footer'
import { ThemeContext } from '../../Components/Context'
import MyList from './components/MyList'

const MyListPage = () => {

    const { datas, handles } = useContext(ThemeContext) || {}

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    return (
        <>
            <PrivateHeader users={datas?.users || []} currentUser={datas?.currentUser} />
            <MyList />
            <Footer />
        </>
    )
}

export default MyListPage
