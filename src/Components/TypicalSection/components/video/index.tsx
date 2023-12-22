import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MovieInterface } from '../../../Context/interfaces'
import { MovieDetail } from '../../../MovieDetail'

export interface VideoProps {
    index: number,
    movie: MovieInterface,
    setMovieDetail: React.Dispatch<React.SetStateAction<MovieDetail>>,
    movies: MovieInterface[]
}

const Video = ({ index, movie, setMovieDetail, movies }: VideoProps) => {

    const [ready, setReady] = useState<boolean>(false)

    const FilterText: (value: string, max: number) => string = (str, max) => {
        let origin = str.split(' ')
        if (origin.length > max) {
            let arr: string[] = origin.filter((item, index) => index < max)
            return arr.join(' ') + '...'
        }
        return str
    }
    return (
        <div key={index} className={'trailer col-lg-12 '} >
            <video
                className='col-lg-12'
                autoPlay
                muted
                loop
                onPlaying={() => setReady(true)}
                onWaiting={() => setReady(false)}
                src={movie.trailerUrl}
            />
            <div className='trailer-wrapper' style={!ready ? { backgroundImage: `url(${movie.thumbnail})` } : {}}></div>
            <div className='info'>
                <h2>{movie.title.split(' - ')[1]}</h2>
                <div className='description'>{FilterText(movie.description, 120)}</div>
                <div className="btns">
                    <Link className='link' to={`/${movie.url}`}><button className='btn-parent btn-watch'><i className='bx bx-play'></i> Watch Now</button></Link>
                    <button onClick={() => setMovieDetail({ display: true, movie: movie })} className='btn-parent btn-detail'><i className='bx bx-info-circle' ></i> Detail</button>
                </div>
            </div>
        </div>
    )
}

export default Video