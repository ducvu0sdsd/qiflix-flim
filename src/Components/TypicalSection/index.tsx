
import './typicalsection.scss'
import React, { useEffect, useState } from 'react'
import Trailer from '../../resources/trailer.mp4'
import { Link } from 'react-router-dom'
import { MovieInterface } from '../Context/interfaces'
import $ from 'jquery'
import { url } from 'inspector'
import Video from './components/video'

interface TypicalSectionProps {
    movies: MovieInterface[] | undefined
}

export interface MovieDetail {
    display: boolean
    movie: MovieInterface | undefined
}

const TypicalSection = ({ movies }: TypicalSectionProps) => {

    const [currentIndex, setCurrentIndex] = useState<number>(1)
    const [totalMovies, setTotalMovies] = useState(0)

    useEffect(() => {
        if (movies) {
            if (movies.length <= 6) {
                setTotalMovies(movies.length - 1)
            } else {
                setTotalMovies(5)
            }
        }
    }, [movies])

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
            typical?.prepend(trailers[totalMovies - 1])
            setCurrentIndex(currentIndex === 0 ? totalMovies : currentIndex - 1)
        } else {
            const typical = document.querySelector('#typical-section .trailers')
            const trailers = document.querySelectorAll('.trailer')
            typical?.append(trailers[0])
            setCurrentIndex(currentIndex === totalMovies ? 0 : currentIndex + 1)
        }
    }

    return (
        <section id='typical-section' className='col-lg-12' style={window.innerWidth >= 600 ? { height: `${window.innerHeight}px` } : { width: `${window.innerWidth}px` }}>
            <Video movies={movies} />
        </section>
    )
}

export default TypicalSection
