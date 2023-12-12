import React, { useContext, useEffect } from 'react'
import PrivateHeader from '../../Components/PrivateHeader'
import Footer from '../../Components/Footer'
import { ThemeContext } from '../../Components/Context'
import Movies from './components/TVShow'
import { motion } from 'framer-motion'

const MoviesPage = () => {

    const { datas, handles } = useContext(ThemeContext) || {}

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    return (
        <motion.div
            initial={{ x: window.innerWidth * -1 }}
            animate={{ x: 0 }}
            exit={{ x: window.innerWidth, transition: { duration: 0.2 } }}
        >
            <PrivateHeader users={datas?.users || []} currentUser={datas?.currentUser} />
            <Movies />
            <Footer />

        </motion.div>
    )
}

export default MoviesPage
