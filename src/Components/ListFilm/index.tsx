
import { MovieInterface } from '../Context/interfaces'
import FilmItem from '../FilmItem'
import './listfilm.scss'
import React, { useEffect, useState } from 'react'
import $ from 'jquery'

interface ListFilmProp {
    movies: MovieInterface[] | undefined,
    title: string,
    paddingLeft?: number,
    processes?: number[] | undefined
}


export interface MovieDetail {
    display: boolean
    movie: MovieInterface | undefined
}
const ListFilm = ({ movies, title, paddingLeft, processes }: ListFilmProp) => {
    const [load, setLoad] = useState(false)
    const [marginLeft, setMarginLeft] = useState<number>(0)

    useEffect(() => { setLoad(!load) }, [movies])

    const handleChange = (type: string) => {
        const wrapperEpisode = $(`.wrapper-${title.toLowerCase().split(' ').join('-')}`)
        const episodeItem = $('.film')
        if (wrapperEpisode.length > 0 && episodeItem.length > 0) {
            if (type === 'next') {
                setMarginLeft((p) => p + (parseInt(episodeItem.css('width').replace('px', ''))))
                wrapperEpisode.css('margin-left', `-${marginLeft + (parseInt(episodeItem.css('width').replace('px', '')))}px`)
            } else if (type === 'prev') {
                setMarginLeft((p) => p - (parseInt(episodeItem.css('width').replace('px', ''))))
                wrapperEpisode.css('margin-left', `-${marginLeft - (parseInt(episodeItem.css('width').replace('px', '')))}px`)
            }
        }
    }

    const handleReturnPosition: () => boolean = () => {
        const wrapperEpisode = $(`.wrapper-${title.toLowerCase().split(' ').join('-')}`)
        if (wrapperEpisode.length > 0) {
            if (parseInt(wrapperEpisode.css('width').replace('px', '')) - marginLeft < window.innerWidth) {
                return false
            } else {
                return true
            }
        } else {
            return true
        }
    }

    return (
        <section className='col-lg-12 list-film' style={{ paddingLeft: paddingLeft + 'px' }}>
            <h4>{title}</h4>
            <div className="wrapper-film col-lg-12">
                <div className='col-lg-12 films'>
                    <div className={`wrapper-${title.toLowerCase().split(' ').join('-')} wrapper`}>
                        {movies ?
                            <>
                                {movies.map((movie, index) => {
                                    return (
                                        <div key={index} className="film">
                                            <FilmItem title={title} displayDetail={true} movie={movie} process={processes ? processes[index] : 0} />
                                        </div>
                                    )
                                })}
                            </>
                            :
                            <>
                                <div
                                    style={{ position: 'absolute', top: '50%', left: '50%' }}
                                    className="spinner-border text-light" role="status" />
                            </>
                        }
                    </div>
                </div>
                {marginLeft !== 0 && <button onClick={() => handleChange('prev')} className='btn-action-prev btn-action'><i className='bx bxs-left-arrow'></i></button>}
                {handleReturnPosition() && <button onClick={() => handleChange('next')} className='btn-action-next btn-action'><i className='bx bxs-right-arrow' ></i></button>}
            </div>
        </section>
    )
}

export default ListFilm
