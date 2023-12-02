import React, { createContext, useContext, useEffect, useState } from "react";
import { AccountInterface, MovieInterface, UserInterface } from "./interfaces";
import { TypeHTTP, apiUser } from "../../Utils/api";

export interface ThemeContextProviderProps {
    children: React.ReactNode;
}

export interface ThemeData {
    users: UserInterface[] | undefined
    account: AccountInterface | undefined
    currentUser: UserInterface | undefined
    movies: MovieInterface[] | undefined
}

export interface ThemeHandles {
    setUsers: React.Dispatch<React.SetStateAction<UserInterface[]>>
    setAccount: React.Dispatch<React.SetStateAction<AccountInterface | undefined>>
    setCurrentUser: React.Dispatch<React.SetStateAction<UserInterface | undefined>>
    setMovies: React.Dispatch<React.SetStateAction<MovieInterface[]>>
}

export const ThemeContext = createContext<{ datas: ThemeData; handles: ThemeHandles } | undefined>(undefined);

export const Provider: React.FC<ThemeContextProviderProps> = ({ children }) => {
    const [users, setUsers] = useState<UserInterface[]>([])
    const [account, setAccount] = useState<AccountInterface>()
    const [currentUser, setCurrentUser] = useState<UserInterface>()
    const [movies, setMovies] = useState<MovieInterface[]>([])

    const datas: ThemeData = {
        users,
        account,
        currentUser,
        movies
    };

    const handles: ThemeHandles = {
        setUsers,
        setAccount,
        setCurrentUser,
        setMovies
    };

    // Call API
    useEffect(() => {
        apiUser({ path: '/accounts/get-by-email', type: TypeHTTP.GET })
            .then(result => {
                setAccount(result)
            })
    }, [])

    useEffect(() => {
        if (account) {
            apiUser({ path: `/users/${datas.account?._id}`, type: TypeHTTP.GET })
                .then(result => {
                    setUsers(result)
                })
        }
    }, [account])

    useEffect(() => {
        apiUser({ path: '/movies', type: TypeHTTP.GET })
            .then(result => {
                setMovies(result)
            })
    }, [])

    return (
        <ThemeContext.Provider value={{ datas, handles }}>
            {children}
        </ThemeContext.Provider>
    );
};
