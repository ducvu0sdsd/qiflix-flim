
import { MovieInterface } from '../Context/interfaces'
import FilmItem from '../FilmItem'
import './listfilm.scss'
import React from 'react'

interface ListFilmProp {
    movies: MovieInterface[]
}

const ListFilm = ({ movies }: ListFilmProp) => {
    return (
        <section className='col-lg-12 list-film'>
            <h2>Prosperous</h2>
            <div className="wrapper-film col-lg-12">
                {movies.map((movie, index) => {
                    return (
                        <div key={index} className="films">
                            <FilmItem displayDetail={true} movie={movie} />
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default ListFilm
