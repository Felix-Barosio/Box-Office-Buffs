//Search section
const searchBox = document.getElementById("movie-box");
const searchList = document.getElementById("search-list");
const outcome = document.getElementById("outcome");

async function loadMovies(parameters) {
    try {
        //API link
        const response = await fetch(`https://omdbapi.com/?s=${parameters}&page=1&apikey=1610dc2c`);
        const data = await response.json();

        displayList(data.Search);
    } catch (error) {
        console.log("There was an error fetching the movie list");
    }
}

function accessData() {
    let parameters = searchBox.value;
    if (parameters.length > 0) {
        searchList.classList.remove("hidden-list");
        loadMovies(parameters);
    } else {
        searchList.classList.add("hidden-list");
    }
}
function displayList(items) {
    searchList.innerHTML = "";
    for (let i = 0; i < items.length; i++) {
        let itemsList = document.createElement("div");
        itemsList.dataset.id = items[i].imdbID;
        itemsList.classList.add("search-list-item");
        if (items[i].Poster != "N/A") moviePoster = items[i].Poster;
        else moviePoster = "N/A";

        itemsList.innerHTML = `
        <div class = "movie-items">
            <img src = "${moviePoster}">
        </div>
        <div class = "movie-items-info">
            <h3>${items[i].Title}</h3>
            <p>${items[i].Year}</p>
        </div>
        `;
        searchList.appendChild(itemsList);
    }
    loadDetails();
}

function loadDetails() {
    const searchListMovies = searchList.querySelectorAll(".search-list-item");
    searchListMovies.forEach((movie) => {
        movie.addEventListener("click", async () => {
            searchList.classList.add("hidden-list");
            searchBox.value = "";
            const result = await fetch(
                `https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=1610dc2c` //details load
            );
            const movieDetails = await result.json();
            dataDetails(movieDetails);
        });
    });
}

//inserting items on page
function dataDetails(items) {
    outcome.innerHTML = `
    <div class = "movie-poster">
        <h2 class = "series">Movie/Series Poster</h2>
        <img src = "${items.Poster != "N/A" ? items.Poster : "image_not_found.png"
        }" alt = "N/A">
    </div>
    <div class = "movie-info">
        <h2 class = "describe">Description</h2>
        <h3 class = "movie-title">${items.Title}</h3>
        <p class = "actors"><b>Cast: </b>${items.Actors}</p>
        <p class = "plot"><b>About:</b> ${items.Plot}</p>
        <p class = "genre"><b>Genre:</b> ${items.Genre}</p>
        <p class = "writer"><b>Story By:</b> ${items.Writer}</p>
        <p class = "released">Initial Release Date: ${items.Released}</p>
    </div>
    `;
}