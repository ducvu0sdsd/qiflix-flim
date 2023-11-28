
import FilmItem from '../FilmItem'
import './listfilm.scss'
import React from 'react'

const ListFilm = () => {
    return (
        <section className='col-lg-12 list-film'>
            <h2>Prosperous</h2>
            <div className="wrapper-film col-lg-12">
                <div className="films">
                    <FilmItem displayDetail={true} title='dfsfsdf' />
                    <FilmItem displayDetail={true} title='dfsfsdf sdnusdnvs' />
                    <FilmItem title='dfsfsdf dssds' />
                </div>
            </div>
        </section>
    )
}

export default ListFilm
