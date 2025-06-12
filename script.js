document.addEventListener("DOMContentLoaded", function () {
  const uploadForm = document.getElementById('uploadForm');
  const imageInput = document.getElementById('imageInput');
  const createBtn = document.getElementById('createAlbumBtn');
  const albumContainer = document.getElementById('albumContainer');
  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');
  const message = document.getElementById('message');
  const maxFiles = 10;
  let albumCreated = false;
  let currentPage = 0;

  // Limit files to 20 on selection
  imageInput.addEventListener('change', function () {
    message.textContent = '';
    if (this.files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files at once.`);
      this.value = ""; // Clear the input
    }
  });

  // Handle file upload
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
      message.textContent = data;
    } catch (error) {
      console.error('Upload failed', error);
      message.textContent = '❌ Upload failed. Please try again.';
    }
  });

  // Handle album creation
  createBtn.addEventListener('click', async () => {
    if (albumCreated) return;

    try {
      const response = await fetch('load-images.php');
      const imagesData = await response.json();

      if (!imagesData.length) {
        alert("Please upload some images.");
        return;
      }

      if (imagesData.length < 6) {
        alert("Please upload at least 6 images to view the album.");
        return;
      }

      albumContainer.innerHTML = '';
      currentPage = 0;

      function getImageHTML(index) {
        return imagesData[index]
          ? `<img src="images/${imagesData[index]}" alt="">`
          : '';
      }

      // Create flipbook pages: 3 images per side
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

        albumContainer.appendChild(page);
      }

      // Flip navigation logic
      const pages = document.querySelectorAll('.page');

      nextPageBtn.addEventListener('click', () => {
        if (currentPage < pages.length) {
          pages[currentPage].classList.add('flipped');
          currentPage++;
        }
      });

      prevPageBtn.addEventListener('click', () => {
        if (currentPage > 0) {
          currentPage--;
          pages[currentPage].classList.remove('flipped');
        }
      });

      albumCreated = true;
    } catch (error) {
      console.error('Failed to load images', error);
      alert("⚠️ Failed to load album. Please try again.");
    }
  });
});
