
import React from 'react'
import PrivateHeader from '../../Components/PrivateHeader'
import TypicalSection from '../../Components/TypicalSection'
import ListFilm from '../../Components/ListFilm'
import Footer from '../../Components/Footer'

const HomePage = () => {
    return (
        <>
            <PrivateHeader />
            <TypicalSection />
            <ListFilm />
            <Footer />
        </>
    )
}

export default HomePage
