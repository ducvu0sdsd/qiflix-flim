
import { motion } from 'framer-motion'
import './moviedetail.scss'
import React, { useContext, useEffect } from 'react'
import $ from 'jquery'
import Comments from '../../Pages/FilmViewingPage/components/Comments'
import { Link } from 'react-router-dom'
import { MovieInterface } from '../Context/interfaces'
import { ThemeContext } from '../Context'
import { TypeHTTP, apiUser } from '../../Utils/api'
import { NotificationStatus } from '../Notification'
import ReactPlayer from 'react-player'

interface MovieDetailProps {
    movieDetail: MovieDetail
    setMovieDetail: React.Dispatch<React.SetStateAction<MovieDetail>>
}

export interface MovieDetail {
    display: boolean
    movie: MovieInterface | undefined
}

const MovieDetail = ({ movieDetail, setMovieDetail }: MovieDetailProps) => {

    const { datas, handles } = useContext(ThemeContext) || {}


    const handleUnFavoriteFlim = (movie_id: string) => {
        apiUser({ path: `/users/remove-liked/${datas?.currentUser?._id}`, body: { movie_id: movie_id }, type: TypeHTTP.PUT })
            .then(result => {
                handles?.setCurrentUser(result)
                handles?.handleSetNotification({ type: NotificationStatus.SUCCESS, message: 'Remove movie to my list is successful' })
                apiUser({ path: `/users/${datas?.account?._id}`, type: TypeHTTP.GET })
                    .then(res => {
                        handles?.setUsers(res)
                    })
            })
    }

    const handleFavoriteFlim = (movie_id: string) => {
        apiUser({ path: `/users/add-liked/${datas?.currentUser?._id}`, body: { movie_id: movie_id }, type: TypeHTTP.PUT })
            .then(result => {
                handles?.setCurrentUser(result)
                handles?.handleSetNotification({ type: NotificationStatus.SUCCESS, message: 'Add movie to my list is successful' })
                apiUser({ path: `/users/${datas?.account?._id}`, type: TypeHTTP.GET })
                    .then(res => {
                        handles?.setUsers(res)
                    })
            })
    }

    return (
        <section
            onClick={() => setMovieDetail({ display: false, movie: undefined })}
            className='movie-detail-wrapper col-lg-12'
        >
            {(movieDetail.display && movieDetail.movie) && (
                <motion.div
                    key={movieDetail.display ? 'visible' : 'hidden'}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    initial={{ opacity: 0, transform: 'translateX(-50%) translateY(-55%)' }}
                    animate={{ opacity: 1, transform: 'translateX(-50%) translateY(-50%)' }}
                    exit={{ opacity: 0, transform: 'translateX(-50%) translateY(-55%)' }}
                    transition={{ duration: 0.8 }}
                    className='movie-detail'
                >
                    <div className='video-area col-lg-12'>
                        <ReactPlayer
                            className='col-lg-12 trailer'
                            playing
                            muted
                            loop
                            url={movieDetail.movie.trailerUrl}
                        />
                        <span className='title-movie'>
                            <span>{movieDetail.movie.title.split(' - ')[1]}</span>
                            <span>{movieDetail.movie.title.split(' - ')[0]}</span>
                        </span>
                        <div className="btns">
                            <Link className='link' to={`/${movieDetail.movie.url}`}><button className='btn-watch-now'><i className='bx bx-play'></i> Watch Now</button></Link>
                            {!datas?.currentUser?.liked?.includes(movieDetail.movie._id) ?
                                <button onClick={() => handleFavoriteFlim(movieDetail.movie?._id || '')} className='btn-add-list'><i className='bx bx-plus' ></i> List</button>
                                :
                                <button onClick={() => handleUnFavoriteFlim(movieDetail.movie?._id || '')} className='btn-add-list-checked'><i className="fa-solid fa-check"></i> List</button>
                            }
                        </div>
                        <button onClick={() => setMovieDetail({ display: false, movie: undefined })} className='btn-exit'><i className="fa-regular fa-circle-xmark"></i></button>
                    </div>
                    <div className='col-lg-12 info-actions'>
                        <div className="col-lg-9 info">
                            <span className='title col-lg-12'>
                                <span>{`E${movieDetail.movie.listEpisode?.episodes.length}`}</span>
                                <div className='box' />
                                <span>{movieDetail.movie.country}</span>
                                <div className='box' />
                                <span>1 Part</span>
                                <div className='box' />
                                <span>{movieDetail.movie.yearRelease}</span>
                                <div className='box' />
                                <span>HD</span>
                            </span>
                            <span className='description'>
                                {movieDetail.movie.description}
                            </span>
                        </div>
                        <div className="col-lg-3 actions">
                            <a href='#comments'>
                                <button>
                                    <i className="bx bx-chat"></i>
                                    <span>Comments</span>
                                </button>
                            </a>
                            <button>
                                <i className="bx bx-share"></i>
                                <span>Share</span>
                            </button>
                        </div>
                    </div>
                    <Comments movie_id={movieDetail.movie._id} user_id={datas?.currentUser?._id || ''} user_avatar={datas?.currentUser?.avatar || ''} />
                </motion.div>
            )}
        </section>
    );
};
export default MovieDetail