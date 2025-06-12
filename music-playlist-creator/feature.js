// Wait for the HTML to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
    // 0) Get references to DOM elements so yu can easily access them later
    const container = document.getElementById("feature-container");
    const featureCover = document.getElementById("feature-cover");
    const featureName = document.getElementById("feature-name");
    const featureCreator = document.getElementById("feature-creator");
    const featureSongs = document.getElementById("feature-songs");

    // 2) Populate, create, and show modal
    function createFeature(pl) {
        featureCover.src = pl.cover; // set the cover image
        featureName.textContent = pl.name;
        featureCreator.textContent = "By " + pl.creator;
        renderSongs(pl.songs); // render the songs list in the modal
    }
    
    // Render the songs list
    function renderSongs(songs) {
        featureSongs.innerHTML = ""; // clear previous songs, so we can add new ones
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
            featureSongs.appendChild(li);
        });
    }

    // 3) Load playlists data via fetch().then() chaining, creating each card
    fetch("data/data.json")
    .then((response) => {
        if (!response.ok) { // Check if the response is OK (if code is 200)
            throw new Error("Network error: " + response.status);
        } // if we put catch here itll only catch errors up to now in the call, not in the .then() chain
        return response.json();
    })
    .then((data) => {
        let n = data.playlists.length; // Get the number of playlists
        let i = Math.floor(Math.random() * n); // Get a random index
        createFeature(data.playlists[i]); // Create a crandom feature
    })
    .catch((err) => { // Catch has to go in the end of the chain to catch any errors that occured during the whole chain
        console.error("Failed to load playlists:", err);
    });
});