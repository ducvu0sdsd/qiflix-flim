
import './typicalsection.scss'
import React from 'react'
import Trailer from '../../resources/trailer.mp4'
import { Link } from 'react-router-dom'

const TypicalSection = () => {

    const url: string = 'https://drive.google.com/uc?export=download&id=1FoH975z83GBDICOrlgmOjTsB_MwtoO42'
    return (
        <section id='typical-section' className='col-lg-12' style={{ height: `${window.innerHeight}px` }}>
            <div className='trailer col-lg-12' style={{ height: `${window.innerWidth / 2.37}px` }}>
                <video
                    className='col-lg-12'
                    autoPlay
                    muted
                    loop
                    src={url}
                />
                <div className='trailer-wrapper'></div>
                <div className='info'>
                    <h2>Elephant's Dream</h2>
                    <span>Elephants Dream (code-named Project Orange during production and originally titled Machina) is a 2006 Dutch computer-animated science fiction fantasy experimental short film produced by Blender Foundation using, almost exclusively, free and open-source software. The film is English-language and includes subtitles in over 30 languages.</span>
                    <div className="btns">
                        <Link className='link' to={'/film-viewing-page'}><button className='btn-parent btn-watch'><i className='bx bx-play'></i> Watch Now</button></Link>
                        <button className='btn-parent btn-detail'><i className='bx bx-info-circle' ></i> Detail</button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TypicalSection
