
import Footer from '../../Components/Footer'
import PrivateHeader from '../../Components/PrivateHeader'
import Informations from './components/Infomations'
import View from './components/View'
import './filmviewingpage.scss'
import React, { useEffect, useState } from 'react'
import { MovieInterface } from '../../Components/Context/interfaces'
interface FilmViewingPageProp {
    data: MovieInterface
}

const FilmViewingPage = ({ data }: FilmViewingPageProp) => {
    const [currentEpisode, setCurrentEpisode] = useState<number>(1)

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [currentEpisode])

    return (
        <>
            <View currentEpisode={currentEpisode} numberOfEpisode={data.listEpisode?.numberOfEpisodes || 0} setCurrentEpisode={setCurrentEpisode} title={data.title} url={data.listEpisode?.episodes[currentEpisode - 1].url || ''} name={data.listEpisode?.episodes[currentEpisode - 1].name || '  '} />
            <Informations currentEpisode={currentEpisode} currentFilm={data} setCurrentEpisode={setCurrentEpisode} />
            <Footer />
        </>
    )
}

export default FilmViewingPage
