
import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player/lazy'
import { MovieInterface, SubtitleInterface, UserInterface } from '../../../../Components/Context/interfaces'
import './view.scss'
import Bottom, { Volume } from './Bottom'
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
    setBufferTime: React.Dispatch<React.SetStateAction<number | undefined>>;
    type: string
}

const View = ({ type = 'default', setCurrentEpisode, currentUser, currentEpisode, currentMovie, currentTime, currentSubtitles, setBufferTime }: ViewProps) => {
    //ref
    const reactPlayerRef = useRef<ReactPlayer>(null);

    // state
    const [displayNextEpisode, setDisplayNextEpisode] = useState<boolean>(false)
    const [waitingUpdate, setWaitingUpdate] = useState<number>(10)
    const [openSubtitle, setOpenSubtitle] = useState<boolean>(currentSubtitles.length > 0)
    const [displayAction, setDisplayAction] = useState<boolean>(true)
    const [duration, setDuration] = useState<number>()
    const [playing, setPlaying] = useState<boolean>(false)
    const [played, setPlayed] = useState<number>(0)
    const [muted, setMuted] = useState<boolean>(false)
    const [subtitle, setSubtitle] = useState<string>('')
    const [fullScreen, setFullScreen] = useState<boolean>(false)
    const [changing, setChanging] = useState<number>(0)
    const [volume, setVolume] = useState<number>(0)
    const [visibleGuide, setVisibleGuide] = useState<boolean>(false)

    useEffect(() => {
        setPlaying(true)
    }, [currentEpisode])

    useEffect(() => {
        setOpenSubtitle(currentSubtitles.length > 0)
    }, [currentSubtitles])

    useEffect(() => {
        if (changing === 1) {
            handleChangeEpisodeForEndVideo()
        }
    }, [changing])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Space') {
                event.preventDefault();
                handlePlayOrPause();
            } else if (event.code === 'ArrowLeft') {
                event.preventDefault();
                handleChangeTime(played - 10)
            } else if (event.code === 'ArrowRight') {
                event.preventDefault();
                handleChangeTime(played + 10)
            } else if (event.code === 'Digit1') {
                event.preventDefault();
                if (duration) {
                    handleChangeTime(duration * 0.1)
                }
            } else if (event.code === 'Digit2') {
                event.preventDefault();
                if (duration) {
                    handleChangeTime(duration * 0.2)
                }
            } else if (event.code === 'Digit3') {
                event.preventDefault();
                if (duration) {
                    handleChangeTime(duration * 0.3)
                }
            } else if (event.code === 'Digit4') {
                event.preventDefault();
                if (duration) {
                    handleChangeTime(duration * 0.4)
                }
            } else if (event.code === 'Digit5') {
                event.preventDefault();
                if (duration) {
                    handleChangeTime(duration * 0.5)
                }
            } else if (event.code === 'Digit6') {
                event.preventDefault();
                if (duration) {
                    handleChangeTime(duration * 0.6)
                }
            } else if (event.code === 'Digit7') {
                event.preventDefault();
                if (duration) {
                    handleChangeTime(duration * 0.7)
                }
            } else if (event.code === 'Digit8') {
                event.preventDefault();
                if (duration) {
                    handleChangeTime(duration * 0.8)
                }
            } else if (event.code === 'Digit9') {
                event.preventDefault();
                if (duration) {
                    handleChangeTime(duration * 0.9)
                }
            } else if (event.code === 'Digit0') {
                event.preventDefault();
                if (duration) {
                    handleChangeTime(0)
                }
            } else if (event.code === 'ArrowUp') {
                event.preventDefault();
                handleChangeEpisode(1)
            } else if (event.code === 'ArrowDown') {
                event.preventDefault();
                handleChangeEpisode(-1)
            } else if (event.code === 'KeyF') {
                event.preventDefault();
                handleChangeFullScreen()
            } else if (event.code === 'KeyM') {
                event.preventDefault();
                setMuted(!muted)
            } else if (event.code === 'BracketLeft') {
                event.preventDefault();
                const volumeNumber = (JSON.parse(window.localStorage.getItem('volume') || '') as Volume)
                if (volumeNumber.volumePercent < 0.1) {
                    // window.localStorage.setItem('volume', JSON.stringify({ volumePercent: 0, volumeWidth: 0 }))
                } else {
                    window.localStorage.setItem('volume', JSON.stringify({ volumePercent: volumeNumber.volumePercent - 0.1, volumeWidth: volumeNumber.volumeWidth * (volumeNumber.volumePercent - 0.1) / volumeNumber.volumePercent }))
                }
            } else if (event.code === 'BracketRight') {
                event.preventDefault();
                const volumeNumber = (JSON.parse(window.localStorage.getItem('volume') || '') as Volume)
                if (volumeNumber.volumePercent > 0.9) {
                    window.localStorage.setItem('volume', JSON.stringify({ volumePercent: 1, volumeWidth: volumeNumber.volumeWidth * 1 / volumeNumber.volumePercent }))
                } else {
                    window.localStorage.setItem('volume', JSON.stringify({ volumePercent: volumeNumber.volumePercent + 0.1, volumeWidth: volumeNumber.volumeWidth * (volumeNumber.volumePercent + 0.1) / volumeNumber.volumePercent }))
                }

            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [playing, played]);

    const handleChangeFullScreen = () => {
        const elem: HTMLElement | null = document.documentElement as HTMLElement;
        if (!document.fullscreenElement) {
            if (elem?.requestFullscreen) {
                window.scrollTo({ top: 0, behavior: 'auto' });
                setTimeout(() => {
                    elem.requestFullscreen()
                    document.body.style.overflow = 'hidden'
                    setFullScreen(true)
                }, 400)
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
                document.body.style.overflow = ''
                setFullScreen(false)
            }
        }
    }

    const handleOnProgress = () => {
        setPlayed(reactPlayerRef.current?.getCurrentTime() || 0)
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

        if (changing !== 0) {
            setChanging(0)
        }

        if (played && duration) {
            if (played / duration >= 0.997) {
                setChanging(prev => prev + 1)
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
                    setWaitingUpdate(10)
                    apiUser({ path: `/users/delete-watching/${currentUser._id}`, body: watching, type: TypeHTTP.PUT })
                } else {
                    setWaitingUpdate(10)
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

    const handleChangeTime = (time: number) => {
        if (reactPlayerRef.current && played) {
            reactPlayerRef.current.seekTo(time)
        }
    }

    const handlePlayOrPause = () => {
        if (playing) {
            setPlaying(false)
        } else {
            setPlaying(true)
        }
    }

    const handleChangeEpisodeForEndVideo = () => {
        if (currentMovie.listEpisode?.episodes.length) {
            if (currentEpisode < currentMovie.listEpisode?.episodes.length) {
                if (played && duration) {
                    if (played / duration >= 0.997) {
                        const watching = {
                            movie_id: currentMovie._id,
                            indexOfEpisode: currentEpisode + 1,
                            currentTime: 0,
                            process: 0
                        }
                        if (currentUser) {
                            apiUser({ path: `/users/update-watching/${currentUser._id}`, body: watching, type: TypeHTTP.PUT })
                                .then(res => {
                                    setCurrentEpisode(currentEpisode + 1)
                                    setBufferTime(0)
                                    setPlaying(true)
                                })
                        }
                    }
                }
            }
        }
    }

    const handleChangeEpisode = (number: number) => {
        if (currentMovie.listEpisode?.episodes.length) {
            if (currentEpisode < currentMovie.listEpisode?.episodes.length) {
                const watching = {
                    movie_id: currentMovie._id,
                    indexOfEpisode: currentEpisode + number,
                    currentTime: 0,
                    process: 0
                }
                if (currentUser) {
                    apiUser({ path: `/users/update-watching/${currentUser._id}`, body: watching, type: TypeHTTP.PUT })
                        .then(res => {
                            setCurrentEpisode(currentEpisode + number)
                            setBufferTime(0)
                            setPlaying(true)
                        })
                }
            }
        }
    }

    const guides = [
        { key: 'Space', value: 'Play/Pause Movie' },
        { key: '0-9', value: 'Adjust the duration of Movie' },
        { key: 'Left', value: '10 seconds backward' },
        { key: 'Right', value: 'Forward 10 seconds' },
        { key: 'Up', value: 'Next Episode' },
        { key: 'Down', value: 'Previous Episode' },
        { key: 'F', value: 'FullScreen Or UnFullScreen' },
        { key: 'M', value: 'Muted Or Unmuted' },
    ]


    return (
        <section style={type === 'default' ? { height: `${window.innerHeight}px` } : {}} id='video'>
            {type === 'default' && (
                <>
                    {!fullScreen && <>
                        <Link className='link' to={'/home-page'}><i className='btn-return bx bx-left-arrow-alt'></i></Link>
                        <i className='bx bx-book-content btn-share' onMouseEnter={() => setVisibleGuide(true)} onMouseLeave={() => setVisibleGuide(false)} >
                            <div className='content' style={{ width: visibleGuide ? 'auto' : 0, padding: visibleGuide ? '15px' : '0' }}>
                                {visibleGuide && guides.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '18px', width: '70px' }}>
                                            {item.key}
                                        </div>
                                        <div style={{ fontSize: '16px', width: '250px' }}>
                                            <span>{': ' + item.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </i>
                    </>}
                    <div onClick={handlePlayOrPause} className='wrapper-video'></div>
                </>
            )}
            <ReactPlayer
                config={{
                    youtube: {
                        playerVars: {
                            controls: 0, // Hiển thị bảng điều khiển
                            modestbranding: 1, // Ẩn logo YouTube
                            showinfo: 0, // Ẩn tiêu đề và thông tin video
                            rel: 0, // Tắt gợi ý video liên quan 
                            fs: 0,
                        },
                    },
                    facebook: {
                        appId: '1048093426472292'
                    }
                }}
                ref={reactPlayerRef}
                width={'100%'}
                height={type === 'default' ? `${window.innerHeight}px` : 'auto'}
                controls={type === 'default' ? false : true}
                volume={type === 'default' ? volume : 1}
                playing={playing}
                muted={type === 'default' ? muted : false}
                progressInterval={100}
                onStart={() => { reactPlayerRef.current?.seekTo(currentTime) }}
                onProgress={() => handleOnProgress()}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onDuration={() => setDuration(reactPlayerRef.current?.getDuration())}
                url={`${(currentMovie.listEpisode?.episodes[currentEpisode - 1].url && currentMovie.listEpisode.episodes[currentEpisode - 1].url.length <= 10) ? 'https://www.dailymotion.com/video/' : ''}` + currentMovie.listEpisode?.episodes[currentEpisode - 1].url}
            // url={"https://hd.hdbophim.com/20221026/24778_10d71b63/index.m3u8"}
            // url={'https://aa.opstream6.com/20220324/5431_283b15c7/index.m3u8'}
            />

            {type === 'default' && (
                <Bottom
                    setVisibleGuide={setVisibleGuide}
                    handleChangeFullScreen={handleChangeFullScreen}
                    setChanging={setChanging}
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
                    setVolume={setVolume}
                    played={played || 0}
                    duration={duration || 0}
                    video={reactPlayerRef.current}
                    muted={muted}
                    setDisplayAction={setDisplayAction}
                    setFullScreen={setFullScreen}
                    setMuted={setMuted}
                    setPlaying={setPlaying}
                />
            )}
        </section>
    )
}
export default View
