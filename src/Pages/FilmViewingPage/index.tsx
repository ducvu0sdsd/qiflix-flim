
import Footer from '../../Components/Footer'
import PrivateHeader from '../../Components/PrivateHeader'
import Informations from './components/Infomations'
import View from './components/View'
import './filmviewingpage.scss'
import React, { useEffect, useState } from 'react'
import { MovieInterface, SubtitleInterface, UserInterface, WatchingInterface } from '../../Components/Context/interfaces'
import Comments from './components/Comments'
import { useLocation } from 'react-router-dom'
import { TypeHTTP, apiUser } from '../../Utils/api'
interface FilmViewingPageProp {
    data: MovieInterface,
    currentUser: UserInterface | undefined
}

const FilmViewingPage = ({ data, currentUser }: FilmViewingPageProp) => {
    const [currentEpisode, setCurrentEpisode] = useState<number>(1)
    const [bufferTime, setBufferTime] = useState<number>(0)
    const [currentSubtitles, setCurrentSubtitles] = useState<SubtitleInterface[]>([])
    const { pathname } = useLocation()

    const titleElement = document.querySelector('head title');
    if (titleElement) {
        titleElement.textContent = data.title;
    }

    useEffect(() => console.log(currentSubtitles), [currentSubtitles])


    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [currentEpisode, pathname])

    useEffect(() => {
        const watching = currentUser?.watching?.filter(item => item.movie_id === data._id)[0] || null
        if (watching) {
            setCurrentEpisode(watching.indexOfEpisode)
            setBufferTime(watching.currentTime)
        }
    }, [])

    useEffect(() => {
        apiUser({ path: `/subtitles/${data._id}`, type: TypeHTTP.GET })
            .then(res => {
                setCurrentSubtitles(res)
            })
    }, [])


    return (
        <>
            <View currentSubtitles={currentSubtitles} currentTime={bufferTime} movie_id={data._id} user_id={currentUser?._id || ''} currentEpisode={currentEpisode} numberOfEpisode={data.listEpisode?.numberOfEpisodes || 0} setCurrentEpisode={setCurrentEpisode} title={data.title} url={data.listEpisode?.episodes[currentEpisode - 1].url || ''} name={data.listEpisode?.episodes[currentEpisode - 1].name || ''} />
            <Informations currentEpisode={currentEpisode} currentFilm={data} currentUser={currentUser || undefined} setCurrentEpisode={setCurrentEpisode} />
            <Comments movie_id={data._id} user_id={currentUser?._id || ''} user_avatar={currentUser?.avatar || ''} />
            <Footer />
        </>
    )
}

export default FilmViewingPage
