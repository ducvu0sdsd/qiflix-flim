import { useContext, useEffect, useRef, useState } from "react";
import Dailymotion from 'react-dailymotion';
import './view.scss'
import $ from 'jquery'
import { Link } from "react-router-dom";
import { TypeHTTP, apiUser } from "../../../../Utils/api";
import { SubtitleInterface, WatchingInterface } from "../../../../Components/Context/interfaces";
import Qiflix from '../../../../resources/qiflix.png'
import { ThemeContext } from "../../../../Components/Context";

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
    currentEpisode: number,
    movie_id: string,
    user_id: string,
    currentTime: number | undefined,
    currentSubtitles: SubtitleInterface[]
}

const View = ({ currentSubtitles, currentTime, movie_id, user_id, url, title, name, numberOfEpisode, currentEpisode, setCurrentEpisode }: ViewProps) => {

    //state
    const [waitingUpdate, setWaitingUpdate] = useState<number>(30)
    const [currentQuality, setCurrentQuality] = useState<string>('')
    const [fullscreen, setFullScreen] = useState<boolean>(false)
    const [volume, setVolume] = useState<boolean>(true)
    const [mouseDownStick, setMouseDownStick] = useState<boolean>(false)
    const [duration, setDuration] = useState<number>(0)
    const [bufferTime, setBufferTime] = useState<number>(currentTime || 0)
    const [controls, setControls] = useState<boolean>(true)
    const [play, setPlay] = useState<boolean>(true)
    const [sub, setSub] = useState<boolean>(currentSubtitles.length > 0)
    const [mousePosition, setMousePosition] = useState<MousePositionType>({ x: 0, y: 0 })
    const [subContent, setSubContent] = useState<SubtitleInterface[]>([])

    //ref
    const timeout = useRef<NodeJS.Timeout | null>(null);
    const interval = useRef<NodeJS.Timeout | null>(null);

    // context
    const { datas, handles } = useContext(ThemeContext) || {}

    useEffect(() => {
        if (currentTime) {
            setBufferTime(currentTime)
        }
    }, [currentTime])

    useEffect(() => {
        if (currentSubtitles.length > 0) {
            const arr: SubtitleInterface[] = []
            if (numberOfEpisode == 1) {
                // phim le
                currentSubtitles.forEach(item => {
                    if (item.episode == 0) {
                        arr.push(item)
                    }
                })
            } else {
                // phim bo
                currentSubtitles.forEach(item => {
                    if (item.episode == currentEpisode) {
                        arr.push(item)
                    }
                })
            }
            setSub(true)
            setSubContent(arr)
        } else {
            setSub(false)
            setSubContent([])
        }
    }, [currentSubtitles])

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
        const subtitle = $('#view .subtitle')
        const watching = {
            movie_id: movie_id,
            indexOfEpisode: currentEpisode,
            currentTime: bufferTime,
            process: bufferTime / duration
        }
        if (currentSubtitles.length > 0) {
            let have = false
            subContent[0].subtitles.forEach(item => {
                if (bufferTime >= item.firstTime && bufferTime < item.lastTime) {
                    subtitle.html(item.content)
                    have = true
                }
            })
            if (!have) {
                subtitle.html('')
            }
        }
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
            if (waitingUpdate === 0) {
                if (bufferTime / duration > 0.95 && currentEpisode === numberOfEpisode) {
                    setWaitingUpdate(30)
                    apiUser({ path: `/users/delete-watching/${user_id}`, body: watching, type: TypeHTTP.PUT })
                        .then(res => {
                            handles?.setCurrentUser(res)
                        })
                } else {
                    setWaitingUpdate(30)
                    apiUser({ path: `/users/update-watching/${user_id}`, body: watching, type: TypeHTTP.PUT })
                        .then(res => {
                            handles?.setCurrentUser(res)
                        })
                }
            } else {
                setWaitingUpdate(prev => prev - 1)
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
        const processComplete = $('.process__complete')
        const process = $('.process')
        const intervalReady = setInterval(() => {
            if (e.target.video && e.target.quality) {
                const video = $('#view .video').get(0)
                if (video && currentTime) {
                    let positionTime: number = (currentTime / e.target.video.duration)
                    const widthProcess: number = parseInt(process.css('width').replace('px', ''))
                    processComplete.css('width', `${positionTime * widthProcess}px`)
                    setDuration(e.target.video.duration)
                    setCurrentQuality(e.target.quality)
                    setBufferTime(currentTime)
                    e.target.seek(currentTime)
                }
                clearInterval(intervalReady)
            }
        }, 1)
    }

    const handleStartVideo = (e: any) => {
        const video = $('#view .video').get(0)
        if (video && currentTime) {
            setBufferTime(currentTime)
            video.seek(currentTime)
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
                interval.current = setInterval(() => {
                    setBufferTime((p) => p + 1)
                }, 1000)
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
            const logo = $('#view .logo')
            const subtitle = $('#view .subtitle')
            const elem: HTMLElement | null = document.documentElement as HTMLElement;
            if (wrapperVideo.length > 0 && btnPlayPause.length > 0 && bottom.length > 0 && top.length > 0 && bottomad.length > 0) {
                if (start) {
                    wrapperVideo.css('display', 'none')
                    btnPlayPause.css('display', 'none')
                    bottom.css('display', 'none')
                    top.css('display', 'none')
                    bottomad.css('display', 'block')
                    logo.css('display', 'none')
                    subtitle.css('display', 'none')
                    clearInterval(interval.current!)
                } else {
                    logo.css('display', 'block')
                    wrapperVideo.css('display', 'block')
                    btnPlayPause.css('display', 'flex')
                    bottom.css('display', 'flex')
                    top.css('display', 'flex')
                    bottomad.css('display', 'none')
                    subtitle.css('display', 'flex')
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
                window.scrollTo({
                    top: 0,
                    behavior: 'auto'
                });
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

    const handleWaiting = (e: any) => {
        clearInterval(interval.current!)
        interval.current = setInterval(() => {
            setBufferTime(e.target.currentTime)
        }, 1000)
    }

    const handleChangeSubtitle = (e: any) => {
        if (currentSubtitles.length > 0) {
            const subtitle = $('#view .subtitle')
            if (sub) {
                subtitle.css('display', 'none')
                e.target.style.color = '#999'
                setSub(false)
            } else {
                subtitle.css('display', 'flex')
                e.target.style.color = 'white'
                setSub(true)
            }
        }
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
                <div className="subtitle">

                </div>
                {/* <div className="logo">
                    <img width={'100%'} src={Qiflix} />
                </div> */}
                <div className="wrapper-bottom-video"></div>
                <div className="wrapper-video"></div>
                <button onClick={() => setCurrentEpisode(p => p + 1)} className="btn-skip">Next Episode &gt;</button>
                <div onMouseOver={() => handleMouseTop(true)} onMouseOut={() => handleMouseTop(false)} className="controls-top-video controls">
                    <span style={{ display: 'flex' }}>{!fullscreen && <Link className="link" style={{ color: 'white', marginRight: '20px', fontSize: '25px' }} to={'/home-page'}><i className='bx bx-arrow-back'></i></Link>} {title}</span><div className="box" /><span>{name}</span>
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
                        <button onClick={handleChangeSubtitle} className="btn-subtitle">
                            <i style={{ color: sub ? 'white' : '#999' }} className='bx bx-captions'></i>
                        </button>
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
