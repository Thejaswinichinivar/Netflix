// Constants for API
const apiKey = "7543524441a260664a97044b8e2dc621"; // TMDb API Key
const base_url = "https://api.themoviedb.org/3"; // Base URL for API
const img_url = "https://image.tmdb.org/t/p/w300"; // Image URL for thumbnails
const banner_url = "https://image.tmdb.org/t/p/original"; // Image URL for banners

// API Requests for different movie categories
const requests = {
    fetchPopular: `${base_url}/discover/movie?certification_country=US&certification.lte=G&sort_by=popularity.desc&api_key=${apiKey}`,
    fetchTrending: `${base_url}/trending/all/week?api_key=${apiKey}&language=en-US`,
    fetchNetflixOriginals: `${base_url}/discover/tv?api_key=${apiKey}&with_networks=213`,
    fetchActionMovies: `${base_url}/discover/movie?api_key=${apiKey}&with_genres=28`,
    fetchComedyMovies: `${base_url}/discover/movie?api_key=${apiKey}&with_genres=35`,
    fetchHorrorMovies: `${base_url}/discover/movie?api_key=${apiKey}&with_genres=27`,
    fetchRomanceMovies: `${base_url}/discover/movie?api_key=${apiKey}&with_genres=10749`,
    fetchDocumentaries: `${base_url}/discover/movie?api_key=${apiKey}&with_genres=99`,
};

// Initialize the Application
function init() {
    fetchTrendingMovies(); // Fetch trending movies for the banner
    fetchAndBuildAllSections(); // Fetch and build movie categories
}

// Fetch Trending Movies and Display in Banner
function fetchTrendingMovies() {
    fetch(requests.fetchTrending)
        .then(response => response.json())
        .then(data => {
            const movies = data.results;
            if (movies && movies.length > 0) {
                const randomMovie = movies[Math.floor(Math.random() * movies.length)];
                buildBannerSection(randomMovie);
            }
        })
        .catch(error => console.error('Error fetching trending movies:', error));
}

// Build Banner Section with Random Movie
function buildBannerSection(movie) {
    const bannerSection = document.getElementById('banner-section');
    bannerSection.style.backgroundImage = `url('${banner_url}${movie.backdrop_path}')`;

    const bannerContent = `
        <h2 class="banner__title">${movie.title || movie.name}</h2>
        <p class="banner__info">Trending Now | Released - ${movie.release_date || 'Unknown'}</p>
        <p class="banner__overview">${movie.overview.length > 150 ? movie.overview.substring(0, 150) + '...' : movie.overview}</p>
        <div class="action-buttons-cont">
            <button class="action-button">Play</button>
            <button class="action-button">More Info</button>
        </div>
    `;
    
    bannerSection.innerHTML = bannerContent;
}

// Fetch and Build Movie Sections for Each Category
function fetchAndBuildAllSections() {
    Object.keys(requests).forEach((key) => {
        fetch(requests[key])
            .then(response => response.json())
            .then(data => {
                const movies = data.results;
                if (movies && movies.length > 0) {
                    const categoryName = getCategoryName(key);
                    buildMoviesSection(movies.slice(0, 6), categoryName);
                }
            })
            .catch(error => console.error(`Error fetching movies for ${key}:`, error));
    });
}

// Get Display Name for Movie Categories
function getCategoryName(key) {
    const categoryNames = {
        fetchPopular: 'Popular Movies',
        fetchTrending: 'Trending Now',
        fetchNetflixOriginals: 'Netflix Originals',
        fetchActionMovies: 'Action Movies',
        fetchComedyMovies: 'Comedy Movies',
        fetchHorrorMovies: 'Horror Movies',
        fetchRomanceMovies: 'Romance Movies',
        fetchDocumentaries: 'Documentaries'
    };
    return categoryNames[key] || 'Movies';
}

// Build HTML for Movie Sections
function buildMoviesSection(movieList, categoryName) {
    const moviesContainer = document.getElementById('movies-cont');

    const movieItemsHTML = movieList.map(movie => `
        <div class="movie-item">
            <img class="movie-item-img" src="${img_url}${movie.backdrop_path}" alt="${movie.title || movie.name}">
        </div>
    `).join('');

    const sectionHTML = `
        <div class="movie-section">
            <h2>${categoryName}</h2>
            <div class="movies-row">${movieItemsHTML}</div>
        </div>
    `;

    const sectionElement = document.createElement('div');
    sectionElement.className = 'movie-section-container';
    sectionElement.innerHTML = sectionHTML;

    moviesContainer.appendChild(sectionElement);
}

// Run the Initialization
window.addEventListener('load', init);