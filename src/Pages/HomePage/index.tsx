
import React, { useContext, useEffect, useState } from 'react'
import PrivateHeader from '../../Components/PrivateHeader'
import TypicalSection from '../../Components/TypicalSection'
import ListFilm from '../../Components/ListFilm'
import Footer from '../../Components/Footer'
import { ThemeContext, ThemeData, ThemeHandles } from '../../Components/Context'
import { useParams } from 'react-router-dom'
import { MovieInterface, MovieWatchingByUserIdInterface, UserInterface } from '../../Components/Context/interfaces'

const HomePage = () => {

    const { datas, handles } = useContext(ThemeContext) || {}

    const titleElement = document.querySelector('head title');
    if (titleElement) {
        titleElement.textContent = "Home Page";
    }

    const moviesWatching: MovieInterface[] | undefined = datas?.moviesWatching.map(item => {
        return item.movie
    })

    const newlyReleased: MovieInterface[] = []
    datas?.movies.forEach((item, index) => {
        if (index < 20) {
            newlyReleased.unshift(item)
        }
    })

    const koreaFilms: MovieInterface[] | undefined = datas?.movies.filter(item => {
        return item.country === "Korea"
    })

    const animes: MovieInterface[] | undefined = datas?.movies.filter(item => {
        return item.belong.includes("Anime")
    })

    const christmasFilms: MovieInterface[] | undefined = datas?.movies.filter(item => {
        return item.belong.includes("For Christmas")
    })

    return (
        <>
            <PrivateHeader users={datas?.users || []} currentUser={datas?.currentUser} />
            <TypicalSection movies={datas?.movies || []} />
            <ListFilm title={'Newly Released'} movies={newlyReleased || []} />
            {(moviesWatching && moviesWatching.length > 0) && <ListFilm title={'Continue Watching'} movies={moviesWatching} />}
            <ListFilm title={'For Christmas'} movies={christmasFilms || []} />
            <ListFilm title={'Korea Flims'} movies={newlyReleased || []} />
            <ListFilm title={'Anime'} movies={animes || []} />
            <Footer />
        </>
    )
}

export default HomePage
