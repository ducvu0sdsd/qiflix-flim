import React, { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../../../Components/Context'
import { TypeHTTP, apiUser } from '../../../../Utils/api'
import { MovieInterface } from '../../../../Components/Context/interfaces'
import FilmItem from '../../../../Components/FilmItem'
import './mylist.scss'
import { Link } from 'react-router-dom'

const Movies = () => {

    const { datas } = useContext(ThemeContext) || {}
    const [movies, setMovies] = useState<MovieInterface[]>([])
    const [countries, setCountries] = useState<string[]>([])
    const [title, setTitle] = useState<string>('Country')
    useEffect(() => {
        setMovies(datas?.movies || [])
        const array: string[] = []
        datas?.movies.forEach(movie => {
            if (!array.includes(movie.country)) {
                array.push(movie.country)
            }
        })
        setCountries(array)
    }, [datas?.movies])

    const handleChangeMovies = (e: any) => {
        const array: MovieInterface[] = []
        if (e.target.value === 'Country') {
            setMovies(datas?.movies || [])
            setTitle('Country')
        } else {
            datas?.movies.forEach(movie => {
                if (movie.country === e.target.value) {
                    array.push(movie)
                }
            })
            setMovies(array)
            setTitle(e.target.value)
        }
    }

    return (
        <section className='list-movie-page' style={{ minHeight: `${window.innerHeight}px` }}>
            <div className='title'>
                <h4>{title}</h4>
                <select className="form-select option-countries" onChange={handleChangeMovies}>
                    <option value={'Country'}>Country</option>
                    {countries.map((country, index) => {
                        return (
                            <option key={index} value={country}>{country}</option>
                        )
                    })}
                </select>
            </div>
            <div className='col-lg-12 my-list-movie' >
                {movies.map((movie, index) => {
                    return (
                        <div key={index} className="film">
                            <Link className='link' to={`/${movie.url}`}>
                                <img src={movie.thumbnail} width={"100%"} />
                            </Link>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default Movies


