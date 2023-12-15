import React, { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../../../Components/Context'
import { TypeHTTP, apiUser } from '../../../../Utils/api'
import { MovieInterface } from '../../../../Components/Context/interfaces'
import FilmItem from '../../../../Components/FilmItem'
import './mylist.scss'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'


const Movies = () => {

    const { datas } = useContext(ThemeContext) || {}
    const [movies, setMovies] = useState<MovieInterface[]>([])
    const [countries, setCountries] = useState<string[]>([])
    const [title, setTitle] = useState<string>('Country')
    const [searchValues, setSearchValues] = useState<{ name: string, country: string }>({ name: '', country: 'Country' })

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

    useEffect(() => {
        setMovies([])
        apiUser({ path: `/movies/get-movies-by-country-and-name?country=${searchValues.country}&name=${searchValues.name}`, type: TypeHTTP.GET })
            .then(res => {
                setMovies(res)
            })
    }, [searchValues])


    return (
        <section className='list-movie-page' style={{ minHeight: `${window.innerHeight}px` }}>
            <div className='title'>
                <input type="text" onChange={(e: any) => setSearchValues({ name: e.target.value, country: searchValues.country })} className="form-control" placeholder="Enter Name" />
                <select className="form-select option-countries" onChange={(e: any) => setSearchValues({ name: searchValues.name, country: e.target.value })}>
                    <option value={'Country'}>Country</option>
                    {countries.map((country, index) => {
                        return (
                            <option key={index} value={country}>{country}</option>
                        )
                    })}
                </select>
            </div>
            {movies.length > 0 ?
                <div className='col-lg-12 my-list-movie' >
                    {movies.map((movie, index) => {
                        return (
                            <motion.div
                                initial={{ x: window.innerWidth * -1 }}
                                animate={{ x: 0 }}
                                exit={{ x: window.innerWidth * -1, transition: { duration: 0.2 } }}
                                key={index} className="film">
                                <Link className='link' to={`/${movie.url}`}>
                                    <img src={movie.thumbnail} width={"100%"} />
                                </Link>
                            </motion.div>
                        )
                    })}
                </div> :
                <div className='col-lg-12 no-result'>
                    No Results
                </div>
            }
        </section>
    )
}

export default Movies


