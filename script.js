// Wait for the HTML to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
    // 0) Get references to DOM elements so yu can easily access them later
    // only playlist container, all elements will be created dynamically in functions
    const container = document.getElementById("playlist-cards");
    // modal elements
    const modal = document.getElementById("playlist-modal");
    const closeBtn = modal.querySelector(".close-btn");
    const shuffleBtn = modal.querySelector(".shuffle-btn");
    const modalCover = document.getElementById("modal-cover");
    const modalName = document.getElementById("modal-name");
    const modalCreator = document.getElementById("modal-creator");
    const modalSongs = document.getElementById("modal-songs");
    let currentPlaylist = {}; // to store the current playlist object when opening the modal
    // This will be used to shuffle the songs in the modal when the button is clicked

    // 1) Function to create a playlist card
    // In this function we create not just element but also event listeners for each card and its elements/children and THEN you can add it to the container
    function createPlaylistCard(pl) { // creates each card element, all the HTML and event listeners, from each playlist object from the JSON
        const card = document.createElement("div");
        card.className = "card"; // <div class="card"></div>
        card.innerHTML = `
            <img src="${pl.cover}" alt="${pl.name} cover" class="playlist-img">
            <h2>${pl.name}</h2>
            <p>By ${pl.creator}</p>
            <span class="heart-btn">&#x2665;</span>
            <span class="like-count">${pl.likes}</span>
        `; // the backtick allows you to use template literals, which lets you use variables inside the string

        // open modal when clicking the card (anywhere but heart)
        card.addEventListener("click", (e) => { // e stants for event basically, it is the event object that is passed to the function when the event occurs
            console.log("Card clicked!", e.target);
            if (!e.target.classList.contains("heart-btn")) {
                openModal(pl);
            }
        });

        // toggle(to move between two states) like/unlike
        const heart = card.querySelector(".heart-btn");
        const count = card.querySelector(".like-count");
        heart.addEventListener("click", (e) => {
            e.stopPropagation(); // prevent the click event from bubbling up to the card click event in the parent (the card click event would open the modal if we didn't stop propagation)
            let likes = parseInt(count.textContent, 10); // turns string to number, 10 is the radix (base) for decimal numbers
            if (heart.classList.contains("liked")) { // change button state and update count
                heart.classList.remove("liked");
                count.textContent = --likes;
            } else {
                heart.classList.add("liked");
                count.textContent = ++likes;
            }
        });

        container.appendChild(card);
    }

    // 2) Populate, create, and show modal
    function openModal(pl) {
        currentPlaylist = pl; // store the current playlist object
        modalCover.src = pl.cover; // set the cover image
        modalName.textContent = pl.name;
        modalCreator.textContent = "By " + pl.creator;
        renderSongs(pl.songs); // render the songs list in the modal
        modal.classList.add("show");
    }
    
    // Render the songs list
    function renderSongs(songs) {
        modalSongs.innerHTML = ""; // clear previous songs, so we can add new ones
        songs.forEach((s) => {
            const li = document.createElement("li");
            li.className = "song-item"; // add a class for styling
            li.innerHTML = `
                <div class="song-info">
                    <img src="${s.img}" alt="${s.title} cover" class="song-img">
                    <div class="song-text">
                        <h2>${s.title}</h2>
                        <p>By ${s.artist}</p>
                    </div>
                </div>
                <p class="song-duration">${s.duration}</p>
        `; 
            // li.textContent = `${s.title} — ${s.artist} (${s.duration})`;
            modalSongs.appendChild(li);
        });
    }

    function shuffleSongs(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]]; // swap elements
        }
        return arr;
    }

    // 3) Shuffle songs and update modal 
    shuffleBtn.addEventListener("click", () => {
        currentPlaylist.songs = shuffleSongs(currentPlaylist.songs);
        renderSongs(currentPlaylist.songs); // re-render the songs list with shuffled songs
    });

    // 3) Load playlists data via fetch().then() chaining, creating each card
    fetch("data/data.json")
    .then((response) => {
        if (!response.ok) { // Check if the response is OK (if code is 200)
            throw new Error("Network error: " + response.status);
        } // if we put catch here itll only catch errors up to now in the call, not in the .then() chain
        return response.json();
    })
    .then((data) => {
        data.playlists.forEach(createPlaylistCard); // Create a card for each playlist
    })
    .catch((err) => { // Catch has to go in the end of the chain to catch any errors that occured during the whole chain
        console.error("Failed to load playlists:", err);
    });

    // 4) Close handlers
    closeBtn.addEventListener("click", () => {
        modal.classList.remove("show");
    });
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
        modal.classList.remove("show");
        }
    });
});