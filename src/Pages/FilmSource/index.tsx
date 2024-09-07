
import Footer from '../../Components/Footer'
import PrivateHeader from '../../Components/PrivateHeader'
import Informations from '../FilmViewingPage/components/Infomations'
import View from '../FilmViewingPage/components/View'
import '../FilmViewingPage'
import React, { useContext, useEffect, useState } from 'react'
import { MovieInterface, SubtitleInterface, UserInterface, WatchingInterface } from '../../Components/Context/interfaces'
import Comments from '../FilmViewingPage/components/Comments'
import { useLocation } from 'react-router-dom'
import { TypeHTTP, apiUser } from '../../Utils/api'
import { ThemeContext } from '../../Components/Context'
import { motion } from 'framer-motion'
import Phone from '../../resources/phone.gif'
interface FilmViewingPageProp {
    data: MovieInterface,
    currentUser: UserInterface | undefined
}

const FilmSource = ({ data, currentUser }: FilmViewingPageProp) => {

    const [currentSubtitles, setCurrentSubtitles] = useState<SubtitleInterface[]>([])
    const { pathname } = useLocation()
    const { datas } = useContext(ThemeContext) || {}
    const [width, setWidth] = useState<number>(0)
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const currentEpisode: number = Number(queryParams.get('currentEpisode'));
    const bufferTime = Number(queryParams.get('bufferTime'));


    const titleElement = document.querySelector('head title');
    if (titleElement) {
        titleElement.textContent = data.title;
    }

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'auto'
        });
    }, [currentEpisode, pathname])



    useEffect(() => {
        apiUser({ path: `/subtitles/${data._id}`, type: TypeHTTP.GET })
            .then(res => {
                setCurrentSubtitles(res)
            })
    }, [])

    useEffect(() => {
        setInterval(() => {
            setWidth(window.innerWidth)
        }, 1)
    }, [])

    return (
        <motion.div
            initial={{ x: window.innerWidth * -1 }}
            animate={{ x: 0 }}
            exit={{ x: window.innerWidth, transition: { duration: 0.2 } }}
        >
            {/* {width >= 600 ?
                <>
                    <View setBufferTime={setBufferTime} setCurrentEpisode={setCurrentEpisode} currentUser={currentUser || undefined} currentSubtitles={currentSubtitles} currentEpisode={currentEpisode || 1} currentTime={bufferTime || 0} currentMovie={data} />
                    <Informations currentEpisode={currentEpisode || 1} currentFilm={data} currentUser={currentUser || undefined} setCurrentEpisode={setCurrentEpisode} setBufferTime={setBufferTime} />
                    <Comments movie_id={data._id} user_id={currentUser?._id || ''} user_avatar={currentUser?.avatar || ''} />
                    <Footer />
                </> :
                <div className='col-lg-12' style={{ height: `${window.innerHeight}px`, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <img src={Phone} width={'50%'} />
                    <p style={{ color: 'white' }}>Please rotate your phone screen horizontally</p>
                </div>
            } */}
            <>
                <View setBufferTime={() => { }} setCurrentEpisode={() => { }} type='source' currentUser={currentUser || undefined} currentSubtitles={currentSubtitles} currentEpisode={currentEpisode || 1} currentTime={bufferTime || 0} currentMovie={data} />
                {/* <div style={{ backgroundColor: 'black', width: '100%', height: '200px' }}>

                </div> */}
            </>
        </motion.div>
    )
}

export default FilmSource
