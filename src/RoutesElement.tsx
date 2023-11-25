
import React from 'react';
import PublicPage from './Pages/PublicPage';
import SignInPage from './Pages/SignInPage';
import { Route, Routes } from 'react-router-dom';
import SignUpPage from './Pages/SignUpPage';

export interface RoutesType {
    name: string,
    component: React.ReactNode
}

function RoutesElement() {

    const routes: RoutesType[] = [
        { name: '', component: <PublicPage /> },
        { name: 'sign-in-page', component: <SignInPage /> },
        { name: 'sign-up-page', component: <SignUpPage /> }
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