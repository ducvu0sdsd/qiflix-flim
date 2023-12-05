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

export interface FilmItemProp {
    displayDetail?: boolean,
    movie: MovieInterface,
    title: string
}

const FilmItem = ({ title, displayDetail = false, movie }: FilmItemProp) => {
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
                }
            }
        } else {
            if (displayDetail) {
                displayRef.current = setTimeout(() => {
                    const detailElement = $(`.detail-film-mini-${movie?._id}-${title.toLowerCase().split(' ').join('-')}`).get(0);
                    const info = $(`.detail-film-mini-${movie?._id}-${title.toLowerCase().split(' ').join('-')} .info`)
                    if (detailElement) {
                        detailElement.style.width = `${widthDetail}px`
                        detailElement.style.height = '100%'
                        detailElement.style.left = '0'
                        detailElement.style.top = '0'
                        info.css('display', 'flex')
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
        <div onMouseEnter={() => setWidthDetail(370)} onMouseLeave={() => setWidthDetail(0)} className="films__film-item">
            <div className={`detail-film-mini detail-film-mini-${movie?._id}-${title.toLowerCase().split(' ').join('-')}`}>
                <div className='col-lg-12 video-film'>
                    <video
                        style={{ backgroundColor: 'black' }}
                        className='col-lg-12 film'
                        muted
                        loop
                        autoPlay
                        src={movie?.trailerUrl}
                    />
                    <div className="btns col-lg-12">
                        <Link className='link' to={`/${movie.url}`}><button className='btn-watch'><i className='bx bx-play' ></i> Watch</button></Link>
                        <button className='btn-info'><i className='bx bx-info-circle' ></i></button>
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
        </div >
    )
}

export default FilmItem
