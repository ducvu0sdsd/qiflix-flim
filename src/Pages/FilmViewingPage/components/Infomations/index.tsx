
import './information.scss'
import React, { useContext, useEffect, useState } from 'react'
import $ from 'jquery'
import { EpisodeInterface, MovieInterface, UserInterface } from '../../../../Components/Context/interfaces';
import { TypeHTTP, apiUser } from '../../../../Utils/api';
import { ThemeContext } from '../../../../Components/Context';
import { NotificationStatus } from '../../../../Components/Notification';
import ListFilm from '../../../../Components/ListFilm';

export interface InformationsProps {
    currentFilm: MovieInterface,
    setCurrentEpisode: React.Dispatch<React.SetStateAction<number | undefined>>;
    setBufferTime: React.Dispatch<React.SetStateAction<number | undefined>>;
    currentEpisode: number,
    currentUser: UserInterface | undefined
}

const Informations = ({ currentFilm, setCurrentEpisode, currentEpisode, currentUser, setBufferTime }: InformationsProps) => {
    const [marginLeft, setMarginLeft] = useState<number>(0)
    const { datas, handles } = useContext(ThemeContext) || {}

    useEffect(() => {
        handleScrollEpisode(currentEpisode - 1)
    }, [currentEpisode])

    const handleChange = (type: string) => {
        const wrapperEpisode = $('.wrapper-episode')
        const episodeItem = $('.episode-item')
        if (wrapperEpisode.length > 0 && episodeItem.length > 0) {
            if (type === 'next') {
                setMarginLeft((p) => p + (parseInt(episodeItem.css('width').replace('px', '')) + 20))
                wrapperEpisode.css('margin-left', `-${marginLeft + (parseInt(episodeItem.css('width').replace('px', '')) + 20)}px`)
            } else if (type === 'prev') {
                setMarginLeft((p) => p - (parseInt(episodeItem.css('width').replace('px', '')) + 20))
                wrapperEpisode.css('margin-left', `-${marginLeft - (parseInt(episodeItem.css('width').replace('px', '')) + 20)}px`)
            }
        }
    }

    const handleReturnPosition: () => boolean = () => {
        const wrapperEpisode = $('.wrapper-episode')
        if (wrapperEpisode.length > 0) {
            if (parseInt(wrapperEpisode.css('width').replace('px', '')) - marginLeft < window.innerWidth) {
                return false
            } else {
                return true
            }
        } else {
            return true
        }
    }

    const handleFavoriteFlim = (movie_id: string) => {
        apiUser({ path: `/users/add-liked/${datas?.currentUser?._id}`, body: { movie_id: movie_id }, type: TypeHTTP.PUT })
            .then(result => {
                handles?.setCurrentUser(result)
                handles?.handleSetNotification({ type: NotificationStatus.SUCCESS, message: 'Add movie to my list is successful' })
                apiUser({ path: `/users/${datas?.account?._id}`, type: TypeHTTP.GET })
                    .then(res => {
                        handles?.setUsers(res)
                    })
            })
    }

    const handleUnFavoriteFlim = (movie_id: string) => {
        apiUser({ path: `/users/remove-liked/${datas?.currentUser?._id}`, body: { movie_id: movie_id }, type: TypeHTTP.PUT })
            .then(result => {
                handles?.setCurrentUser(result)
                handles?.handleSetNotification({ type: NotificationStatus.SUCCESS, message: 'Remove movie to my list is successful' })
                apiUser({ path: `/users/${datas?.account?._id}`, type: TypeHTTP.GET })
                    .then(res => {
                        handles?.setUsers(res)
                    })
            })
    }

    const handleChangeEpisode = (item: EpisodeInterface) => {
        const watching = {
            movie_id: currentFilm._id,
            indexOfEpisode: item.indexOfEpisode,
            currentTime: 0,
            process: 0
        }
        if (currentUser) {
            apiUser({ path: `/users/update-watching/${currentUser._id}`, body: watching, type: TypeHTTP.PUT })
                .then(res => {
                    setCurrentEpisode(item.indexOfEpisode)
                    setBufferTime(0)
                })
        }
    }

    const handleScrollEpisode = (from: number) => {
        const episode = $('.episode-item')[0]
        const width = episode.offsetWidth + 20
        const wrapperEpisode = $('.wrapper-episode')
        const episodeItem = $('.episode-item')
        setMarginLeft(from * width)
        wrapperEpisode.css('margin-left', `-${(from * width)}px`)
    }

    const ListEpisode = () => {
        if (currentFilm.listEpisode) {
            const numberOfSection = Math.floor(currentFilm.listEpisode.numberOfEpisodes / 30)
            const remainEpisode = currentFilm.listEpisode.numberOfEpisodes % 30 + numberOfSection * 30
            const sections = []
            for (let i = 0; i <= numberOfSection; i++) {
                if (30 * (i + 1) >= remainEpisode) {
                    sections.push({ from: 30 * i + 1, to: remainEpisode })
                } else {
                    sections.push({ from: 30 * i + 1, to: 30 * (i + 1) })
                }
            }
            return (
                <>
                    {sections.map((item, index) => {
                        return (
                            <span
                                onClick={() => handleScrollEpisode(item.from === 1 ? item.from - 1 : item.from)}
                                className={`${(currentEpisode >= item.from && currentEpisode <= item.to) && 'active'}`}
                                key={index}>{item.from} - {item.to}</span>
                        )
                    })}
                </>
            )
        }
        return <></>
    }

    return (
        <section id='informations' className='col-lg-12'>
            <div className='section-child-left section-child col-lg-8'>
                <span className='title'>{currentFilm.title.split(' - ')[0]}</span>
                <span className='title'>{currentFilm.title.split(' - ')[1]}</span>
                <span className='title'>
                    <span>{`E${currentFilm.listEpisode?.episodes.length}`}</span>
                    <div className='box' />
                    <span>{currentFilm.country}</span>
                    <div className='box' />
                    <span>1 Part</span>
                    <div className='box' />
                    <span>{currentFilm.yearRelease}</span>
                    <div className='box' />
                    <span>HD</span>
                </span>
                <span className='title'>{currentFilm.listEpisode?.episodes[currentEpisode - 1].name}</span>
                <span className='description'>{currentFilm.description}</span>
            </div>
            <div className='section-child-right section-child col-lg-4'>
                <div className='col-lg-12 btns'>
                    <a className='link' href="#comments"><button className='btn-action btn-action-comments'><i className='bx bx-chat'></i>Comments</button></a>
                    {!currentUser?.liked?.includes(currentFilm._id) ?
                        <button onClick={() => handleFavoriteFlim(currentFilm._id)} className='btn-action btn-action-like'><i className="fa-regular fa-heart"></i>Favorite</button>
                        :
                        <button onClick={() => handleUnFavoriteFlim(currentFilm._id)} className='btn-action btn-action-like'><i className="fa-solid fa-heart"></i>Favorited</button>
                    }
                    <button className='btn-action btn-action-comments'><i className='bx bx-share' ></i>Share</button>
                </div>
                <div className="col-lg-12 actors info-item">
                    <span>Category :</span> {currentFilm.genres.join(', ')}
                </div>
                <div className="col-lg-12 actors info-item">
                    <span>Directors :</span> {currentFilm.directors.join(', ')}
                </div>
                <div className="col-lg-12 actors info-item">
                    <span>Actors :</span> {currentFilm.actors.join(', ')}
                </div>
            </div>
            <div className="col-lg-12 episode-list">
                <span className='title col-lg-12'>Episode List <span>{currentFilm.listEpisode?.episodes.length}  episode</span></span>
                {currentFilm.listEpisode && currentFilm.listEpisode.episodes && currentFilm.listEpisode.episodes.length > 30 ? (
                    <div className="session-episode col-lg-12">
                        <ListEpisode />
                    </div>
                ) : (
                    <></>
                )}
                <div className="wrapper-episodes col-lg-12">
                    {marginLeft !== 0 && <button onClick={() => handleChange('prev')} className='btn-action-prev btn-action'><i className='bx bxs-left-arrow'></i></button>}
                    {handleReturnPosition() && <button onClick={() => handleChange('next')} className='btn-action-next btn-action'><i className='bx bxs-right-arrow' ></i></button>}
                    <div className='col-lg-12 episodes'>
                        <div className='wrapper-episode'>
                            {currentFilm.listEpisode?.episodes.map((item, index) => {
                                return (
                                    <div key={index} onClick={() => handleChangeEpisode(item)} className={`episode-item ${index === currentEpisode - 1 && 'episode-item--active'}`}>
                                        <img src={currentFilm.thumbnail} width={'100%'} />
                                        <span className='episode-info'><span>{item.name}</span> <span className='duration'>HD</span></span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section >
    )
}

export default Informations
