import React, { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { MovieInterface } from '../../../Context/interfaces'
import { MovieDetail } from '../../../MovieDetail'
import Trailer from '../../../../resources/trailer.mp4'
import Logo from '../../../../resources/logo-trailer.png'

export interface VideoProps {
    movies: MovieInterface[] | undefined,
}

const Video = ({ movies }: VideoProps) => {
    const navigate = useNavigate()
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

    const goToDetail = (data: MovieInterface | undefined) => {
        console.log(data)
        // navigate('/detail-movie-page', { state: { movie: data } })
    }

    return (
        <div ref={elementRef} style={{ height: window.innerHeight + 'px', width: '100%', position: 'relative' }} >
            <div className='trailer'>
                <div className='info' style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '3%' }}>
                    <img src={Logo} width={'20%'} style={{ marginBottom: '10px' }} />
                    <div style={{ width: '35%', fontSize: '18px', fontWeight: '500', color: 'white' }}>
                        {'Thư ký Kim sao thế? (Tiếng Hàn: 김비서가 왜 그럴까; Romaja: Kimbiseoga Wae Geureolkka) là một bộ phim truyền hình Hàn Quốc năm 2018 với sự tham gia của Park Seo-joon và Park Min-young. Nó dựa trên tiểu thuyết cùng tên của Jung Kyung-yoon được xuất bản lần đầu vào năm 2013, sau đó được KakaoPage chuyển thể thành truyện tranh vào năm 2015.'}
                    </div>
                    <div className="btns">
                        <Link className='link' to={`/whats-wrong-with-secretary-kim`}><button className='btn-parent btn-watch'><i className='bx bx-play'></i> Watch Now</button></Link>
                        <button onClick={() => goToDetail(movies?.filter((item) => item.url === 'whats-wrong-with-secretary-kim')[0])} className='btn-parent btn-detail'><i className='bx bx-info-circle' ></i> Detail</button>
                    </div>
                </div>
            </div>
            <video ref={videoRef} src={Trailer} loop autoPlay muted style={{ width: '100%' }}></video>
        </div >
    )
}

export default Video