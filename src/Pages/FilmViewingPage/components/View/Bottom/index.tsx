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
    handleChangeEpisode: (number: number) => void
    setChanging: React.Dispatch<React.SetStateAction<number>>
    setVolume: React.Dispatch<React.SetStateAction<number>>
    handleChangeFullScreen: any
    setVisibleGuide: React.Dispatch<React.SetStateAction<boolean>>
}

export interface MousePosition {
    x: number
    y: number
}

export interface Volume {
    volumePercent: number,
    volumeWidth: number
}

const Bottom = ({ setVisibleGuide, handleChangeFullScreen, setChanging, setVolume, handleChangeEpisode, currentUser, displayNextEpisode, currentSubtitles, openSubtitle, setOpenSubtitle, currentMovie, currentEpisode, fullScreen, setDisplayAction, setFullScreen, duration, playing, played, video, setPlaying, muted, setMuted, subtitle }: BottomProps) => {

    const [mouse, setMouse] = useState<boolean>(false)
    const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })
    const timeout = useRef<NodeJS.Timeout | null>(null);
    const [visibleVolume, setVisibleVolume] = useState<boolean>(false)
    const [volumeWidth, setVolumeWidth] = useState<number>(0)

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
            setVisibleGuide(false)
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

    useEffect(() => {
        const json = window.localStorage.getItem('volume')
        if (json) {
            const volume = JSON.parse(json)
            const volumeFormat = volume as Volume
            setVolume(volumeFormat.volumePercent)
            setVolumeWidth(volumeFormat.volumeWidth)
        } else {
            const controlVolumeElement = document.querySelector('.control-volume') as HTMLElement;
            setVolume(1)
            setVolumeWidth(controlVolumeElement.offsetWidth)
        }
    }, [window.localStorage.getItem('volume')])

    useEffect(() => {
        const json = window.localStorage.getItem('volume')
        if (json) {
            const volume = JSON.parse(json)
            const volumeFormat = volume as Volume
            if (muted) {
                setVolumeWidth(0)
            } else {
                setVolumeWidth(volumeFormat.volumeWidth)
            }
        }
    }, [muted])

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

    const handlePlayOrPause = () => {
        if (playing) {
            setPlaying(false)
        } else {
            setPlaying(true)
        }
    }

    const handleMutedOrNot = () => {
        const volume = JSON.parse(window.localStorage.getItem('volume') || '') as Volume
        if (muted) {
            setVolumeWidth(volume.volumeWidth)
            setMuted(false)
        } else {
            setVolumeWidth(0)
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

    const handleClickProcessVolume = () => {
        const controlVolumeElement = document.querySelector('.control-volume') as HTMLElement;
        if (controlVolumeElement) {
            const rect = controlVolumeElement.getBoundingClientRect();
            const width = controlVolumeElement.offsetWidth;
            if ((mousePosition.x - rect.left) / (width) > 0) {
                setMuted(false)
            } else
                setMuted(true)
            window.localStorage.setItem('volume', JSON.stringify({ volumePercent: (mousePosition.x - rect.left) / (width), volumeWidth: mousePosition.x - rect.left }))
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
                onClick={() => handleChangeEpisode(1)}
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
                        <div
                            onMouseEnter={() => setVisibleVolume(true)}
                            onMouseLeave={() => setVisibleVolume(false)}
                            style={{ position: 'relative' }}>
                            <i
                                onClick={handleMutedOrNot}
                                style={{ fontSize: '26px', transform: 'translateY(0px)', width: '30px' }} className={`fa-solid ${muted ? 'fa-volume-xmark' : 'fa-volume-high'}`}>
                            </i>
                            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', position: 'absolute', height: '40px', width: visibleVolume ? '100px' : '0px', transition: '0.5s', top: '-8px', left: '45px' }}>
                                <div onClick={() => handleClickProcessVolume()} className='control-volume' style={{ height: '5px', cursor: 'pointer', width: '90%', display: 'flex', alignItems: 'center', backgroundColor: '#999', borderRadius: '10px' }}>
                                    <div style={{ backgroundColor: 'red', height: '100%', width: `${volumeWidth}px`, borderRadius: '10px 0px 0px 10px' }}>

                                    </div>
                                    <div style={{ height: '18px', width: '18px', borderRadius: '50%', backgroundColor: 'red', cursor: 'pointer', transform: 'translateY(1px)' }}>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='title-movie'>
                        {currentMovie.title}
                        <span style={{ height: '20px', margin: '0 10px', width: '2px', borderRadius: '10px', backgroundColor: 'white' }} />
                        {currentMovie.listEpisode?.episodes[currentEpisode - 1]?.name}
                    </div>
                    <div className='item-right item' style={{ justifyContent: 'end' }}>
                        <i style={{ margin: '0 9px', display: `${currentEpisode !== 1 ? 'block' : 'none'}`, fontSize: '28px' }} onClick={() => { handleChangeEpisode(-1) }} className='fa-solid fa-backward-step'></i>
                        <i style={{ margin: '0 9px', display: `${currentEpisode !== currentMovie.listEpisode?.numberOfEpisodes ? 'block' : 'none'}`, fontSize: '28px' }} onClick={() => { handleChangeEpisode(1) }} className='fa-solid fa-forward-step'></i>
                        <i onClick={handleOpenSubtitleOrNot} style={{ color: `${openSubtitle ? 'white' : '#999'}` }} className='bx bx-captions' ></i>
                        <i onClick={handleChangeFullScreen} className={`bx ${fullScreen ? 'bx-exit-fullscreen' : 'bx bx-fullscreen'}`} ></i>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Bottom
