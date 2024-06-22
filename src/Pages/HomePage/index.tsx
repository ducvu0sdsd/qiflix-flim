
import React, { useContext, useEffect, useState } from 'react'
import PrivateHeader from '../../Components/PrivateHeader'
import TypicalSection from '../../Components/TypicalSection'
import ListFilm from '../../Components/ListFilm'
import Footer from '../../Components/Footer'
import { ThemeContext, ThemeData, ThemeHandles } from '../../Components/Context'
import $ from 'jquery'
import { MovieInterface, MovieWatchingByUserIdInterface, UserInterface } from '../../Components/Context/interfaces'
import { TypeHTTP, apiUser } from '../../Utils/api'
import { motion } from 'framer-motion'
import MovieDetail from '../../Components/MovieDetail'
import { Helmet } from 'react-helmet';
import QiflixMeta from '../../resources/qiflix-meta.png'
import { shuffleArray } from '../../Utils/movie'
import NewlyReleased from '../../Components/NewlyReleased'
import { belongs } from '../ManageMoviesPage/components/ManageMovies/datas'

export interface MoviesWatching {
    movies: MovieInterface
    process: number
}

const HomePage = () => {

    const { datas, handles } = useContext(ThemeContext) || {}
    const [movieTypical, setMovieTypical] = useState<MovieInterface[] | undefined>(undefined)
    const [movieDetail, setMovieDetail] = useState<{ display: boolean, movie: MovieInterface | undefined }>({
        display: false,
        movie: undefined
    })

    useEffect(() => {
        if (movieDetail.display === true) {
            $('body').css('overflow', 'hidden')
        } else {
            $('body').css('overflow', 'visible')
        }
    }, [movieDetail.display])

    useEffect(() => {
        if (datas?.movies === undefined) {

        } else {
            setMovieTypical(shuffleArray(datas?.movies.filter(item => item.belong.includes('Typical')) || []))
        }
    }, [datas?.movies])

    useEffect(() => {
        if (datas?.account) {
            apiUser({ path: `/users/${datas.account?._id}`, type: TypeHTTP.GET })
                .then(result => {
                    const res: UserInterface[] = result
                    handles?.setUsers(res)
                    const json = localStorage.getItem('currentUser')
                    const username = json && JSON.parse(json)
                    if (username !== null) {
                        const arr = res.filter(item => item.name === username)
                        if (arr.length > 0) {
                            if (handles) {
                                handles.setCurrentUser(arr[0])
                            }
                        }
                    }
                })
        }
    }, [datas?.account])

    const titleElement = document.querySelector('head title');
    if (titleElement) {
        titleElement.textContent = "Home Page";
    }

    const moviesWatching: MoviesWatching[] | undefined = datas?.moviesWatching.map(item => {
        return {
            movies: item.movie,
            process: item.process
        }
    })

    const newlyReleased: MovieInterface[] = []
    const moviesUnshift: MovieInterface[] = []
    datas?.movies?.forEach((item, index) => {
        moviesUnshift.unshift(item)
    })
    moviesUnshift.forEach((item, index) => {
        if (newlyReleased.length <= 20) {
            newlyReleased.push(item)
        }
    })

    return (
        <motion.div
            initial={{ x: window.innerWidth * -1 }}
            animate={{ x: 0 }}
            exit={{ x: window.innerWidth, transition: { duration: 0.2 } }}
            style={{ overflow: 'hidden' }}
        >
            <PrivateHeader users={datas?.users || []} currentUser={datas?.currentUser} />
            <TypicalSection movies={movieTypical} />
            {/* {window.innerWidth >= 600 && <><br /><br /></>} */}
            <NewlyReleased title={'Newly Released'} movies={newlyReleased} processes={moviesWatching?.map(item => item.process)} />
            {(moviesWatching && moviesWatching.length > 0) && <ListFilm title={'Continue Watching'} movies={moviesWatching.map(item => item.movies)} processes={moviesWatching.map(item => item.process)} />}
            {belongs.map((item, index) => {
                const movies = shuffleArray(datas?.movies?.filter(movie => movie.belong.includes(item)) || [])
                if (movies.length > 4) {
                    return <ListFilm key={index} title={item} movies={movies} processes={moviesWatching?.map(item => item.process)} />
                }
            })}
            <Footer />
        </motion.div>
    )
}

export default HomePage
