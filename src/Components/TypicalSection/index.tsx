
import './typicalsection.scss'
import React, { useEffect, useState } from 'react'
import Trailer from '../../resources/trailer.mp4'
import { Link } from 'react-router-dom'
import { MovieInterface } from '../Context/interfaces'
import $ from 'jquery'
import { url } from 'inspector'
import Video from './components/video'

interface TypicalSectionProps {
    movies: MovieInterface[]
    movieDetail: MovieDetail
    setMovieDetail: React.Dispatch<React.SetStateAction<MovieDetail>>
}

export interface MovieDetail {
    display: boolean
    movie: MovieInterface | undefined
}

const TypicalSection = ({ movies, setMovieDetail, movieDetail }: TypicalSectionProps) => {

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'ArrowLeft') {
                event.preventDefault();
                handleClickTrailer(true)
            } else if (event.code === 'ArrowRight') {
                event.preventDefault();
                handleClickTrailer(false)
            }
        }
        document.addEventListener('keydown', handleKeyDown);
    }, [])

    const handleClickTrailer = (prev: boolean) => {
        if (prev) {
            const typical = document.querySelector('#typical-section .trailers')
            const trailers = document.querySelectorAll('.trailer')
            typical?.prepend(trailers[trailers.length - 1])
        } else {
            const typical = document.querySelector('#typical-section .trailers')
            const trailers = document.querySelectorAll('.trailer')
            typical?.append(trailers[0])
        }
    }

    return (
        <section id='typical-section' className='col-lg-12' style={window.innerWidth >= 600 ? { height: `${window.innerHeight}px` } : { width: `${window.innerWidth}px` }}>
            <div className="btn-actions">
                <button onClick={() => handleClickTrailer(true)}><i className='bx bx-chevron-left'></i></button>
                <button onClick={() => handleClickTrailer(false)}><i className='bx bx-chevron-right'></i></button>
            </div>
            <div className='trailers'>
                {movies.map((movie, index) => {
                    if (index <= 5) {
                        return (
                            <Video index={index} movie={movie} movies={movies} setMovieDetail={setMovieDetail} />
                        )
                    }
                })}
            </div>
        </section>
    )
}

export default TypicalSection
