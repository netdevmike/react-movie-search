import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';

const API_KEY = '96d39d7c';
const API_URL = 'http://www.omdbapi.com/';

const searchMovies = async (query) => {
    const response = await fetch(`${API_URL}?s=${query}&apikey=${API_KEY}`);
    const data = await response.json();
    if (data.Error) {
        console.error(data.Error);
        return [];
    } else {
        return data.Search;
    }
};

const SearchForm = ({onSearch}) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(query);
    };

    return (<form onSubmit={handleSubmit} className="search-form">
        <input
            type="text"
            placeholder="Search for a movie or actor"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
    </form>);
};

const searchMoviesById = async (id) => {
    const response = await fetch(`${API_URL}?i=${id}&apikey=${API_KEY}`);
    const movie = await response.json();
    if (movie.Error) {
        console.error(movie.Error);
        return null;
    } else {
        return movie;
    }
};

const MovieDetailsPanel = ({movie, onClose}) => {
    return (<div className="movie-details-panel">
        <h2>{movie.Title}</h2>
        <p>Year: {movie.Year}</p>
        <p>Genre: {movie.Genre}</p>
        <p>Director: {movie.Director}</p>
        <p>Actors: {movie.Actors}</p>
        <p>Plot: {movie.Plot}</p>
        <button className="close-button" onClick={onClose}>
            &times;
        </button>
    </div>);
};

const MovieList = ({movies}) => {
    const [selectedMovie, setSelectedMovie] = useState(null);

    const handleClick = async (movie) => {
        const details = await searchMoviesById(movie.imdbID);
        setSelectedMovie(details);
    };

    const handleClose = () => {
        setSelectedMovie(null);
    };

    return (<>
        {selectedMovie && (<MovieDetailsPanel movie={selectedMovie} onClose={handleClose}/>)}
        <ul className="movie-list">
            {movies.map((movie) => (<li
                key={movie.imdbID}
                className="movie-item"
                onClick={() => handleClick(movie)}
            >
                <img
                    src={movie.Poster}
                    alt={`${movie.Title} poster`}
                    className="movie-poster"
                />
                <div className="movie-details">
                    <h2 className="movie-title">{movie.Title}</h2>
                    <p className="movie-year">{movie.Year}</p>
                </div>
            </li>))}
        </ul>
    </>);
};

const SortDropdown = ({onSort}) => {
    const handleSortChange = (e) => {
        onSort(e.target.value);
    };

    return (<div className="sort-dropdown">
        <select onChange={handleSortChange}>
            <option value="relevance">Relevance</option>
            <option value="year">Year</option>
            <option value="alphabetical">Alphabetical</option>
        </select>
    </div>);
};

const MovieSearch = () => {
    const [movies, setMovies] = useState([]);
    const [originalMovies, setOriginalMovies] = useState([]);

    const handleSearch = async (query) => {
        const results = await searchMovies(query);
        setMovies(results);
        setOriginalMovies(results);
        localStorage.setItem('movies', JSON.stringify(results));
    };

    const handleSort = (sortOption) => {
        switch (sortOption) {
            case 'year':
                setMovies([...movies].sort((a, b) => a.Year - b.Year));
                break;
            case 'alphabetical':
                setMovies([...movies].sort((a, b) => a.Title.localeCompare(b.Title)));
                break;
            case 'relevance':
                setMovies([...originalMovies]);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        const storedMovies = JSON.parse(localStorage.getItem('movies'));
        if (storedMovies) {
            setMovies(storedMovies);
            setOriginalMovies(storedMovies);
        }
    }, []);

    return (<Router>
        <div className="App">
            <style>
                {`
                body {
                    background-color: rgb(18, 20, 29);
                    color: white;
                }
                .title {
                    font-size: 2rem;
                    font-weight: bold;
                    margin-bottom: 1rem;
                    text-align: center;
                    text-transform: uppercase;
                }        
                .movie-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                    list-style-type: none;
                    margin: 0;
                    padding: 0;
                    justify-content: center;
                }
                .movie-item {
                    background-color: rgb(0, 0, 0);
                    border: 1px solid #e0e0e0;
                    border-radius: 4px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    padding: 1rem;
                    width: 300px;
                }
                .movie-poster {
                    align-self: center;
                    max-height: 350px;
                    max-width: 100%;
                    object-fit: contain;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .movie-poster:hover {
                    transform: scale(1.1);
                    box-shadow: 0 0 30px rgba(104, 213, 255, 0.8);
                }
                .movie-details {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .movie-title {
                    font-size: 18px;
                    font-weight: bold;
                    margin: 1rem 0;
                    text-align: center;
                    color: rgb(59, 207, 145)
                }
                .movie-year {
                    font-size: 14px;
                    font-weight: normal;
                    margin: 0;
                    text-align: center;
                    font-weight: bold;
                    color: rgb(255, 110, 110);
                }
                .movie-details-panel {
                    background-color: rgba(255, 255, 255, 0.8);
                    border: 1px solid #e0e0e0;
                    border-radius: 4px;
                    max-width: 500px;
                    padding: 1rem;
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 10;
                    backdrop-filter: blur(20px);
                    color: black;
                }
                .close-button {
                    background-color: transparent;
                    border: none;
                    font-size: 24px;
                    position: absolute;
                    right: 5px;
                    top: 5px;
                }
                .close-button:focus {
                    outline: none;
                }
                .search-form {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 1rem;
                }
                .search-form input {
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 1rem;
                    padding: 0.5rem;
                    width: 300px;
                }
                .search-form input:focus {
                    outline: none;
                    border-color: rgb(104, 213, 255);
                    box-shadow: 0 0 0 0.2rem rgba(104, 213, 255, 0.25);
                }
                .search-form button {
                    background-color: #333;
                    border: none;
                    border-radius: 4px;
                    color: #fff;
                    font-size: 1rem;
                    margin-left: 0.5rem;
                    padding: 0.5rem 1rem;
                    text-transform: uppercase;
                }
                .search-form button:hover {
                    background-color: #666;
                    cursor: pointer;
                }
                .sort-dropdown {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 1rem;
                }
                .sort-dropdown select {
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 1rem;
                    padding: 0.5rem;
                }     
                h1 {
                    font-size: 3rem;
                    font-weight: bold;
                    margin-bottom: 1rem;
                    text-align: center;
                    text-transform: uppercase;
                    color: white;
                }
          `}
            </style>
            <h1>Movie Search</h1>
            <Routes>
                <Route
                    path="/"
                    element={<div>
                        <SearchForm onSearch={handleSearch}/>
                        <SortDropdown onSort={handleSort}/>
                        <MovieList movies={movies}/>
                    </div>}
                />
            </Routes>
        </div>
    </Router>);
};

export default MovieSearch;


