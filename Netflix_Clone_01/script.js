// API key and URLs
const apiKey = "7543524441a260664a97044b8e2dc621"; // TMDb API Key
const base_url = "https://api.themoviedb.org/3"; // Base URL for API
const img_url = "https://image.tmdb.org/t/p/w300"; // URL for movie thumbnails
const banner_url = "https://image.tmdb.org/t/p/original"; // URL for banner images

// API requests for different categories
const requests = {
    fetchPopular: `${base_url}/discover/movie?certification_country=US&certification.lte=G&sort_by=popularity.desc&api_key=${apiKey}`,
    fetchTrending: `${base_url}/trending/all/week?api_key=${apiKey}&language=en-US`,
    fetchNetflixOriginals: `${base_url}/discover/tv?api_key=${apiKey}&with_networks=213`,
    fetchActionMovies: `${base_url}/discover/movie?api_key=${apiKey}&with_genres=28`,
    fetchComedyMovies: `${base_url}/discover/movie?api_key=${apiKey}&with_genres=35`,
    fetchHorrorMovies: `${base_url}/discover/movie?api_key=${apiKey}&with_genres=27`,
    fetchRomanceMovies: `${base_url}/discover/movie?api_key=${apiKey}&with_genres=10749`,
    fetchDocumentaries: `${base_url}/discover/movie?api_key=${apiKey}&with_genres=99`
};

// Initialize the app and start fetching movies
function init() {
    fetchTrendingMovies(); // Fetch and display trending movie in the banner
    fetchAndBuildAllSections(); // Fetch and display all movie categories
}

// Fetch trending movies for the banner section
function fetchTrendingMovies() {
    fetch(requests.fetchTrending)
        .then(response => response.json())
        .then(data => {
            const movies = data.results;
            if (movies && movies.length > 0) {
                const randomMovie = movies[Math.floor(Math.random() * movies.length)];
                buildBannerSection(randomMovie); // Build banner section using a random movie
            }
        })
        .catch(error => console.error('Error fetching trending movies:', error));
}

// Build the banner section with a random movie's data
function buildBannerSection(movie) {
    const bannerSection = document.getElementById('banner-section');
    bannerSection.style.backgroundImage = `url('${banner_url}${movie.backdrop_path}')`; // Set background image

    const bannerContent = `
        <h2 class="banner__title">${movie.title || movie.name}</h2>
        <p class="banner__info">Trending Now | Released - ${movie.release_date || 'Unknown'}</p>
        <p class="banner__overview">${movie.overview.length > 150 ? movie.overview.substring(0, 150) + '...' : movie.overview}</p>
    `;
    bannerSection.innerHTML = bannerContent; // Set the banner content
}

// Fetch and build all movie sections
function fetchAndBuildAllSections() {
    const sections = [
        { title: "Popular", fetchUrl: requests.fetchPopular },
        { title: "Netflix Originals", fetchUrl: requests.fetchNetflixOriginals },
        { title: "Action Movies", fetchUrl: requests.fetchActionMovies },
        { title: "Comedy Movies", fetchUrl: requests.fetchComedyMovies },
        { title: "Horror Movies", fetchUrl: requests.fetchHorrorMovies },
        { title: "Romance Movies", fetchUrl: requests.fetchRomanceMovies },
        { title: "Documentaries", fetchUrl: requests.fetchDocumentaries }
    ];

    sections.forEach(section => {
        fetchMoviesAndBuildSection(section.title, section.fetchUrl);
    });
}

// Fetch movies and build each section
function fetchMoviesAndBuildSection(title, fetchUrl) {
    fetch(fetchUrl)
        .then(response => response.json())
        .then(data => {
            const movies = data.results;
            if (movies && movies.length > 0) {
                buildMovieSection(title, movies); // Build movie section for each category
            }
        })
        .catch(error => console.error(`Error fetching ${title} movies:`, error));
}

// Build each movie section with fetched movies
function buildMovieSection(title, movies) {
    const moviesContainer = document.getElementById('movies-cont');
    const moviesHTML = `
        <div class="movie-section">
            <h2>${title}</h2>
            <div class="movies-row">
                ${movies.map(movie => `
                    <div class="movie-item">
                        <img src="${img_url}${movie.poster_path}" alt="${movie.title || movie.name}">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    moviesContainer.innerHTML += moviesHTML; // Append the movie section to the container
}

// Initialize the application on page load
window.onload = function () {
    init();
};
