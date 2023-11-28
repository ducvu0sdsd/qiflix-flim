
import { DataType } from '../../../../data'
import './information.scss'
import React, { useEffect, useState } from 'react'
import $ from 'jquery'

export interface InformationsProps {
    currentFilm: DataType,
    setCurrentEpisode: React.Dispatch<React.SetStateAction<number>>;
    currentEpisode: number
}

const Informations = ({ currentFilm, setCurrentEpisode, currentEpisode }: InformationsProps) => {

    const [marginLeft, setMarginLeft] = useState<number>(0)

    const handleChange = (type: string) => {
        const wrapperEpisode = $('.wrapper-episode')
        const episodeItem = $('.episode-item')
        if (wrapperEpisode.length > 0 && episodeItem.length > 0) {
            console.log(parseInt(wrapperEpisode.css('width').replace('px', '')), window.innerWidth)
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

    return (
        <section id='informations' className='col-lg-12'>
            <div className='section-child-left section-child col-lg-8'>
                <span className='title'>{currentFilm.title.split(' - ')[0]}</span>
                <span className='title'>{currentFilm.title.split(' - ')[1]}</span>
                <span className='title'>
                    <span>{`E${currentFilm.videosURL.length}`}</span>
                    <div className='box' />
                    <span>{currentFilm.country}</span>
                    <div className='box' />
                    <span>1 Part</span>
                    <div className='box' />
                    <span>Present</span>
                    <div className='box' />
                    <span>HD</span>
                </span>
                <span className='title'>{currentFilm.videosURL[currentEpisode - 1].name}</span>
                <span className='description'>{currentFilm.description}</span>
            </div>
            <div className='section-child-right section-child col-lg-4'>
                <div className='col-lg-12 btns'>
                    <button className='btn-action btn-action-comments'><i className='bx bx-chat'></i>Comments</button>
                    <button className='btn-action btn-action-comments'><i className='bx bx-share' ></i>Share</button>
                </div>
                <div className="col-lg-12 actors info-item">
                    <span>Category :</span> {currentFilm.categories.join(', ')}
                </div>
                <div className="col-lg-12 actors info-item">
                    <span>Actor :</span> {currentFilm.actors.join(', ')}
                </div>
            </div>
            <div className="col-lg-12 episode-list">
                <span className='title col-lg-12'>Episode List <span>{currentFilm.videosURL.length}  episode</span></span>
                <div className="session-episode col-lg-12">
                    <span className='active'>01-30</span>
                    <span>31-60</span>
                    <span>61-90</span>
                    <span>91-120</span>
                </div>
                <div className="wrapper-episodes col-lg-12">
                    {marginLeft !== 0 && <button onClick={() => handleChange('prev')} className='btn-action-prev btn-action'><i className='bx bxs-left-arrow'></i></button>}
                    {handleReturnPosition() && <button onClick={() => handleChange('next')} className='btn-action-next btn-action'><i className='bx bxs-right-arrow' ></i></button>}
                    <div className='col-lg-12 episodes'>
                        <div className='wrapper-episode'>
                            {currentFilm.videosURL.map((item, index) => {
                                return (
                                    <div onClick={() => setCurrentEpisode(item.num)} className="episode-item">
                                        <img src={currentFilm.thumbnail} width={'100%'} />
                                        <span className='episode-info'><span>{item.name} HD</span> <span className='duration'>1h 4m</span></span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Informations
