
import React, { useContext, useEffect, useState } from 'react'
import PrivateHeader from '../../Components/PrivateHeader'
import TypicalSection from '../../Components/TypicalSection'
import ListFilm from '../../Components/ListFilm'
import Footer from '../../Components/Footer'
import { ThemeContext, ThemeData, ThemeHandles } from '../../Components/Context'
import { useParams } from 'react-router-dom'
import { UserInterface } from '../../Components/Context/interfaces'

const HomePage = () => {

    const { datas, handles } = useContext(ThemeContext) || {}
    return (
        <>
            <PrivateHeader users={datas?.users || []} currentUser={datas?.currentUser} />
            <TypicalSection movies={datas?.movies || []} />
            <ListFilm movies={datas?.movies || []} />
            <Footer />
        </>
    )
}

export default HomePage
