document.addEventListener("DOMContentLoaded", function () {
  const uploadForm = document.getElementById('uploadForm');
  const imageInput = document.getElementById('imageInput');
  const createBtn = document.getElementById('createAlbumBtn');
  const albumContainer = document.getElementById('albumContainer');
  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');
  const message = document.getElementById('message');
  const maxFiles = 10;

  let currentPage = 0;
  let pages = [];

  // Validate file count
  imageInput.addEventListener('change', function () {
    message.textContent = '';
    if (this.files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files at once.`);
      this.value = "";
    }
  });

  // Upload images
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.textContent = 'Uploading...';

    const formData = new FormData(uploadForm);

    try {
      const res = await fetch('upload.php', {
        method: 'POST',
        body: formData
      });
      const data = await res.text();
      message.innerHTML = data;

      alert(" Images uploaded successfully! Now click 'Create Album' to refresh.");
      imageInput.value = ""; // Clear selected files
    } catch (error) {
      console.error('Upload failed', error);
      message.textContent = ' Upload failed.';
    }
  });

  // Create album
  createBtn.addEventListener('click', async () => {
    try {
      // Cache-busting trick
      const response = await fetch('load-images.php?ts=' + Date.now());
      const imagesData = await response.json();

      if (!imagesData.length) {
        alert(" No images found.");
        return;
      }

      if (imagesData.length < 6) {
        alert(" Please upload at least 6 images to view the album.");
        return;
      }

      albumContainer.innerHTML = '';
      pages = [];
      currentPage = 0;

      const getImageHTML = (index) => {
        return imagesData[index]
          ? `<img src="images/${imagesData[index]}?ts=${Date.now()}" alt="">`
          : '';
      };

      for (let i = 0; i < imagesData.length; i += 6) {
        const page = document.createElement('div');
        page.classList.add('page');

        page.innerHTML = `
          <div class="front">
            <div class="column">
              ${getImageHTML(i)}
              ${getImageHTML(i + 1)}
              ${getImageHTML(i + 2)}
            </div>
          </div>
          <div class="back">
            <div class="column">
              ${getImageHTML(i + 3)}
              ${getImageHTML(i + 4)}
              ${getImageHTML(i + 5)}
            </div>
          </div>
        `;

        page.style.zIndex = `${imagesData.length - i}`;
        albumContainer.appendChild(page);
        pages.push(page);
      }

      alert("Album created. Use next/prev buttons to flip.");

      // Navigation
      nextPageBtn.onclick = () => {
        if (currentPage < pages.length) {
          pages[currentPage].classList.add('flipped');
          pages[currentPage].style.zIndex = 1000 + currentPage;
          currentPage++;
        }
      };

      prevPageBtn.onclick = () => {
        if (currentPage > 0) {
          currentPage--;
          pages[currentPage].classList.remove('flipped');
          pages[currentPage].style.zIndex = 1000 - currentPage;
        }
      };

    } catch (error) {
      console.error('Album creation failed', error);
      alert(" Could not load album.");
    }
  });
});
