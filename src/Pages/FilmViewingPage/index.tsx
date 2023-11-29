
import Footer from '../../Components/Footer'
import PrivateHeader from '../../Components/PrivateHeader'
import Informations from './components/Infomations'
import View from './components/View'
import './filmviewingpage.scss'
import React, { useEffect, useState } from 'react'
import { DataType } from '../../data'
interface FilmViewingPageProp {
    data: DataType
}

const FilmViewingPage = ({ data }: FilmViewingPageProp) => {

    const currentFilm = data
    const [currentEpisode, setCurrentEpisode] = useState<number>(1)

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [currentEpisode])

    return (
        <>
            <View currentEpisode={currentEpisode} numberOfEpisode={data.videosURL.length} setCurrentEpisode={setCurrentEpisode} title={currentFilm.title} url={currentFilm.videosURL[currentEpisode - 1].url} name={currentFilm.videosURL[currentEpisode - 1].name} />
            <Informations currentEpisode={currentEpisode} currentFilm={currentFilm} setCurrentEpisode={setCurrentEpisode} />
            <Footer />
        </>
    )
}

export default FilmViewingPage
