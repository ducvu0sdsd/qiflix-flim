import React, { useContext, useEffect } from 'react'
import PrivateHeader from '../../Components/PrivateHeader'
import Footer from '../../Components/Footer'
import { ThemeContext } from '../../Components/Context'
import Movies from './components/TVShow'

const MoviesPage = () => {

    const { datas, handles } = useContext(ThemeContext) || {}

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    return (
        <>
            <PrivateHeader users={datas?.users || []} currentUser={datas?.currentUser} />
            <Movies />
            <Footer />
        </>
    )
}

export default MoviesPage
