
import React from 'react';
import PublicPage from './Pages/PublicPage';
import SignInPage from './Pages/SignInPage';
import { Route, Routes } from 'react-router-dom';
import SignUpPage from './Pages/SignUpPage';
import ManageProfilePage from './Pages/ManageProfilePage';
import HomePage from './Pages/HomePage';
import FilmViewingPage from './Pages/FilmViewingPage';

export interface RoutesType {
    name: string,
    component: React.ReactNode
}

function RoutesElement() {

    const routes: RoutesType[] = [
        { name: '', component: <PublicPage /> },
        { name: 'sign-in-page', component: <SignInPage /> },
        { name: 'sign-up-page', component: <SignUpPage /> },
        { name: 'manage-profile-page', component: <ManageProfilePage /> },
        { name: 'home-page', component: <HomePage /> },
        { name: 'film-viewing-page', component: <FilmViewingPage /> }
    ]

    return (
        <Routes>
            {routes.map((route, index) => {
                return (
                    <Route key={index} path={`/${route.name}`} element={route.component} />
                )
            })}
        </Routes>
    );
}

export default RoutesElement;