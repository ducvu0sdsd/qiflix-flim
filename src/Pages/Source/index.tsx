import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Source = () => {
    const location = useLocation();
    const navigate = useNavigate()
    const queryParams = new URLSearchParams(location.search);
    useEffect(() => {
        const accessToken = queryParams.get('accessToken');
        const refreshToken = queryParams.get('refreshToken');
        const title = queryParams.get('title');
        const currentEpisode: number = Number(queryParams.get('currentEpisode'));
        const bufferTime = Number(queryParams.get('bufferTime'));
        const currentUser = queryParams.get('currentUser')
        if (accessToken && refreshToken && title && currentEpisode && bufferTime) {
            localStorage.setItem('accessToken', JSON.stringify(accessToken))
            localStorage.setItem('refreshToken', JSON.stringify(refreshToken))
            navigate(`/source-film/${title}?currentEpisode=${currentEpisode}&bufferTime=${bufferTime}&currentUser=${currentUser}`)
        } else {
            navigate('/')
        }
    }, [])
    return (
        <div style={{ height: '100vh', width: '100%', backgroundColor: 'black' }}>

        </div>
    )
}

export default Source