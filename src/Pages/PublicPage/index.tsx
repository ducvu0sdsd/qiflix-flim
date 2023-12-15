
import React from 'react'
import PublicHeader from '../../Components/PublicHeader'
import SectionPublicPage from './components/Section'
import Footer from '../../Components/Footer'
import { motion } from 'framer-motion'
import QiflixMeta from '../../resources/qiflix-meta.png'
import { Helmet } from 'react-helmet'

const PublicPage = () => {

    const titleElement = document.querySelector('head title');
    if (titleElement) {
        titleElement.textContent = "Qiflix";
    }

    return (
        <motion.div
            initial={{ x: window.innerWidth * -1 }}
            animate={{ x: 0 }}
            exit={{ x: window.innerWidth, transition: { duration: 0.2 } }}
        >
            <Helmet>
                <title>Qiflix</title>
                <meta property="og:title" content="Qiflix" />
                <meta property="og:image" content={QiflixMeta} />
            </Helmet>
            <PublicHeader />
            <SectionPublicPage indexImage={1} reverse={false} header='Enjoy on your TV' message='Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.' />
            <SectionPublicPage indexImage={2} reverse={true} header='Download your shows to watch offline' message='Save your favorites easily and always have something to watch.' />
            <SectionPublicPage indexImage={3} reverse={false} header='Watch everywhere' message='Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.' />
            <Footer />
        </motion.div>
    )
}

export default PublicPage
