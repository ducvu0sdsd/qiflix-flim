
import React, { useContext, useEffect } from 'react'
import Qiflix from '../../resources/qiflix.png'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../../Components/Context';

const QiflixPage = () => {

    return (
        <div style={{ height: `${window.innerHeight}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: '0', left: 0, width: '100%' }}>
            <img src={Qiflix} width={'15%'} />
        </div>
    )
}

export default QiflixPage
