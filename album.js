const params = new URLSearchParams(window.location.search);
const album = params.get("album");
const main = document.getElementById("content");

// Function to render album cards
function renderAlbums(filterArtist = "All") {
  fetch("album.json")
    .then(res => res.json())
    .then(data => {
      main.innerHTML = `
        <div class="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 auto-rows-[minmax(220px,auto)]"></div>
      `;
      const grid = main.querySelector("div");

      Object.keys(data).forEach(albumName => {
        // Map albums to artist manually if needed
        let albumArtist = "";
        if (albumName === "Magnum Opus" || albumName === "Night of Secrecy" || albumName === "Where Heart Lives") albumArtist = "Sylus";
        else if (albumName === "Diviner's Stillness") albumArtist = "Zayne";
        else albumArtist = "Other";

        if (filterArtist === "All" || albumArtist === filterArtist) {
          const article = document.createElement("article");
          article.className = "relative select-none cursor-pointer";
          article.innerHTML = `
            <img src="assets/img/${albumName}/cover.png" class="w-full h-72 object-cover rounded-md shadow-lg hover:scale-105 transition" />
            <div class="mt-2 text-center text-gray-600 font-serif text-xs sm:text-sm font-medium">${albumArtist}: ${albumName}</div>
          `;
          article.addEventListener("click", () => {
            window.location.search = `?album=${encodeURIComponent(albumName)}`;
          });
          grid.appendChild(article);
        }
      });
    });
}

// Function to show single album view
function renderSingleAlbum(albumName) {
  main.innerHTML = `
    <div class="flex items-center gap-4 mb-4 fixed">
      <button id="backBtn" class="px-4 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition">
        ← Back
      </button>
      <h1 class="text-xl font-bold">${albumName}</h1>
    </div>

    <div id="galleryWrapper" class="max-h-[80vh] overflow-y-auto mt-[55px]">
      <div id="gallery" class="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5"></div>
    </div>
  `;

  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = window.location.pathname; // reload without ?album
  });

  fetch("album.json")
    .then(res => res.json())
    .then(data => {
      if (data[albumName]) {
        const gallery = document.getElementById("gallery");
        data[albumName].forEach(file => {
          const img = document.createElement("img");
          img.src = `assets/img/${albumName}/${file}`;
          img.className = "w-full h-auto rounded-md shadow hover:scale-105 transition";
          gallery.appendChild(img);
        });
      }
    });
}

// Initial rendering
if (album) {
  renderSingleAlbum(album);
} else {
  renderAlbums();
}

// Navbar button filtering
const buttons = document.querySelectorAll(".artist-btn");
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const artist = btn.dataset.artist;

    // Update button styles
    buttons.forEach(b => {
      if (b === btn) {
        b.classList.add("bg-gray-900", "text-white");
        b.classList.remove("hover:text-pink-600");
      } else {
        b.classList.remove("bg-gray-900", "text-white");
        b.classList.add("hover:text-pink-600");
      }
    });

    // Render albums based on selected artist
    renderAlbums(artist);
  });
});
