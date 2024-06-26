import React, { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../../../Components/Context'
import { TypeHTTP, apiUser } from '../../../../Utils/api'
import { MovieInterface } from '../../../../Components/Context/interfaces'
import FilmItem from '../../../../Components/FilmItem'
import './mylist.scss'
import { Link } from 'react-router-dom'

const MyList = () => {

    const { datas } = useContext(ThemeContext) || {}
    const [moviesLiked, setMoviesLiked] = useState<MovieInterface[]>([])
    useEffect(() => {
        if (datas?.currentUser) {
            apiUser({ path: `/movies/get-movies-liked-by-user/${datas?.currentUser?._id}`, type: TypeHTTP.GET })
                .then(result => {
                    setMoviesLiked(result)
                })
        }
    }, [datas?.currentUser])

    return (
        <section className='list-movie-page' style={{ minHeight: `${window.innerHeight}px` }}>
            <h4>My List</h4>
            <div className='col-lg-12 my-list-movie' >
                {moviesLiked.map((movie, index) => {
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

export default MyList


