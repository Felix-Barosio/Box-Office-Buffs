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

//Feedback fetching

function fetchPosts() {
    fetch("http://localhost:3000/feedback")
        .then((res) => res.json())
        .then((posts) => posts.forEach((post) => renderPost(post)));
}

function renderPost(post) {
    let content = document.createElement("div");
    content.className = "content";
    content.innerHTML = `   <h3><i class="fa-regular fa-user"></i> - ${post.title}</h3>
        <p>
            ${post.body}
        </p>
        <div class="icons">
            <div class="reactions">
                <p>
                    <i class="fa-regular fa-thumbs-up"></i>
                    <span class="like">${post.likes} likes</span>
                </p>
                <p>
                    <i class="fa-regular fa-thumbs-down"></i> 
                    <span class="dislike">${post.dislikes} dislikes</span>
                </p>
                <p>
                    <span><i id="toggle"></i>
                </p>
            </div>     
        </div>
    `;
    content.querySelector(".fa-thumbs-up").addEventListener("click", () => {
        post.likes += 1;
        console.log("It responds!!!");
        content.querySelector(".like").textContent = ` ${post.likes} likes`;
        updateReaction(post);
    });

    content.querySelector(".fa-thumbs-down").addEventListener("click", () => {
        post.dislikes += 1;
        content.querySelector(
            ".dislike"
        ).textContent = ` ${post.dislikes} dislikes`;
        updateReaction(post);
    });

    const targetDiv = content.querySelector("#comments");
    const btn = content.querySelector("#toggle");
    btn.onclick = function () {
        if (targetDiv.style.display !== "block") {
            targetDiv.style.display = "block";
        } else {
            targetDiv.style.display = "none";
        }
    };

    document.querySelector(".contents").appendChild(content);
}

function updateReaction(feedback) {
    fetch(`http://localhost:3000/feedback/${feedback.id}`, {
        method: "PATCH",
        headers: {
            "content-type": "application/json",
            'Accept': "application/json",
        },
        body: JSON.stringify(feedback),
    })
        .then((res) => res.json())
        .then((data) => console.log(data));
}

function userPost(e) {
    e.preventDefault();

    let postObj = {
        title: e.target.post_title.value,
        body: e.target.description.value,
        likes: 0,
        dislikes: 0,
    };

    savePost(postObj);
    renderPost(postObj);
}

function savePost(postObj) {
    fetch("http://localhost:3000/feedback", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            'Accept': "application/json",
        },
        body: JSON.stringify(postObj),
    })
        .then((response) => response.json())
        .then((data) => console.log(data));
}

document.getElementById("form").addEventListener("submit", userPost);

function displayPost() {
    fetchPosts();
}
displayPost();

document.getElementById("question").addEventListener("click", () => {
    document.getElementById("modal").style.display = "block";
});

document.getElementById("close").addEventListener("click", () => {
    document.getElementById("modal").style.display = "none";
});

window.onclick = function (event) {
    if (event.target == document.getElementById("modal")) {
        document.getElementById("modal").style.display = "none";
    }
};