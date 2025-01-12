
import React, { useContext, useEffect, useState } from 'react'
import './managemovies.scss'
import { belongs, countries, movieGenres } from './datas'
import { EpisodeInterface, MovieInterface } from '../../../../Components/Context/interfaces'
import $ from "jquery"
import { TypeHTTP, apiUser } from '../../../../Utils/api'
import { ThemeContext } from '../../../../Components/Context'
import { useNavigate } from 'react-router-dom'

const ManageMovies = () => {
    const [currentMovie, setCurrentMovie] = useState<MovieInterface | undefined>(undefined)
    const [currentMovieSub, setCurrentMovieSub] = useState<MovieInterface>()
    const [countrySub, setCountrySub] = useState<string>('')
    const [selectedFile, setSelectedFile] = useState(null);
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [url, setUrl] = useState<string>('')
    const [thumbnail, setThumbnail] = useState<string>('')
    const [thumbnailVertical, setThumbnailVertical] = useState<string>('')
    const [trailerUrl, setTrailerUrl] = useState<string>('')
    const [yearRelease, setYearRelease] = useState<number>(0)
    const [episode, setEpisode] = useState<EpisodeInterface[]>([])
    const [country, setCountry] = useState<string>('')
    const [genres, setGenre] = useState<string[]>([])
    const [actors, setActors] = useState<string[]>([])
    const [directors, setDirectors] = useState<string[]>([])
    const [belong, setBelong] = useState<string[]>([])
    const { datas } = useContext(ThemeContext) || {}
    const navigate = useNavigate()

    useEffect(() => {
        if (datas?.account?.admin === false) {
            navigate('/home-page')
        }
    }, [datas?.account])

    const handleInsert = () => {
        const listEpisode = { numberOfEpisodes: episode.length, episodes: episode }
        const body = { title, description, url, thumbnail, trailerUrl, yearRelease, country, genres, actors, directors, listEpisode, belong, thumbnailVertical }
        apiUser({ path: '/movies', body: body, type: TypeHTTP.POST })
            .then(res => {
                alert('Insert success')
            })
    }

    const handleDelete = () => {
        if (currentMovie) {
            apiUser({ path: `/movies/${currentMovie._id}`, type: TypeHTTP.DELETE })
                .then(res => {
                    alert('Delete success')
                })
        }
    }

    const handleCreateSubtitle = () => {
        const formData = new FormData()
        if (selectedFile) {
            formData.append('srtFile', selectedFile);
        } else {
            console.error('selectedFile is null or invalid');
        }
        const movieId = currentMovieSub?._id;
        if (movieId) {
            formData.append('movie_id', movieId);
        } else {
            console.error('currentMovieSub?._id is null or invalid');
        }
        const epi = $('.txt-episode').val()
        if (/[0-9]{1,}/.test(epi)) {
            formData.append('episode', epi)
        }
        formData.append('country', countrySub);
        apiUser({ path: '/subtitles', type: TypeHTTP.POST, body: formData })
            .then(res => {
                alert('Create success')
            })
    }

    const handleUpdate = () => {
        const listEpisode = { numberOfEpisodes: episode.length, episodes: episode }
        const body = { title, description, url, thumbnail, trailerUrl, yearRelease, country, genres, actors, directors, listEpisode, belong, thumbnailVertical }
        apiUser({ path: `/movies/${currentMovie?._id}`, type: TypeHTTP.PUT, body: body })
            .then(res => {
                console.log(res)
                alert("Update Success")
            })
    }

    const handleAddEpisode = () => {
        if (episode.length === 0) {
            setEpisode(prev => [...prev, { indexOfEpisode: parseInt($('.1').val()), name: $('.2').val(), url: $('.3').val() }])
        } else {
            setEpisode(prev => [...prev, { indexOfEpisode: episode.length, name: `Episode ${episode.length}`, url: $('.3').val() }])
        }
    }

    useEffect(() => {
        const title = $('.txt-title')
        const des = $('.txt-des')
        const url = $('.txt-url')
        const thum = $('.txt-thum')
        const thumVer = $('.txt-thum-ver')
        const trailer = $('.txt-trailer')
        const year = $('.txt-year')
        const country = $('.select-country')

        title.val(currentMovie?.title)
        des.val(currentMovie?.description)
        url.val(currentMovie?.url)
        thum.val(currentMovie?.thumbnail)
        trailer.val(currentMovie?.trailerUrl)
        year.val(currentMovie?.yearRelease)
        country.val(currentMovie?.country)
        thumVer.val(currentMovie?.thumbnailVertical)

        setTitle(currentMovie.title)
        setDescription(currentMovie.description)
        setUrl(currentMovie.url)
        setThumbnail(currentMovie.thumbnail)
        setThumbnailVertical(currentMovie.thumbnailVertical)
        setTrailerUrl(currentMovie.trailerUrl)
        setYearRelease(currentMovie.yearRelease)
        setCountry(currentMovie.country)
        setActors(currentMovie.actors)
        setDirectors(currentMovie.directors)
        if (currentMovie?.genres && currentMovie?.belong && currentMovie.listEpisode?.episodes) {
            setGenre(currentMovie?.genres)
            setBelong(currentMovie.belong)
            setEpisode(currentMovie.listEpisode?.episodes)
        }
    }, [currentMovie])

    return (
        <section className='col-lg-12 manage-movies'>
            <div className='parent-form'>
                <input onChange={(e) => setTitle(e.target.value)} type="text" placeholder='Title' className="form-control txt-title" />
                <input onChange={(e) => setDescription(e.target.value)} type="text" placeholder='Description' className="form-control txt-des" />
                <input onChange={(e) => setUrl(e.target.value)} type="text" placeholder='URL' className="form-control txt-url" />
                <input onChange={(e) => setThumbnail(e.target.value)} type="text" placeholder='Thumbnail' className="form-control txt-thum" />
                <input onChange={(e) => setThumbnailVertical(e.target.value)} type="text" placeholder='Thumbnail Vertical' className="form-control txt-thum-ver" />
                <input onChange={(e) => setTrailerUrl(`${e.target.value}`)} type="text" placeholder='Trailer URL' className="form-control txt-trailer" />
                <input onChange={(e) => setYearRelease(parseInt(e.target.value))} type="text" placeholder='Year Release' className="form-control txt-year" />
                <select onChange={(e) => setCountry(e.target.value)} className="form-select select-country">
                    {countries.map((country, index) => {
                        return (
                            <option key={index}>{country}</option>
                        )
                    })}
                </select>
                <div className='episode' style={{ display: 'flex' }}>
                    <select className="form-select txt-genre">
                        {movieGenres.map((genre, index) => {
                            return (
                                <option key={index}>{genre}</option>
                            )
                        })}
                    </select>
                    <button onClick={() => setGenre(prev => [...prev, $('.txt-genre').val()])} type="button" className="btn btn-success">Create</button>
                    <div className='col-lg-5 content'>{genres.join(', ')}
                        <button onClick={() => setGenre([])}>x</button>
                    </div>
                </div>
                <div className='episode' style={{ display: 'flex', width: "30%" }}>
                    <select className="form-control col-lg-5 txt-belong" style={{ width: '45%' }}>
                        {belongs.map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                        ))}
                    </select>
                    <button onClick={() => setBelong(prev => [...prev, $('.txt-belong').val()])} type="button" className="btn btn-success">Create</button>
                    <div className='col-lg-4 content'>{belong.join(', ')}
                        <button onClick={() => setBelong([])}>x</button>
                    </div>
                </div>

                <div className='episode' style={{ display: 'flex', width: "30%" }}>
                    <input type="text" placeholder='Actors' className="form-control col-lg-5 txt-actor" style={{ width: '45%' }} />
                    <button onClick={() => setActors(prev => [...prev, $('.txt-actor').val()])} type="button" className="btn btn-success">Create</button>
                    <div className='col-lg-4 content'>{actors.join(', ')}
                        <button onClick={() => setActors([])}>x</button>
                    </div>
                </div>
                <div className='episode' style={{ display: 'flex', width: "30%" }}>
                    <input type="text" placeholder='Directors' className="form-control col-lg-5 txt-director" style={{ width: '45%' }} />
                    <button type="button" onClick={() => setDirectors(prev => [...prev, $('.txt-director').val()])} className="btn btn-success">Create</button>
                    <div className='col-lg-4 content'>{directors.join(', ')}
                        <button onClick={() => setDirectors([])}>x</button>
                    </div>
                </div>
                <div className='episode'>
                    {episode.length === 0 && (<>
                        <input type="text" placeholder='Index Of Episode:' className="form-control 1" />
                        <input type="text" placeholder='Episode Name' className="form-control 2" />
                    </>)}
                    <input type="text" placeholder='Episode URL' className="form-control 3" />
                    <button onClick={() => handleAddEpisode()} type="button" className="btn btn-success">Create</button>
                    <button onClick={() => setEpisode(prev => prev.filter((item, index) => index !== prev.length - 1))}>x</button>
                </div>
                <div className='episode'>
                    <div style={{ height: '200px', overflowY: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Index Of Episode</th>
                                    <th>Episode Name</th>
                                    <th>Episode URL</th>
                                </tr>
                            </thead>
                            <tbody >
                                {episode.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.indexOfEpisode}</td>
                                            <td>{item.name}</td>
                                            <td>{item.url}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='col-lg-12' style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <button onClick={() => handleInsert()} type="button" style={{ margin: '0 5px' }} className="btn btn-success">Insert</button>
                    <button onClick={() => handleUpdate()} type="button" style={{ margin: '0 5px' }} className="btn btn-primary">Update</button>
                    <button onClick={() => handleDelete()} type="button" style={{ margin: '0 5px' }} className="btn btn-danger">Delete</button>
                    <select onChange={(e) => { e.target.value !== 'none' ? setCurrentMovie(datas?.movies?.filter(item => item._id === e.target.value)[0]) : setCurrentMovie(undefined) }} className="form-select">
                        <option value={'none'}>None</option>
                        {datas?.movies?.map((movie, index) => {
                            return (
                                <option key={movie._id} value={movie._id}>{movie.title}</option>
                            )
                        })}
                    </select>
                </div>
            </div>
            <div className='form-subtitle col-lg-12'>
                SRT
                <select onChange={(e) => { e.target.value !== 'none' && setCurrentMovieSub(datas?.movies?.filter(item => item._id === e.target.value)[0]) }} className="form-select-subtitle form-select">
                    <option value={'none'}>None</option>
                    {datas?.movies?.map((movie, index) => {
                        return (
                            <option key={movie._id} value={movie._id}>{movie.title}</option>
                        )
                    })}
                </select>

                <select onChange={(e) => setCountrySub(e.target.value)} className="form-select">
                    {countries.map((country, index) => {
                        return (
                            <option key={index}>{country}</option>
                        )
                    })}
                </select>
                <input type="text" placeholder='Episode' className="form-control txt-episode" />
                <input type='file' accept='.srt' onChange={(e: any) => setSelectedFile(e.target.files[0])} />
                <button onClick={handleCreateSubtitle} type="button" style={{ margin: '0 5px' }} className="btn btn-primary">Create</button>
            </div>
        </section>
    )
}

export default ManageMovies
