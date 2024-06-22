import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'
import Footer from '../../Components/Footer';
import PrivateHeader from '../../Components/PrivateHeader';
import { ThemeContext } from '../../Components/Context';
import './detailFilm.scss'
import { MovieInterface } from '../../Components/Context/interfaces';
import ListFilm from '../../Components/ListFilm';
import { TypeHTTP, apiUser } from '../../Utils/api';
import { NotificationStatus } from '../../Components/Notification';

const DetailFilm = () => {

    const location = useLocation();
    const { state } = location;
    const movie: MovieInterface = state?.movie
    const { datas, handles } = useContext(ThemeContext) || {}
    const navigate = useNavigate()
    const newlyReleased: MovieInterface[] = []
    const moviesUnshift: MovieInterface[] = []
    const [favorites, setFavorites] = useState<string[] | undefined>([])

    useEffect(() => {
        setFavorites(datas?.currentUser?.liked)
    }, [datas?.currentUser])
    datas?.movies?.forEach((item, index) => {
        moviesUnshift.unshift(item)
    })
    moviesUnshift.forEach((item, index) => {
        if (newlyReleased.length <= 20) {
            newlyReleased.push(item)
        }
    })

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        if (!state?.movie) {
            navigate('/home-page')
        }
    }, [state])

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

    return (
        <motion.div
            initial={{ x: window.innerWidth * -1 }}
            animate={{ x: 0 }}
            exit={{ x: window.innerWidth, transition: { duration: 0.2 } }}
            style={{ overflow: 'hidden' }}
        >
            <PrivateHeader users={datas?.users || []} currentUser={datas?.currentUser} />
            <section className='wrapper-detail'>
                <div style={{ display: 'flex', gap: '3rem', color: 'white', fontSize: '18px' }}>
                    <img src={movie?.thumbnailVertical} width={'300px'} style={{ borderRadius: '8px' }} />
                    <div className='info'>
                        <h1 style={{ fontWeight: 'bold' }}>{movie?.title}</h1>
                        <span>{movie.yearRelease}</span>
                        <span>Number Of Episode: {movie.listEpisode?.numberOfEpisodes}</span>
                        <span>Genre: {movie.genres.join(', ')}</span>
                        <span style={{ color: 'white' }}>{movie.description}</span>
                        <span>Casts: {movie.actors.join(', ')}</span>
                        <span>Director: {movie.directors.join(', ')}</span>
                        <div className='btns'>
                            <button onClick={() => navigate(`/${movie.url}`)} className='btn-parent btn-watch' style={{ backgroundColor: 'red', color: 'white' }}><i className='bx bx-play'></i> Watch Now</button>
                            {favorites?.includes(movie._id) ?
                                <button onClick={() => handleUnFavoriteFlim(movie._id)} className='btn-parent btn-like'><i className='bx bxs-star' style={{ fontSize: '25px' }}></i></button>
                                :
                                <button onClick={() => handleFavoriteFlim(movie._id)} className='btn-parent btn-like'><i className='bx bx-star' style={{ fontSize: '25px' }}></i></button>
                            }
                        </div>
                    </div>
                </div>
                <ListFilm title={'Maybe You Like To Watch'} movies={newlyReleased} />
            </section>
            <Footer />
        </motion.div>
    )
}

export default DetailFilm