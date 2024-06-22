import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MovieInterface } from '../../../Context/interfaces'
import { MovieDetail } from '../../../MovieDetail'
import Trailer from '../../../../resources/trailer.mp4'
import Logo from '../../../../resources/logo-trailer.png'

export interface VideoProps {
    setMovieDetail: React.Dispatch<React.SetStateAction<MovieDetail>>,
    movies: MovieInterface[] | undefined,
}

const Video = ({ movies, setMovieDetail }: VideoProps) => {

    const [ready, setReady] = useState<boolean>(false)
    const elementRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)

    const FilterText: (value: string, max: number) => string = (str, max) => {
        let origin = str.split(' ')
        if (origin.length > max) {
            let arr: string[] = origin.filter((item, index) => index < max)
            return arr.join(' ') + '...'
        }
        return str
    }

    return (
        <div ref={elementRef} style={{ height: window.innerHeight + 'px', width: '100%', position: 'relative' }} >
            <div className='trailer'>
                <div className='info' style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '3%' }}>
                    <img src={Logo} width={'18%'} />
                    <div style={{ width: '35%', fontSize: '18px', fontWeight: '500', color: 'white' }}>
                        Một buổi sáng mùa mưa, trên đường đến trường, cậu đã cúp tiết lang thang đến một khu vườn để phác thảo mẫu giày và bắt gặp một cô gái quyến rũ tên Yukino Yukari đang ngồi uống bia ngắm mưa rơi. Họ không nói nhau lời nào, nhưng khi trời tạnh mưa, cô gái từ biệt cậu bằng một bài tanka khiến cậu bối rối. Tiếp tục những buổi sáng trời mưa tiếp theo, họ lại gặp nhau và...?
                    </div>
                    <div className="btns">
                        <Link className='link' to={`/the-garden-of-words`}><button className='btn-parent btn-watch'><i className='bx bx-play'></i> Watch Now</button></Link>
                        <button onClick={() => setMovieDetail({ display: true, movie: movies?.filter(item => item.url === 'the-garden-of-words')[0] })} className='btn-parent btn-detail'><i className='bx bx-info-circle' ></i> Detail</button>
                    </div>
                </div>
            </div>
            <video ref={videoRef} src={Trailer} loop autoPlay muted style={{ width: '100%' }}></video>
        </div >
    )
}

export default Video