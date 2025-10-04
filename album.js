const params = new URLSearchParams(window.location.search);
const album = params.get("album");
const main = document.getElementById("content");

// Global variable to store album data
let albumData = null;

// Fetch album.json once
fetch("album.json")
  .then(res => res.json())
  .then(data => {
    albumData = data;
    // Initial rendering
    if (album) renderSingleAlbum(album);
    else renderAlbums();
  })
  .catch(err => console.error("Failed to load album.json:", err));

// Function to render album cards
function renderAlbums(filterArtist = "All") {
  if (!albumData) return;

  main.innerHTML = `

    <div id="albumWrapper" class="max-h-[80vh] overflow-y-auto mt-[20px] px-4">
      <div id="albumGrid" class="grid gap-6 grid-cols-2 mt-[10px] sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 auto-rows-[minmax(220px,auto)] "></div>
    </div>
  `;

  const grid = document.getElementById("albumGrid");
  const fragment = document.createDocumentFragment();

  Object.keys(albumData).forEach(albumName => {
    // Map albums to artist manually
    let albumArtist = "";
    if (["Passionate Appraisal","Innocent Birdcage","Alternative Darkborne","Abyssal Mark","Abyssal Blossom","Long-Awaited Reverly","Absurdity Unfolds","Midnight Stealth", "Magnum Opus", 
      "Night of Secrecy", "Where Heart Lives", "Lovespeed Ride"].includes(albumName)) albumArtist = "Sylus";
    else if (["Diviner's Stillness","Diviner's Hymn" ].includes(albumName)) albumArtist = "Zayne";
    else albumArtist = "Other";

    if (filterArtist === "All" || albumArtist === filterArtist) {
      const article = document.createElement("article");
      article.className = "relative select-none cursor-pointer";
      article.innerHTML = `
        <img src="assets/img/${albumName}/cover.png" 
             class="w-full h-72 object-cover rounded-md shadow-lg hover:scale-105 transition" 
             loading="lazy" />
        <div class="mt-2 text-center text-gray-600 font-serif text-xs sm:text-sm font-medium">
          ${albumArtist}: ${albumName}
        </div>
      `;
      article.addEventListener("click", () => {
        window.location.search = `?album=${encodeURIComponent(albumName)}`;
      });
      fragment.appendChild(article);
    }
  });

  grid.appendChild(fragment);
}


// Function to show single album view
function renderSingleAlbum(albumName) {

    // Hide global back button
  const globalBackBtn = document.getElementById("globalBackBtn");
  if (globalBackBtn) globalBackBtn.style.display = "none";
  
  if (!albumData || !albumData[albumName]) return;

  main.innerHTML = `
    <div class="flex items-center gap-4 mb-4 fixed ">
      <button id="backBtn" class="px-4 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition">
        ← Back
      </button>
      <h1 class="text-xl font-bold">${albumName}</h1>
    </div>

    <div id="galleryWrapper" class="max-h-[80vh] overflow-y-auto mt-[55px]">
      <div id="gallery" class="grid gap-4 grid-cols-2 mt-[10px] sm:grid-cols-3 md:grid-cols-5"></div>
    </div>
  `;


  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = window.location.pathname; // reload without ?album
    // Show the global back button again
    if (globalBackBtn) globalBackBtn.style.display = "block";
  });


  const gallery = document.getElementById("gallery");
  const fragment = document.createDocumentFragment();

  albumData[albumName].forEach(file => {
    const img = document.createElement("img");
    img.src = `assets/img/${albumName}/${file}`;
    img.loading = "lazy"; // lazy-load images
    img.className = "w-full h-auto rounded-md shadow hover:scale-105 transition";
    fragment.appendChild(img);
  });

  gallery.appendChild(fragment);
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
