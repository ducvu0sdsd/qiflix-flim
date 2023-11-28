import './filmitem.scss'
import React, { useEffect, useRef, useState } from 'react'
import Trailer from '../../resources/trailer.mp4'
import $ from 'jquery'

export interface FilmItemProp {
    displayDetail?: boolean,
    title: string
}

const FilmItem = ({ displayDetail = false, title }: FilmItemProp) => {
    const titleCustom = title.split(' ').join('-')
    const displayRef = useRef<NodeJS.Timeout | null>(null)
    const [widthDetail, setWidthDetail] = useState<number>(0)

    useEffect(() => {
        if (widthDetail === 0) {
            if (displayRef.current) {
                clearTimeout(displayRef.current);
                const detailElement = $(`.detail-film-mini-${titleCustom}`).get(0);
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
                    const detailElement = $(`.detail-film-mini-${titleCustom}`).get(0);
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
        <div onMouseOver={() => setWidthDetail(370)} onMouseOut={() => setWidthDetail(0)} className="films__film-item">
            <div className={`detail-film-mini detail-film-mini-${titleCustom}`}>
                <div className='col-lg-12 video-film'>
                    <video
                        className='col-lg-12'
                        muted
                        loop
                        autoPlay
                        src={Trailer}
                    />
                    <div className="btns col-lg-12">
                        <button className='btn-watch'><i className='bx bx-play' ></i> Watch</button>
                        <button><i className='bx bx-info-circle' ></i></button>
                    </div>
                </div>
                <div className="info">
                    <span>2023 | 13P | Korea | 1 Part | HD</span>
                    <button><i className='bx bx-plus'></i></button>
                </div>
            </div>
            <img className='themenail' src='https://www.hdwallpapers.in/download/x_men_days_of_future_past_banner-1920x1080.jpg' width={'100%'} />
        </div>
    )
}

export default FilmItem
