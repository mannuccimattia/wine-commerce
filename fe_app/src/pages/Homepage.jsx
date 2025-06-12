import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import MovieCard from '../components/MovieCard'
import GlobalContext from '../contexts/globalContext'



const Homepage = () => {
    const [movies, setMovies] = useState([]);
    const { setIsLoading } = useContext(GlobalContext)


    const fetchMovies = () => {
        setIsLoading(true)
        axios.get('http://localhost:3000/movies')
            .then((response) => {
                console.log(response.data);
                setMovies(response.data);
                setIsLoading(false);
            }, 20000)
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        fetchMovies()
    }, [])

    return (
        <>
            <h1 className="text-primary mb-3">Bool Movies</h1>
            <h2 className="mb-4 fst-italic">The Best Homevideo only for you</h2>
            <div className="row gy-4">
                {movies.map((movie) => (
                    <MovieCard movie={movie} key={`movie-${movie.id}`} />
                ))}
            </div>
        </>

    )
}

export default Homepage
