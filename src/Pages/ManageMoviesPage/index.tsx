
import React, { useContext } from 'react'
import PrivateHeader from '../../Components/PrivateHeader'
import { ThemeContext } from '../../Components/Context'
import Footer from '../../Components/Footer'
import ManageMovies from './components/ManageMovies'

const ManageMoviesPage = () => {

    const { datas, handles } = useContext(ThemeContext) || {}
    const titleElement = document.querySelector('head title');
    if (titleElement) {
        titleElement.textContent = "Manage Movies";
    }

    return (
        <>
            <PrivateHeader users={datas?.users || []} currentUser={datas?.currentUser} />
            <ManageMovies />
            <Footer />
        </>
    )
}

export default ManageMoviesPage
