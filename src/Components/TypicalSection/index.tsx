
import './typicalsection.scss'
import React, { useEffect, useState } from 'react'
import Trailer from '../../resources/trailer.mp4'
import { Link } from 'react-router-dom'
import { MovieInterface } from '../Context/interfaces'

interface TypicalSectionProps {
    movies: MovieInterface[]
}

const TypicalSection = ({ movies }: TypicalSectionProps) => {

    const FilterText: (value: string, max: number) => string = (str, max) => {
        let origin = str.split(' ')
        if (origin.length > max) {
            let arr: string[] = origin.filter((item, index) => index < max)
            return arr.join(' ') + '...'
        }
        return str
    }

    return (
        <section id='typical-section' className='col-lg-12' style={{ height: `${window.innerHeight}px` }}>
            {movies.map((movie, index) => {
                if (index == 0)
                    return (
                        <div key={index} className='trailer col-lg-12' style={{ height: '570px' }}>
                            {/* style={{ height: `${window.innerWidth / 2.67}px` }} */}
                            <video
                                className='col-lg-12'
                                autoPlay
                                muted
                                loop
                                src={movie.trailerUrl}
                            />
                            <div className='trailer-wrapper'></div>
                            <div className='info'>
                                <h2>{movie.title.split(' - ')[1]}</h2>
                                <div className='description'>{FilterText(movie.description, 120)}</div>
                                <div className="btns">
                                    <Link className='link' to={`/${movie.url}`}><button className='btn-parent btn-watch'><i className='bx bx-play'></i> Watch Now</button></Link>
                                    <button className='btn-parent btn-detail'><i className='bx bx-info-circle' ></i> Detail</button>
                                </div>
                            </div>
                        </div>
                    )
            })}
        </section>
    )
}

export default TypicalSection
