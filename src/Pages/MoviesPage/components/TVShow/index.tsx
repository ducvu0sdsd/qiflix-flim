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
    useEffect(() => {
        datas?.movies.forEach(item => {
            if (item.listEpisode?.episodes) {
                if (item.listEpisode?.episodes.length == 1) {
                    setMovies(p => [...p, item])
                }
            }
        })
    }, [datas?.movies])

    return (
        <section className='list-movie-page' style={{ height: `${window.innerHeight}px` }}>
            <h4>Movies</h4>
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


