
import Footer from '../../Components/Footer'
import PrivateHeader from '../../Components/PrivateHeader'
import Informations from './components/Infomations'
import View from './components/View'
import './filmviewingpage.scss'
import React, { useEffect, useState } from 'react'
import { MovieInterface, UserInterface, WatchingInterface } from '../../Components/Context/interfaces'
interface FilmViewingPageProp {
    data: MovieInterface,
    currentUser: UserInterface | undefined
}

const FilmViewingPage = ({ data, currentUser }: FilmViewingPageProp) => {
    const [currentEpisode, setCurrentEpisode] = useState<number>(1)
    const [bufferTime, setBufferTime] = useState<number>(0)

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [currentEpisode])

    useEffect(() => {
        const watching = currentUser?.watching?.filter(item => item.movie_id === data._id)[0] || null
        if (watching) {
            setCurrentEpisode(watching.indexOfEpisode)
            setBufferTime(watching.currentTime)
        }
    }, [])


    return (
        <>
            <View currentTime={bufferTime} movie_id={data._id} user_id={currentUser?._id || ''} currentEpisode={currentEpisode} numberOfEpisode={data.listEpisode?.numberOfEpisodes || 0} setCurrentEpisode={setCurrentEpisode} title={data.title} url={data.listEpisode?.episodes[currentEpisode - 1].url || ''} name={data.listEpisode?.episodes[currentEpisode - 1].name || '  '} />
            <Informations currentEpisode={currentEpisode} currentFilm={data} setCurrentEpisode={setCurrentEpisode} />
            <Footer />
        </>
    )
}

export default FilmViewingPage
