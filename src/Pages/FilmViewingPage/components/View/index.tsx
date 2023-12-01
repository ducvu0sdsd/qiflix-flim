import { useEffect, useRef, useState } from "react";
import Dailymotion from 'react-dailymotion';
import './view.scss'
import $ from 'jquery'
import { Link } from "react-router-dom";

export interface MousePositionType {
    x: number,
    y: number
}

export interface ViewProps {
    url: string,
    title: string,
    name: string,
    setCurrentEpisode: React.Dispatch<React.SetStateAction<number>>;
    numberOfEpisode: number,
    currentEpisode: number
}

const View = ({ url, title, name, numberOfEpisode, currentEpisode, setCurrentEpisode }: ViewProps) => {

    //state
    const [currentQuality, setCurrentQuality] = useState<string>('')
    const [fullscreen, setFullScreen] = useState<boolean>(false)
    const [volume, setVolume] = useState<boolean>(true)
    const [mouseDownStick, setMouseDownStick] = useState<boolean>(false)
    const [duration, setDuration] = useState<number>(0)
    const [bufferTime, setBufferTime] = useState<number>(100)
    const [controls, setControls] = useState<boolean>(true)
    const [play, setPlay] = useState<boolean>(true)
    const [mousePosition, setMousePosition] = useState<MousePositionType>({ x: 0, y: 0 })

    //ref
    const timeout = useRef<NodeJS.Timeout | null>(null);
    const interval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const processStick = $('#view .process__stick').get(0)
        if (processStick) {
            processStick.style.cuisor = 'grabbing'
        }
    }, [mouseDownStick])

    useEffect(() => {
        const wrapperVideo = $('#view .wrapper-video').get(0)
        const btnPlayPause = $('.btn--play-pause').get(0)
        const bottom = $('.controls-bottom-video').get(0)
        const top = $('.controls-top-video').get(0)
        wrapperVideo?.addEventListener('mousemove', function (event: any) {
            setMousePosition({ x: event.clientX, y: event.clientY })
            setMouseDownStick(false)
        });
        // btnPlayPause?.addEventListener('mousemove', function (event: any) {
        //     setMousePosition({ x: event.clientX, y: event.clientY })
        //     setMouseDownStick(false)
        // });
        // bottom?.addEventListener('mousemove', function (event: any) {
        //     setMousePosition({ x: event.clientX, y: event.clientY })
        //     setMouseDownStick(false)
        // });
        // top?.addEventListener('mousemove', function (event: any) {
        //     setMousePosition({ x: event.clientX, y: event.clientY })
        //     setMouseDownStick(false)
        // });
        window.addEventListener('mousemove', (e: any) => {
            // setMouseDownStick(false)
        })
        // video?.addEventListener('mouseover', () => {
        // })
    }, [])

    useEffect(() => {
        const btnPlayPause = $('.btn--play-pause').get(0)
        const bottom = $('.controls-bottom-video').get(0)
        const top = $('.controls-top-video').get(0)
        if (btnPlayPause && bottom && top) {
            btnPlayPause.style.opacity = 1
            bottom.style.opacity = 1
            top.style.opacity = 1
            clearTimeout(timeout.current!)
            timeout.current = setTimeout(() => {
                btnPlayPause.style.opacity = 0
                bottom.style.opacity = 0
                top.style.opacity = 0
            }, 2000)
        }
    }, [mousePosition])

    useEffect(() => {
        const process = $('.process')
        const btnSkip = $('#view .btn-skip')
        const processComplete = $('.process__complete').get(0)
        if (processComplete && process.length > 0 && btnSkip.length > 0) {
            if (duration !== 0 && bufferTime !== 0) {
                if (bufferTime / duration > 0.985) {
                    if (currentEpisode < numberOfEpisode) {
                        btnSkip.css('display', 'block')
                    }
                } else {
                    btnSkip.css('display', 'none')
                }
            } else {
                btnSkip.css('display', 'none')
            }
            let positionTime: number = (bufferTime / duration)
            const widthProcess: number = parseInt(process.css('width').replace('px', ''))
            processComplete.style.width = `${positionTime * widthProcess}px`
        }
    }, [bufferTime])

    const handleMouseBtnPlayPause = (hover: boolean) => {
        const btnPlayPause = $('.btn--play-pause').get(0)
        if (btnPlayPause) {
            if (hover) {
                btnPlayPause.style.opacity = 1
                clearTimeout(timeout.current!)
            } else {
                timeout.current = setTimeout(() => {
                    btnPlayPause.style.opacity = 0
                }, 2000)
            }
        }
    }

    const handleMouseBottom = (hover: boolean) => {
        const bottom = $('.controls-bottom-video').get(0)
        if (bottom) {
            if (hover) {
                bottom.style.opacity = 1
                clearTimeout(timeout.current!)
            } else {
                timeout.current = setTimeout(() => {
                    bottom.style.opacity = 0
                }, 2000)
            }
        }
    }

    const handleMouseTop = (hover: boolean) => {
        const top = $('.controls-top-video').get(0)
        if (top) {
            if (hover) {
                top.style.opacity = 1
                clearTimeout(timeout.current!)
            } else {
                timeout.current = setTimeout(() => {
                    top.style.opacity = 0
                }, 2000)
            }
        }
    }

    const handleReadyVideo = (e: any) => {
        const intervalReady = setInterval(() => {
            if (e.target.video && e.target.quality) {
                const video = $('#view .video').get(0)
                if (video) {
                    setDuration(e.target.video.duration)
                    setCurrentQuality(e.target.quality)
                }
                clearInterval(intervalReady)
            }
        }, 1)
    }

    const handleStartVideo = (e: any) => {
        console.log(e)
        const video = $('#view .video').get(0)
        if (video) {
            setBufferTime(0)
            interval.current = setInterval(() => {
                setBufferTime((p) => p + 1)
            }, 1000)
        }
    }

    const handleEndVideo = (e: any) => {
        setCurrentEpisode(p => p + 1)
    }

    const handleChange = (e: any) => {
        if (e.target.video.duration - e.target.bufferedTime < 1) {
            setControls(false)
        }
    }

    const handleHoverVideo = () => {

    }

    const handleChangePlay = () => {
        const video = $('#view .video').get(0)
        if (video) {
            if (play) {
                clearInterval(interval.current!)
                video.pause()
                setPlay(false)
            } else {
                video.play()
                if (interval.current != null) {
                    interval.current = setInterval(() => {
                        setBufferTime((p) => p + 1)
                    }, 1000)
                }
                setPlay(true)
            }
        }
    }

    const handleMouseMoveStick = (e: any) => {
        const process = $('#view .process')
        const processStick = $('#view .process__stick').get(0)
        const processComplete = $('#view .process__complete').get(0)
        if (processStick && processComplete && process.length > 0) {
            if (mouseDownStick) {
                const widthProcess: number = parseInt(process.css('width').replace('px', ''))
                if (e.clientX >= 50 && e.clientX <= widthProcess + 25) {
                    clearInterval(interval.current!)
                    processStick.style.marginLeft = e.clientX - 50 - (processComplete.style.width.replace('px', '') == '' ? 0 : parseInt(processComplete.style.width.replace('px', ''))) + 'px'
                }
            }
        }
    }

    const handleMouseUpStick = (e: any) => {
        const video = $('#view .video').get(0)
        const process = $('#view .process')
        const processStick = $('#view .process__stick').get(0)
        const processComplete = $('#view .process__complete').get(0)
        if (processStick && processComplete && video && process.length > 0) {
            setMouseDownStick(false)
            e.target.style.padding = '0'
            processComplete.style.width = (processComplete.style.width.replace('px', '') == '' ? 0 : parseInt(processComplete.style.width.replace('px', ''))) + parseInt(processStick.style.marginLeft.replace('px', '')) + 'px'
            processStick.style.marginLeft = 0
            let buffer = (processComplete.style.width.replace('px', '') == '' ? 0 : parseInt(processComplete.style.width.replace('px', ''))) + parseInt(processStick.style.marginLeft.replace('px', ''))
            const widthProcess: number = parseInt(process.css('width').replace('px', ''))
            setBufferTime(buffer / widthProcess * duration)
            video.seek(buffer / widthProcess * duration)
        }
    }

    const handleStartAD = (start: boolean, e: any) => {
        const video = $('#view .video').get(0)
        if (video) {
            const wrapperVideo = $('#view .wrapper-video')
            const btnPlayPause = $('.btn--play-pause')
            const bottom = $('.controls-bottom-video')
            const top = $('.controls-top-video')
            const bottomad = $('.wrapper-bottom-video')
            const elem: HTMLElement | null = document.documentElement as HTMLElement;
            if (wrapperVideo.length > 0 && btnPlayPause.length > 0 && bottom.length > 0 && top.length > 0 && bottomad.length > 0) {
                if (start) {
                    wrapperVideo.css('display', 'none')
                    btnPlayPause.css('display', 'none')
                    bottom.css('display', 'none')
                    top.css('display', 'none')
                    bottomad.css('display', 'block')
                    clearInterval(interval.current!)
                } else {
                    wrapperVideo.css('display', 'block')
                    btnPlayPause.css('display', 'flex')
                    bottom.css('display', 'flex')
                    top.css('display', 'flex')
                    bottomad.css('display', 'none')
                    interval.current = setInterval(() => {
                        setBufferTime(e.target.currentTime)
                    }, 1000)
                }
            }
        }
    }

    const handleChangVolume = () => {
        const video = $('#view .video').get(0)
        if (video) {
            if (volume) {
                video.setMuted(true)
            } else {
                video.setMuted(false)
            }
            setVolume(!volume)
        }
    }

    const handleChangeFullScreen = () => {
        const elem: HTMLElement | null = document.documentElement as HTMLElement;
        if (!document.fullscreenElement) {
            if (elem?.requestFullscreen) {
                elem.requestFullscreen()
                document.body.style.overflow = 'hidden'
                setFullScreen(true)
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
                document.body.style.overflow = ''
                setFullScreen(false)
            }
        }
    }

    const handleWaiting = (e: any) => {
        clearInterval(interval.current!)
        interval.current = setInterval(() => {
            setBufferTime(e.target.currentTime)
        }, 1000)
    }

    return (
        <section
            id='view'
            className='col-lg-12'
            style={{ height: `${window.innerHeight}px` }}
        >
            <div onMouseOver={() => handleHoverVideo()} className="daily-wrapper col-lg-12">
                <Dailymotion
                    className='video'
                    video={url}
                    showEndScreen={false}
                    controls={false}
                    mute={!volume}
                    autoplay={true}
                    width='100%'
                    height='100%'
                    onWaiting={(e: any) => handleWaiting(e)}
                    onPause={() => setPlay(false)}
                    onAdStart={(e: any) => handleStartAD(true, e)}
                    onAdEnd={(e: any) => handleStartAD(false, e)}
                    onVideoStart={(e: any) => handleStartVideo(e)}
                    onVideoEnd={(e: any) => handleEndVideo(e)}
                    onTimeUpdate={(e: any) => handleChange(e)}
                    onApiReady={(e: any) => handleReadyVideo(e)}
                />
                <div className="wrapper-bottom-video"></div>
                <div className="wrapper-video"></div>
                <button onClick={() => setCurrentEpisode(p => p + 1)} className="btn-skip">Next Episode &gt;</button>
                <div onMouseOver={() => handleMouseTop(true)} onMouseOut={() => handleMouseTop(false)} className="controls-top-video controls">
                    <span style={{ display: 'flex' }}><Link className="link" style={{ color: 'white', marginRight: '20px', fontSize: '25px' }} to={'/home-page'}><i className='bx bx-arrow-back'></i></Link> {title}</span><div className="box" /><span>{name}</span>
                </div>
                <button onMouseOver={() => handleMouseBtnPlayPause(true)} onMouseOut={() => handleMouseBtnPlayPause(false)} onClick={() => handleChangePlay()} className="btn--play-pause">{play ? <i className='bx bx-pause' ></i> : <i className='bx bx-play'></i>}</button>
                <div onMouseOver={() => handleMouseBottom(true)} onMouseOut={() => handleMouseBottom(false)} className="controls-bottom-video controls col-lg-12">
                    <span className="process">
                        <div className="process__complete"></div>
                        <div onMouseMove={(e: any) => handleMouseMoveStick(e)} onMouseUp={(e: any) => handleMouseUpStick(e)} onMouseDown={(e: any) => { setMouseDownStick(true); e.target.style.padding = '0 0px' }} className="process__stick"></div>
                    </span>
                    <div className="btns">
                        <div className="qualities">
                            {currentQuality !== '' && currentQuality + 'p'}
                        </div>
                        <button onClick={() => handleChangVolume()} className="btn-volume">
                            {volume ? <i className='bx bx-volume-full'></i> : <i className='bx bx-volume-mute' ></i>}
                        </button>
                        <button onClick={() => handleChangeFullScreen()} className="btn-fullscreen">
                            {fullscreen ? <i className='bx bx-exit-fullscreen' ></i> : <i className='bx bx-fullscreen' ></i>}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default View;
