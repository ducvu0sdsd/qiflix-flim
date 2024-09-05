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
        if (accessToken && refreshToken && title) {
            localStorage.setItem('accessToken', JSON.stringify(accessToken))
            localStorage.setItem('refreshToken', JSON.stringify(refreshToken))
            navigate(`/${title}`)
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