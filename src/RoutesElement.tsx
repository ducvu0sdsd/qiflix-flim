
import React, { useContext, useEffect } from 'react';
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

export interface RoutesType {
    name: string,
    component: React.ReactNode
}

function RoutesElement() {

    const navigate = useNavigate()
    const { datas, handles } = useContext(ThemeContext) || {}

    const CheckSignOut = () => {
        const { pathname } = useLocation();

        useEffect(() => {
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
        }, [pathname]);

        return <></>;
    };


    const CheckSignIn = () => {
        const { pathname } = useLocation();
        useEffect(() => {
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
        }, [pathname]);

        return <></>
    };

    const CheckCurrentUser = () => {
        const { pathname } = useLocation();
        useEffect(() => {
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
        }, []);
        return <></>
    }

    const routes: RoutesType[] = [
        { name: '', component: <PublicPage /> },
        { name: 'sign-in-page', component: <SignInPage /> },
        { name: 'sign-up-page/:email', component: <SignUpPage /> }
    ]
    const routesUser: RoutesType[] = [
        { name: ':url', component: <ManageProfilePage /> },
        { name: 'home-page', component: <HomePage /> },
        { name: 'manage-movies-page', component: <ManageMoviesPage /> },
        { name: 'my-list-page', component: <MyListPage /> },
        { name: 'tvshow-page', component: <TVShowPage /> },
        { name: 'movies-page', component: <MoviesPage /> },
        ...(datas?.movies ? datas.movies.map((movie) => {
            return { name: movie.url, component: <FilmViewingPage data={movie} currentUser={datas.currentUser || undefined} /> }
        }) : []),
    ]

    return (
        <Routes>
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
    );
}

export default RoutesElement;