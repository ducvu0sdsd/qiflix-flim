import React, { useEffect, useRef, useState } from 'react'
import { secondsToTime } from '../../../../../Utils/movie'
import $ from 'jquery'
import ReactPlayer from 'react-player'
import { MovieInterface, SubtitleInterface, UserInterface } from '../../../../../Components/Context/interfaces'
import { TypeHTTP, apiUser } from '../../../../../Utils/api'

export interface BottomProps {
    duration: number,
    playing: boolean,
    played: number,
    video: ReactPlayer | null,
    muted: boolean,
    subtitle: string,
    fullScreen: boolean,
    currentMovie: MovieInterface,
    currentEpisode: number,
    openSubtitle: boolean,
    currentSubtitles: SubtitleInterface[],
    displayNextEpisode: boolean,
    setOpenSubtitle: React.Dispatch<React.SetStateAction<boolean>>,
    setPlaying: React.Dispatch<React.SetStateAction<boolean>>,
    setFullScreen: React.Dispatch<React.SetStateAction<boolean>>,
    setMuted: React.Dispatch<React.SetStateAction<boolean>>
    setDisplayAction: React.Dispatch<React.SetStateAction<boolean>>
    currentUser: UserInterface | undefined,
    handleChangeEpisode: () => void
}

export interface MousePosition {
    x: number
    y: number
}

const Bottom = ({ handleChangeEpisode, currentUser, displayNextEpisode, currentSubtitles, openSubtitle, setOpenSubtitle, currentMovie, currentEpisode, fullScreen, setDisplayAction, setFullScreen, duration, playing, played, video, setPlaying, muted, setMuted, subtitle }: BottomProps) => {

    const [mouse, setMouse] = useState<boolean>(false)
    const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })

    const timeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.pageX;
            const mouseY = e.pageY;
            setMousePosition({ x: mouseX, y: mouseY })
        });
    }, [])

    useEffect(() => {
        setDisplayAction(true)
        clearTimeout(timeout.current!)
        timeout.current = setTimeout(() => {
            setDisplayAction(false)
        }, 4000)
    }, [mousePosition])

    useEffect(() => {
        if (!mouse) {
            const processWidth = $('.bottom .process').width()
            const process = played / duration
            $('.bottom .played').css('width', `${process * processWidth}px`)
        }
    }, [played])

    const handleMouseMove = () => {
        if (mouse) {
            $('.bottom .played').css('width', `${mousePosition.x - 10}px`)
        }
    }

    const handleMouseUp = () => {
        setMouse(false)
        const processWidth = $('.bottom .process').width()
        const processMouse = $('.bottom .played').width()
        const playedProcess = processMouse / processWidth
        $('.bottom .stick').css('width', '17px')
        $('.bottom .stick').css('height', '17px')
        if (video) {
            video.seekTo(duration * playedProcess)
        }
    }

    const handleMouseDown = () => {
        setMouse(true)
        $('.bottom .stick').css('width', '25px')
        $('.bottom .stick').css('height', '25px')
    }

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

    const handlePlayOrPause = () => {
        if (playing) {
            setPlaying(false)
        } else {
            setPlaying(true)
        }
    }

    const handleMutedOrNot = () => {
        if (muted) {
            setMuted(false)
        } else {
            setMuted(true)
        }
    }

    const handleChangeTime = (time: number) => {
        if (video) {
            video.seekTo(played + time)
        }
    }

    const handleOpenSubtitleOrNot = () => {
        if (currentSubtitles.length > 0) {
            if (openSubtitle) {
                $('.bottom .subtitle').css('height', '0px')
                setOpenSubtitle(false)
            } else {
                $('.bottom .subtitle').css('height', '120px')
                setOpenSubtitle(true)
            }
        }
    }

    const handleClickProcess = () => {
        const processMouse = mousePosition.x - 20
        const processWidth = $('.bottom .process').width()
        const playedProcess = processMouse / processWidth
        if (video) {
            video.seekTo(duration * playedProcess)
        }
    }

    return (
        <div className='bottom'>
            <div onClick={() => handlePlayOrPause()} className='subtitle'>
                <div className='content'>
                    {subtitle}
                </div >
            </div>
            <button
                onClick={() => handleChangeEpisode()}
                style={{ display: `${displayNextEpisode ? 'block' : 'none'}` }} className='btn-next-episode'>
                Next Episode
            </button>
            <div className='control'>
                <div className='process-layout'>
                    <div onClick={handleClickProcess} className='process'>
                        <div className='played'>
                            <div
                                className='stick'
                                onMouseDown={() => handleMouseDown()}
                                onMouseUp={() => handleMouseUp()}
                                onMouseMove={handleMouseMove}
                            />
                        </div>
                    </div>
                    <div className='time'>
                        {duration !== 0 && secondsToTime(duration - played)}
                    </div>
                </div>

                <div className='actions-layout'>
                    <div className='item-left item'>
                        <i onClick={handlePlayOrPause} style={{ width: '23px' }} className={`fa-solid ${playing ? 'fa-pause' : 'fa-play'}`}></i>
                        <i onClick={() => handleChangeTime(-10)} className="fa-solid fa-arrow-rotate-left"></i>
                        <i onClick={() => handleChangeTime(10)} className="fa-solid fa-arrow-rotate-right"></i>
                        <i
                            onClick={handleMutedOrNot}
                            style={{ fontSize: '26px', position: 'relative', transform: 'translateY(0px)', width: '30px' }} className={`fa-solid ${muted ? 'fa-volume-xmark' : 'fa-volume-high'}`}>
                            {/* <div className='control-volume'>
                            <div className='volumed'>
                                <div className='stick-volume'>

                                </div>
                            </div>
                        </div> */}
                        </i>
                    </div>
                    <div className='title-movie'>
                        {currentMovie.title}
                        <span style={{ height: '20px', margin: '0 10px', width: '2px', borderRadius: '10px', backgroundColor: 'white' }} />
                        {currentMovie.listEpisode?.episodes[currentEpisode - 1]?.name}
                    </div>
                    <div className='item-right item' style={{ justifyContent: 'end' }}>
                        <i style={{ display: `${displayNextEpisode ? 'block' : 'none'}`, fontSize: '28px' }} onClick={() => handleChangeEpisode()} className="fa-solid fa-angles-right"></i>
                        <i style={{ fontSize: '24px' }} className="fa-solid fa-gauge"></i>
                        <i onClick={handleOpenSubtitleOrNot} style={{ color: `${openSubtitle ? 'white' : '#999'}` }} className='bx bx-captions' ></i>
                        <i onClick={handleChangeFullScreen} className={`bx ${fullScreen ? 'bx-exit-fullscreen' : 'bx bx-fullscreen'}`} ></i>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Bottom
