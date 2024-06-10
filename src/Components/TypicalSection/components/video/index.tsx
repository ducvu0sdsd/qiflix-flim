import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MovieInterface } from '../../../Context/interfaces'
import { MovieDetail } from '../../../MovieDetail'
import ReactPlayer from 'react-player'
import DailyMotionPlayer from 'react-player/dailymotion'
import Dailymotion from 'react-dailymotion';

export interface VideoProps {
    index: number,
    movie: MovieInterface | undefined,
    setMovieDetail: React.Dispatch<React.SetStateAction<MovieDetail>>,
    movies: MovieInterface[] | undefined,
    currentIndex: Number
}

const Video = ({ currentIndex, index, movie, setMovieDetail, movies }: VideoProps) => {

    const [ready, setReady] = useState<boolean>(false)
    const elementRef = useRef<HTMLDivElement>(null)

    const FilterText: (value: string, max: number) => string = (str, max) => {
        let origin = str.split(' ')
        if (origin.length > max) {
            let arr: string[] = origin.filter((item, index) => index < max)
            return arr.join(' ') + '...'
        }
        return str
    }

    useEffect(() => {
        if (index && currentIndex) {
            console.log(index, currentIndex)
            if (index === currentIndex) {
                setReady(true)
            } else {
                setReady(false)
            }
        }
    }, [currentIndex])

    return (
        <div ref={elementRef} key={index} className={'trailer col-lg-12 '} >
            {(movies && movie) ?
                <>
                    {ready === false ? <div className='trailer-wrapper' style={{ backgroundImage: `url(${movie.thumbnail})` }}></div>
                        :
                        <iframe
                            src={`https://www.dailymotion.com/embed/video/${movie.trailerUrl}?autoplay=1&controls=0&loop=1&mute=1`}
                            width="120%"
                            height="120%"
                            title="Dailymotion Video Player"
                            allow="autoplay; web-share" />
                    }
                    <div className='info'>
                        <h2>{movie.title.split(' - ')[1]}</h2>
                        <div className='description'>{FilterText(movie.description, 120)}</div>
                        <div className="btns">
                            <Link className='link' to={`/${movie.url}`}><button className='btn-parent btn-watch'><i className='bx bx-play'></i> Watch Now</button></Link>
                            <button onClick={() => setMovieDetail({ display: true, movie: movie })} className='btn-parent btn-detail'><i className='bx bx-info-circle' ></i> Detail</button>
                        </div>
                    </div>
                </>
                :
                <>
                    <div className="spinner-border text-light" role="status" />
                </>
            }
        </div >
    )
}

export default Video