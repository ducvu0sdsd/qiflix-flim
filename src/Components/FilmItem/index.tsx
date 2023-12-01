import './filmitem.scss'
import React, { useEffect, useRef, useState } from 'react'
import Trailer from '../../resources/trailer.mp4'
import $ from 'jquery'
import { MovieInterface } from '../Context/interfaces'
import { Link } from 'react-router-dom'

export interface FilmItemProp {
    displayDetail?: boolean,
    movie: MovieInterface
}

const FilmItem = ({ displayDetail = false, movie }: FilmItemProp) => {
    const titleCustom = movie?.title.split(' ').join('-')
    const displayRef = useRef<NodeJS.Timeout | null>(null)
    const [widthDetail, setWidthDetail] = useState<number>(0)

    useEffect(() => {
        if (widthDetail === 0) {
            if (displayRef.current) {
                clearTimeout(displayRef.current);
                const detailElement = $(`.detail-film-mini-${movie?._id}`).get(0);
                if (detailElement) {
                    detailElement.style.width = `${widthDetail}px`
                    detailElement.style.height = '0px'
                    detailElement.style.left = '50%'
                    detailElement.style.top = '50%'
                }
            }
        } else {
            if (displayDetail) {
                displayRef.current = setTimeout(() => {
                    const detailElement = $(`.detail-film-mini-${movie?._id}`).get(0);
                    if (detailElement) {
                        detailElement.style.width = `${widthDetail}px`
                        detailElement.style.height = '100%'
                        detailElement.style.left = '0'
                        detailElement.style.top = '0'
                    }
                }, 500);
            }
        }
    }, [widthDetail])

    return (
        <div onMouseEnter={() => setWidthDetail(370)} onMouseLeave={() => setWidthDetail(0)} className="films__film-item">
            <div className={`detail-film-mini detail-film-mini-${movie?._id}`}>
                <div className='col-lg-12 video-film'>
                    <video
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
                    <span>{movie?.yearRelease} | 13P | {movie?.country} | 1 Part | HD</span>
                    <button><i className='bx bx-plus'></i></button>
                </div>
            </div>
            <Link className='link' to={`/${movie.url}`}><img className='themenail' src={movie?.thumbnail} width={'100%'} /></Link>
        </div>
    )
}

export default FilmItem
