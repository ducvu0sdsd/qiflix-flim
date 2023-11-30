import { rejects } from "assert";
import axios from "axios";
import { resolve } from "path";

export enum TypeHTTP {
    GET = "get",
    POST = "post",
    PUT = "put",
    PATCH = "patch",
    DELETE = "delete"
}

export interface APIUserProps {
    body?: {},
    type: TypeHTTP,
    path: string
}

export const apiUser: ({ body, type, path }: APIUserProps) => Promise<any> = ({ body, type, path }: APIUserProps) => {
    return new Promise((rejects, resolve) => {
        const accessTokenString = localStorage.getItem('accessToken');
        if (accessTokenString) {
            const accessToken = JSON.parse(accessTokenString);
            switch (type) {
                case TypeHTTP.GET:
                    axios.get(path, { headers: { Authorization: 'Access ' + accessToken } })
                        .then(res => {
                            rejects(res.data)
                        })
                        .catch(() => {
                            refreshToken()
                                .then(res => {
                                    if (res) {
                                        const accessTokenString = localStorage.getItem('accessToken');
                                        if (accessTokenString) {
                                            const accessToken = JSON.parse(accessTokenString);
                                            axios.get(path, { headers: { Authorization: 'Access ' + accessToken } })
                                                .then(res => {
                                                    rejects(res.data)
                                                })
                                        }
                                    }
                                })
                        })
                    break
                case TypeHTTP.DELETE:
                    axios.delete(path, { headers: { Authorization: 'Access ' + accessToken } })
                        .then(res => {
                            rejects(res.data)
                        })
                        .catch(() => {
                            refreshToken()
                                .then(res => {
                                    if (res) {
                                        const accessTokenString = localStorage.getItem('accessToken');
                                        if (accessTokenString) {
                                            const accessToken = JSON.parse(accessTokenString);
                                            axios.delete(path, { headers: { Authorization: 'Access ' + accessToken } })
                                                .then(res => {
                                                    rejects(res.data)
                                                })
                                        }
                                    }
                                })
                        })
                    break
                case TypeHTTP.POST:
                    axios.post(path, body, { headers: { Authorization: 'Access ' + accessToken } })
                        .then(res => {
                            rejects(res.data)
                        })
                        .catch(() => {
                            refreshToken()
                                .then(res => {
                                    if (res) {
                                        const accessTokenString = localStorage.getItem('accessToken');
                                        if (accessTokenString) {
                                            const accessToken = JSON.parse(accessTokenString);
                                            axios.post(path, body, { headers: { Authorization: 'Access ' + accessToken } })
                                                .then(res => {
                                                    rejects(res.data)
                                                })
                                        }
                                    }
                                })
                        })
                    break
                default:
                    return undefined
            }
        } else {
            return undefined
        }
    })
}

export const refreshToken: () => Promise<boolean | undefined> = () => {
    return new Promise((rejects, resolve) => {
        const refreshTokenString = localStorage.getItem('refreshToken');
        if (refreshTokenString) {
            const refreshToken = JSON.parse(refreshTokenString);
            axios.post('/auths/refresh-token', {}, {
                headers: {
                    Authorization: 'Refresh ' + refreshToken
                }
            })
                .then(res => {
                    localStorage.setItem('accessToken', JSON.stringify(res.data.accessToken))
                    localStorage.setItem('refreshToken', JSON.stringify(res.data.refreshToken))
                    rejects(true)
                })
                .catch(() => {
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('refreshToken')
                    localStorage.removeItem('currentUser')
                    rejects(false)
                })
        } else {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('currentUser')
            rejects(false)
        }
    })
}