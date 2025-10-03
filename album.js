  const params = new URLSearchParams(window.location.search);
  const album = params.get("album");
  const main = document.getElementById("content");

  if (album) {
    // Show album grid
  main.innerHTML = `
    <div class="flex items-center gap-4 mb-4 fixed">
      <button id="backBtn" class="px-4 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition">
        ← Back
      </button>
      <h1 class="text-xl font-bold">${album}</h1>
    </div>

    <div id="galleryWrapper" class="max-h-[80vh] overflow-y-auto mt-[55px]">
      <div id="gallery" class="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5"></div>
    </div>
  `;

  // Back button handler
  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = window.location.pathname; // reload without ?album
  });

    // Fetch album photos
 fetch("album.json")
  .then(res => res.json())
  .then(data => {
    if (data[album]) {
      const gallery = document.getElementById("gallery");
      data[album].forEach(file => {
        const img = document.createElement("img");
        img.src = `assets/img/${album}/${file}`;
        img.className = "w-full h-auto rounded-md shadow hover:scale-105 transition";
        gallery.appendChild(img);
      });
    }
  });
  } else {
    // Show default cards (your current code)
    main.innerHTML = `
      <div class="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 auto-rows-[minmax(220px,auto)]">

        <a href="?album=Magnum Opus">
          <article class="relative select-none cursor-pointer">
            <img src="assets/img/Magnum Opus/cover.png" class="w-full h-72 object-cover rounded-md shadow-lg hover:scale-105 transition" />
            <div class="mt-2 text-center text-gray-600 font-serif text-xs sm:text-sm font-medium">Sylus: Magnum Opus</div>
          </article>
        </a>

        <a href="?album=Night of Secrecy">
          <article class="relative select-none cursor-pointer">
            <img src="assets/img/Night of Secrecy/cover.png" class="w-full h-72 object-cover rounded-md shadow-lg hover:scale-105 transition" />
            <div class="mt-2 text-center text-gray-600 font-serif text-xs sm:text-sm font-medium">Sylus: Night of Secrecy</div>
          </article>
        </a>

                <a href="?album=Where Heart Lives">
          <article class="relative select-none cursor-pointer">
            <img src="assets/img/Where Heart Lives/cover.png" class="w-full h-72 object-cover rounded-md shadow-lg hover:scale-105 transition" />
            <div class="mt-2 text-center text-gray-600 font-serif text-xs sm:text-sm font-medium">Sylus: Where Heart Lives</div>
          </article>
        </a>

      </div>
    `;
  }