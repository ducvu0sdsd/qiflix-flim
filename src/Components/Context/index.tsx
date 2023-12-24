import React, { createContext, useContext, useEffect, useState } from "react";
import { AccountInterface, MovieInterface, MovieWatchingByUserIdInterface, UserInterface } from "./interfaces";
import { TypeHTTP, apiUser } from "../../Utils/api";
import Notification, { NotificationStatus } from "../Notification";

export interface ThemeContextProviderProps {
    children: React.ReactNode;
}

export interface ThemeData {
    users: UserInterface[]
    account: AccountInterface | undefined
    currentUser: UserInterface | undefined
    loaded: boolean
    movies: MovieInterface[] | undefined
    moviesWatching: MovieWatchingByUserIdInterface[]
    loadedUsers: boolean
}

export interface ThemeHandles {
    setUsers: React.Dispatch<React.SetStateAction<UserInterface[]>>
    setAccount: React.Dispatch<React.SetStateAction<AccountInterface | undefined>>
    setCurrentUser: React.Dispatch<React.SetStateAction<UserInterface | undefined>>
    setLoaded: React.Dispatch<React.SetStateAction<boolean>>
    setLoadedUsers: React.Dispatch<React.SetStateAction<boolean>>
    setMovies: React.Dispatch<React.SetStateAction<MovieInterface[] | undefined>>
    setMoviesWatching: React.Dispatch<React.SetStateAction<MovieWatchingByUserIdInterface[]>>
    handleSetNotification: ({ type, message }: { type: NotificationStatus; message: string; }) => void
}

export const ThemeContext = createContext<{ datas: ThemeData; handles: ThemeHandles } | undefined>(undefined);

export const Provider: React.FC<ThemeContextProviderProps> = ({ children }) => {
    const [users, setUsers] = useState<UserInterface[]>([])
    const [account, setAccount] = useState<AccountInterface>()
    const [currentUser, setCurrentUser] = useState<UserInterface>()
    const [movies, setMovies] = useState<MovieInterface[] | undefined>(undefined)
    const [moviesWatching, setMoviesWatching] = useState<MovieWatchingByUserIdInterface[]>([])
    const [notificationStatus, setNotificationStatus] = useState<{ type: NotificationStatus, message: string }>({ type: NotificationStatus.NONE, message: '' })
    const [loaded, setLoaded] = useState<boolean>(false)
    const [loadedUsers, setLoadedUsers] = useState<boolean>(false)

    const handleSetNotification = ({ type, message }: { type: NotificationStatus, message: string }) => {
        setNotificationStatus({ type, message })
        setTimeout(() => {
            setNotificationStatus({ type: NotificationStatus.NONE, message: '' })
        }, 2500)
    }

    const datas: ThemeData = {
        users,
        account,
        currentUser,
        movies,
        moviesWatching,
        loaded,
        loadedUsers
    };

    const handles: ThemeHandles = {
        setUsers,
        setAccount,
        setCurrentUser,
        setMovies,
        setMoviesWatching,
        handleSetNotification,
        setLoaded,
        setLoadedUsers
    };

    // Call API
    useEffect(() => {
        apiUser({ path: '/accounts/get-by-email', type: TypeHTTP.GET })
            .then(result => {
                setAccount(result)
            })
    }, [loaded])

    useEffect(() => {
        if (account) {
            apiUser({ path: `/users/${datas.account?._id}`, type: TypeHTTP.GET })
                .then(result => {
                    setLoadedUsers(true)
                    setUsers(result)
                })
        }
    }, [account])

    useEffect(() => {
        apiUser({ path: '/movies', type: TypeHTTP.GET })
            .then(result => {
                setMovies(result)
            })
    }, [loaded])

    useEffect(() => {
        if (currentUser) {
            apiUser({ path: `/movies/get-movies-watching-by-user/${currentUser._id}`, type: TypeHTTP.GET })
                .then(result => {
                    setMoviesWatching(result)
                })
        }
    }, [currentUser])


    return (
        <ThemeContext.Provider value={{ datas, handles }}>
            <Notification statusProp={notificationStatus.type} message={notificationStatus.message} />
            {children}
        </ThemeContext.Provider>
    );
};
