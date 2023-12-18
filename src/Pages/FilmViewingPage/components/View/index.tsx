
import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player/lazy'
import { MovieInterface, SubtitleInterface, UserInterface } from '../../../../Components/Context/interfaces'
import './view.scss'
import Bottom from './Bottom'
import $ from 'jquery'
import { Link } from 'react-router-dom'
import { TypeHTTP, apiUser } from '../../../../Utils/api'

export interface ViewProps {

    currentMovie: MovieInterface
    currentEpisode: number,
    currentTime: number,
    currentSubtitles: SubtitleInterface[]
    currentUser: UserInterface | undefined
    setCurrentEpisode: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const View = ({ setCurrentEpisode, currentUser, currentEpisode, currentMovie, currentTime, currentSubtitles }: ViewProps) => {
    //ref
    const reactPlayerRef = useRef<ReactPlayer>(null);

    // state
    const [displayNextEpisode, setDisplayNextEpisode] = useState<boolean>(false)
    const [waitingUpdate, setWaitingUpdate] = useState<number>(100)
    const [openSubtitle, setOpenSubtitle] = useState<boolean>(currentSubtitles.length > 0)
    const [displayAction, setDisplayAction] = useState<boolean>(true)
    const [duration, setDuration] = useState<number>()
    const [playing, setPlaying] = useState<boolean>(true)
    const [played, setPlayed] = useState<number | undefined>(0)
    const [muted, setMuted] = useState<boolean>(false)
    const [subtitle, setSubtitle] = useState<string>('')
    const [fullScreen, setFullScreen] = useState<boolean>(false)

    useEffect(() => {
        setOpenSubtitle(currentSubtitles.length > 0)
    }, [currentSubtitles])

    const handleOnProgress = () => {
        setPlayed(reactPlayerRef.current?.getCurrentTime())
        if (currentSubtitles.length > 0) {
            let have = false
            currentSubtitles[0].subtitles.forEach(item => {
                if (reactPlayerRef.current?.getCurrentTime()) {
                    if (reactPlayerRef.current?.getCurrentTime() >= item.firstTime && reactPlayerRef.current?.getCurrentTime() < item.lastTime) {
                        setSubtitle(item.content)
                        have = true
                    }
                }
            })
            if (!have) {
                setSubtitle('')
            }
        }

        // handle display button next episode
        if (currentMovie.listEpisode && currentEpisode !== currentMovie.listEpisode.episodes.length) {
            if (currentMovie.listEpisode?.episodes.length > 0) {
                if (played && duration) {
                    if (played / duration >= 0.985) {
                        setDisplayNextEpisode(true)
                    } else {
                        setDisplayNextEpisode(false)
                    }
                } else {
                    setDisplayNextEpisode(false)
                }
            }
        }


        // Update Watching
        if (reactPlayerRef.current?.getCurrentTime() && duration && currentUser) {
            const watching = {
                movie_id: currentMovie._id,
                indexOfEpisode: currentEpisode,
                currentTime: reactPlayerRef.current?.getCurrentTime(),
                process: reactPlayerRef.current?.getCurrentTime() / duration
            }
            if (waitingUpdate === 0) {
                if (reactPlayerRef.current?.getCurrentTime() / duration > 0.95 && currentEpisode === currentMovie.listEpisode?.episodes.length) {
                    setWaitingUpdate(100)
                    apiUser({ path: `/users/delete-watching/${currentUser._id}`, body: watching, type: TypeHTTP.PUT })
                } else {
                    setWaitingUpdate(100)
                    apiUser({ path: `/users/update-watching/${currentUser._id}`, body: watching, type: TypeHTTP.PUT })
                }
            } else {
                setWaitingUpdate(prev => prev - 1)
            }
        }
    }

    useEffect(() => {
        const bottom = $('#video .bottom')
        const btnReturn = $('#video .btn-return')
        const btnShare = $('#video .btn-share')
        const bottomHeight = bottom.height()
        if (displayAction) {
            bottom.css('transform', `translateY(0px)`)
            btnReturn.css('transform', `translateY(0px)`)
            btnShare.css('transform', `translateY(0px)`)
        } else {
            btnReturn.css('transform', `translateY(-100px)`)
            btnShare.css('transform', `translateY(-100px)`)
            bottom.css('transform', `translateY(${bottomHeight}px)`)
        }
    }, [displayAction])

    const handlePlayOrPause = () => {
        if (playing) {
            setPlaying(false)
        } else {
            setPlaying(true)
        }
    }

    const handleChangeEpisode = () => {
        if (currentMovie.listEpisode?.episodes.length) {
            if (currentEpisode < currentMovie.listEpisode?.episodes.length) {
                const watching = {
                    movie_id: currentMovie._id,
                    indexOfEpisode: currentEpisode + 1,
                    currentTime: 0,
                    process: 0
                }
                if (currentUser) {
                    apiUser({ path: `/users/update-watching/${currentUser._id}`, body: watching, type: TypeHTTP.PUT })
                        .then(res => {
                            window.location.reload()
                        })
                }
            }
        }
    }


    return (
        <section style={{ height: `${window.innerHeight}px` }} id='video'>
            {!fullScreen && <>
                <Link className='link' to={'/home-page'}><i className='btn-return bx bx-left-arrow-alt'></i></Link>
                <i className='bx bx-share-alt btn-share' ></i>
            </>}
            <div onClick={handlePlayOrPause} className='wrapper-video'></div>
            <ReactPlayer
                ref={reactPlayerRef}
                width={'100%'}
                height={`${window.innerHeight}px`}
                controls={false}
                playing={playing}
                muted={muted}
                progressInterval={1}
                onStart={() => { reactPlayerRef.current?.seekTo(currentTime) }}
                onEnded={() => handleChangeEpisode()}
                onProgress={() => handleOnProgress()}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onDuration={() => setDuration(reactPlayerRef.current?.getDuration())}
                url={`${(currentMovie.listEpisode?.episodes[currentEpisode - 1].url && currentMovie.listEpisode.episodes[currentEpisode - 1].url.length <= 10) ? 'https://www.dailymotion.com/video/' : ''}` + currentMovie.listEpisode?.episodes[currentEpisode - 1].url}
            // url={'https://ok.ru/video/3149887441631'}
            // url={'https://aa.opstream6.com/20220324/5431_283b15c7/index.m3u8'}
            />


            <Bottom
                handleChangeEpisode={handleChangeEpisode}
                currentUser={currentUser}
                displayNextEpisode={displayNextEpisode}
                currentSubtitles={currentSubtitles}
                openSubtitle={openSubtitle}
                setOpenSubtitle={setOpenSubtitle}
                currentEpisode={currentEpisode}
                currentMovie={currentMovie}
                fullScreen={fullScreen}
                subtitle={subtitle}
                playing={playing}
                played={played || 0}
                duration={duration || 0}
                video={reactPlayerRef.current}
                muted={muted}
                setDisplayAction={setDisplayAction}
                setFullScreen={setFullScreen}
                setMuted={setMuted}
                setPlaying={setPlaying}
            />
        </section>
    )
}
export default View
