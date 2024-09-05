
import React, { useContext, useEffect, useState } from 'react';
import PublicPage from './Pages/PublicPage';
import SignInPage from './Pages/SignInPage';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import SignUpPage from './Pages/SignUpPage';
import ManageProfilePage from './Pages/ManageProfilePage';
import HomePage from './Pages/HomePage';
import FilmViewingPage from './Pages/FilmViewingPage';
import axios from 'axios';
import { ThemeContext } from './Components/Context';
import ManageMoviesPage from './Pages/ManageMoviesPage';
import MyListPage from './Pages/MyListPage';
import TVShowPage from './Pages/TVShowPage';
import MoviesPage from './Pages/MoviesPage';
import FindMoviesPage from './Pages/FindMoviesPage';
import { AnimatePresence } from 'framer-motion';
import QiflixPage from './Pages/QiflixPage';
import MyAccountPage from './Pages/MyAccountPage';
import DetailFilm from './Pages/DetailFilm';
import Source from './Pages/Source';
import FilmSource from './Pages/FilmSource';

export interface RoutesType {
    name: string,
    component: React.ReactNode
}

function RoutesElement() {
    const location = useLocation()
    const navigate = useNavigate()
    const { datas, handles } = useContext(ThemeContext) || {}


    const CheckSignOut = () => {
        const { pathname } = useLocation();
        useEffect(() => {
            try {
                const accessTokenString = localStorage.getItem('accessToken');
                const refreshTokenString = localStorage.getItem('refreshToken');

                if (accessTokenString && refreshTokenString) {
                    const accessToken = JSON.parse(accessTokenString);
                    const refreshToken = JSON.parse(refreshTokenString);
                    axios.get('/auths/check-access-token', {
                        headers: {
                            Authorization: 'Access ' + accessToken
                        }
                    })
                        .catch(() => {
                            axios.post('/auths/refresh-token', {}, {
                                headers: {
                                    Authorization: 'Refresh ' + refreshToken
                                }
                            })
                                .then(res => {
                                    localStorage.setItem('accessToken', JSON.stringify(res.data.accessToken))
                                    localStorage.setItem('refreshToken', JSON.stringify(res.data.refreshToken))
                                })
                                .catch(() => {
                                    localStorage.removeItem('accessToken')
                                    localStorage.removeItem('refreshToken')
                                    navigate('/')
                                })
                        })
                }
                else {
                    if (pathname !== '/' && pathname !== '/sign-in-page' && !pathname.includes('/sign-up-page')) {
                        navigate('/');
                    }
                }
            } catch (error) {
                window.location.reload()
            }
        }, [pathname]);

        return <></>;
    };


    const CheckSignIn = () => {
        const { pathname } = useLocation();
        useEffect(() => {
            try {
                const accessTokenString = localStorage.getItem('accessToken');
                const refreshTokenString = localStorage.getItem('refreshToken');
                if (accessTokenString && refreshTokenString) {
                    const accessToken = JSON.parse(accessTokenString);
                    const refreshToken = JSON.parse(refreshTokenString);
                    axios.get('/auths/check-access-token', {
                        headers: {
                            Authorization: 'Access ' + accessToken
                        }
                    })
                        .then(res => {
                            if (pathname === '/' || pathname === '/sign-in-page' || pathname.includes('/sign-up-page')) {
                                navigate('/manage-profile-page')
                            }
                        })
                        .catch(() => {
                            axios.post('/auths/refresh-token', {}, {
                                headers: {
                                    Authorization: 'Refresh ' + refreshToken
                                }
                            })
                                .then(res => {
                                    localStorage.setItem('accessToken', JSON.stringify(res.data.accessToken))
                                    localStorage.setItem('refreshToken', JSON.stringify(res.data.refreshToken))
                                    if (pathname === '/' || pathname === '/sign-in-page' || pathname.includes('/sign-up-page')) {
                                        navigate('/manage-profile-page')
                                    }
                                })
                                .catch(() => {
                                    localStorage.removeItem('accessToken')
                                    localStorage.removeItem('refreshToken')
                                    navigate('/')
                                })
                        })
                }
            } catch (error) {
                window.location.reload()
            }
        }, [pathname]);

        return <></>
    };

    const CheckCurrentUser = () => {
        const { pathname } = useLocation();
        useEffect(() => {
            if (!datas?.currentUser) {
                const json = localStorage.getItem('currentUser')
                const username = json && JSON.parse(json)
                if (username !== null) {
                    if (datas?.users) {
                        const arr = datas?.users?.filter(item => item.name === username)
                        if (arr.length > 0) {
                            if (handles) {
                                handles.setCurrentUser(arr[0])
                            }
                        }
                    }
                }
            }
        }, [pathname]);
        return <></>
    }

    const routes: RoutesType[] = [
        { name: '', component: <PublicPage /> },
        { name: 'sign-in-page', component: <SignInPage /> },
        { name: 'sign-up-page/:email', component: <SignUpPage /> },
        { name: 'source', component: <Source /> }
    ]
    const routesUser: RoutesType[] = [
        { name: ':url', component: <ManageProfilePage /> },
        { name: 'home-page', component: <HomePage /> },
        { name: 'manage-movies-page', component: <ManageMoviesPage /> },
        { name: 'my-list-page', component: <MyListPage /> },
        { name: 'tvshow-page', component: <TVShowPage /> },
        { name: 'movies-page', component: <MoviesPage /> },
        { name: 'find-movies-page', component: <FindMoviesPage /> },
        { name: 'my-account-page', component: <MyAccountPage /> },
        { name: 'manage-profile-page', component: <ManageProfilePage /> },
        { name: 'detail-movie-page', component: <DetailFilm /> },
        ...(datas?.movies ? datas.movies.map((movie) => {
            return { name: movie.url, component: <FilmViewingPage data={movie} currentUser={datas.currentUser || undefined} /> }
        }) : []),
        ...(datas?.movies ? datas.movies.map((movie) => {
            return { name: `source-film/${movie.url}`, component: <FilmSource data={movie} currentUser={datas.currentUser || undefined} /> }
        }) : []),
    ]


    return (
        <AnimatePresence>
            <Routes location={location} key={location.pathname}>
                {routes.map((route, index) => {
                    return (
                        <Route key={index} path={`/${route.name}`} element={<><CheckSignIn />{route.component}</>} />
                    )
                })}
                {routesUser.map((route, index) => {
                    return (
                        <Route key={index} path={`/${route.name}`} element={<><CheckSignOut /><CheckCurrentUser />{route.component}</>} />
                    )
                })}

            </Routes>
        </AnimatePresence>
    );
}

export default RoutesElement;