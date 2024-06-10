import './filmitem.scss'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Trailer from '../../resources/trailer.mp4'
import $ from 'jquery'
import { MovieInterface } from '../Context/interfaces'
import { Link } from 'react-router-dom'
import { TypeHTTP, apiUser } from '../../Utils/api'
import { type } from 'os'
import { ThemeContext } from '../Context'
import { NotificationStatus } from '../Notification'
import { motion } from 'framer-motion'
import ReactPlayer from 'react-player'

export interface FilmItemProp {
    displayDetail?: boolean,
    movie: MovieInterface,
    title: string,
    process: number
    movieDetail?: MovieDetail
    setMovieDetail: React.Dispatch<React.SetStateAction<MovieDetail>>
}

export interface MovieDetail {
    display: boolean
    movie: MovieInterface | undefined
}

const FilmItem = ({ title, displayDetail = false, movie, process, setMovieDetail, movieDetail }: FilmItemProp) => {
    const titleCustom = movie?.title.split(' ').join('-')
    const displayRef = useRef<NodeJS.Timeout | null>(null)
    const [widthDetail, setWidthDetail] = useState<number>(0)
    const { datas, handles } = useContext(ThemeContext) || {}
    const [favorites, setFavorites] = useState<string[] | undefined>([])
    const [load, setLoad] = useState<boolean>(false)

    useEffect(() => {
        setFavorites(datas?.currentUser?.liked)
    }, [datas?.currentUser])

    useEffect(() => {
        if (widthDetail === 0) {
            if (displayRef.current) {
                clearTimeout(displayRef.current);
                const detailElement = $(`.detail-film-mini-${movie?._id}-${title.toLowerCase().split(' ').join('-')}`).get(0);
                const info = $(`.detail-film-mini-${movie?._id}-${title.toLowerCase().split(' ').join('-')} .info`)
                if (detailElement) {
                    detailElement.style.width = `${widthDetail}px`
                    detailElement.style.height = '0px'
                    detailElement.style.left = '50%'
                    detailElement.style.top = '50%'
                    info.css('display', 'none')
                    setTimeout(() => {
                        detailElement.style.display = 'none'
                    }, 200)
                }
            }
        } else {
            if (displayDetail) {
                displayRef.current = setTimeout(() => {
                    const detailElement = $(`.detail-film-mini-${movie?._id}-${title.toLowerCase().split(' ').join('-')}`).get(0);
                    const info = $(`.detail-film-mini-${movie?._id}-${title.toLowerCase().split(' ').join('-')} .info`)
                    if (detailElement) {
                        detailElement.style.display = 'flex'
                        setTimeout(() => {
                            detailElement.style.width = `${widthDetail}px`
                            detailElement.style.height = '100%'
                            detailElement.style.left = '0'
                            detailElement.style.top = '0'
                            info.css('display', 'flex')
                        }, 200)
                    }
                }, 500);
            }
        }
    }, [widthDetail])

    const handleFavoriteFlim = (movie_id: string) => {
        apiUser({ path: `/users/add-liked/${datas?.currentUser?._id}`, body: { movie_id: movie_id }, type: TypeHTTP.PUT })
            .then(result => {
                handles?.setCurrentUser(result)
                handles?.handleSetNotification({ type: NotificationStatus.SUCCESS, message: 'Add movie to my list is successful' })
                apiUser({ path: `/users/${datas?.account?._id}`, type: TypeHTTP.GET })
                    .then(res => {
                        handles?.setUsers(res)
                    })
            })
    }

    const handleUnFavoriteFlim = (movie_id: string) => {
        apiUser({ path: `/users/remove-liked/${datas?.currentUser?._id}`, body: { movie_id: movie_id }, type: TypeHTTP.PUT })
            .then(result => {
                handles?.setCurrentUser(result)
                handles?.handleSetNotification({ type: NotificationStatus.SUCCESS, message: 'Remove movie to my list is successful' })
                apiUser({ path: `/users/${datas?.account?._id}`, type: TypeHTTP.GET })
                    .then(res => {
                        handles?.setUsers(res)
                    })
            })
    }


    return (
        <motion.div
            initial={{ x: window.innerWidth * -1 }}
            animate={{ x: 0 }}
            exit={{ x: window.innerWidth * -1, transition: { duration: 0.2 } }}
            onMouseEnter={() => setWidthDetail(370)} onMouseLeave={() => setWidthDetail(0)} className="films__film-item">
            <div className={`detail-film-mini detail-film-mini-${movie?._id}-${title.toLowerCase().split(' ').join('-')}`}>
                <div className='col-lg-12 video-film'>
                    <iframe
                        style={{ backgroundColor: 'black' }}
                        src={`https://www.dailymotion.com/embed/video/${movie.trailerUrl}?autoplay=1&controls=0&loop=1&mute=1`}
                        width="120%"
                        height="120%"
                        title="Dailymotion Video Player"
                        allow="autoplay; web-share" />
                    <div className="btns col-lg-12">
                        <Link className='link' to={`/${movie.url}`}><button className='btn-watch'><i className='bx bx-play' ></i> Watch</button></Link>
                        <button onClick={() => setMovieDetail({ display: true, movie: movie })} className='btn-info'><i className='bx bx-info-circle' ></i></button>
                    </div>
                </div>
                <div className="info">
                    <span>{movie?.yearRelease} | {movie.listEpisode?.numberOfEpisodes}E | {movie?.country} | 1 Part | HD</span>
                    {favorites?.includes(movie._id) ?
                        <button onClick={() => handleUnFavoriteFlim(movie._id)}><i className="fa-solid fa-check"></i></button>
                        :
                        <button onClick={() => handleFavoriteFlim(movie._id)}><i className='bx bx-plus'></i></button>}
                </div>
            </div>
            <Link className='link' to={`/${movie.url}`}><img className='themenail' src={movie?.thumbnail} width={'100%'} /></Link>
            {title === 'Continue Watching' && <div className='process'>
                <div className='complete' style={{ width: `${$('.films__film-item').width() * process}px` }}></div>
            </div>}
        </motion.div >
    )
}

export default FilmItem
