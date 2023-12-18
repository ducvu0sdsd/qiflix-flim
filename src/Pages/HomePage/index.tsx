
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

export interface MoviesWatching {
    movies: MovieInterface
    process: number
}

const HomePage = () => {

    const { datas, handles } = useContext(ThemeContext) || {}
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
    datas?.movies.forEach((item, index) => {
        if (newlyReleased.length <= 20) {
            newlyReleased.unshift(item)
        }
    })

    const koreaFilms: MovieInterface[] | undefined = datas?.movies.filter(item => {
        return item.country === "Korea"
    })

    const hongKongFilms: MovieInterface[] | undefined = datas?.movies.filter(item => {
        return item.country === "Hong Kong"
    })

    const animes: MovieInterface[] | undefined = datas?.movies.filter(item => {
        return item.belong.includes("Anime")
    })

    const christmasFilms: MovieInterface[] | undefined = datas?.movies.filter(item => {
        return item.belong.includes("For Christmas")
    })

    return (
        <motion.div
            initial={{ x: window.innerWidth * -1 }}
            animate={{ x: 0 }}
            exit={{ x: window.innerWidth, transition: { duration: 0.2 } }}
        >
            <Helmet>
                <title>Home Page</title>
                <meta property="og:title" content="Qiflix" />
                <meta property="og:image" content={QiflixMeta} />
                <meta property="og:url" content="https://qiflix.vercel.app/" />
            </Helmet>
            {movieDetail.display && <MovieDetail movieDetail={movieDetail} setMovieDetail={setMovieDetail} />}
            <PrivateHeader users={datas?.users || []} currentUser={datas?.currentUser} />
            <TypicalSection movieDetail={movieDetail} setMovieDetail={setMovieDetail} movies={datas?.movies || []} />
            <ListFilm movieDetail={movieDetail} setMovieDetail={setMovieDetail} title={'Newly Released'} movies={newlyReleased || []} />
            {(moviesWatching && moviesWatching.length > 0) && <ListFilm movieDetail={movieDetail} setMovieDetail={setMovieDetail} title={'Continue Watching'} movies={moviesWatching.map(item => item.movies)} processes={moviesWatching.map(item => item.process)} />}
            <ListFilm movieDetail={movieDetail} setMovieDetail={setMovieDetail} title={'For Christmas'} movies={christmasFilms || []} />
            <ListFilm movieDetail={movieDetail} setMovieDetail={setMovieDetail} title={'Korea Flims'} movies={koreaFilms || []} />
            <ListFilm movieDetail={movieDetail} setMovieDetail={setMovieDetail} title={'Hong Kong Flims'} movies={hongKongFilms || []} />
            <ListFilm movieDetail={movieDetail} setMovieDetail={setMovieDetail} title={'Anime'} movies={animes || []} />
            <Footer />
        </motion.div>
    )
}

export default HomePage
