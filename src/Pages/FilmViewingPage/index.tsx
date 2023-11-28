
import Footer from '../../Components/Footer'
import PrivateHeader from '../../Components/PrivateHeader'
import Informations from './components/Infomations'
import View from './components/View'
import './filmviewingpage.scss'
import React, { useEffect, useState } from 'react'
import { datas } from '../../data'

const FilmViewingPage = () => {

    const currentFilm = datas[0]
    const [currentEpisode, setCurrentEpisode] = useState<number>(1)

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [currentEpisode])

    return (
        <>
            <View title={currentFilm.title} url={currentFilm.videosURL[currentEpisode - 1].url} name={currentFilm.videosURL[currentEpisode - 1].name} />
            <Informations currentEpisode={currentEpisode} currentFilm={currentFilm} setCurrentEpisode={setCurrentEpisode} />
            <Footer />
        </>
    )
}

export default FilmViewingPage
