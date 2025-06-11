document.addEventListener("DOMContentLoaded", function () {
  const uploadForm = document.getElementById('uploadForm');
  const imageInput = document.getElementById('imageInput');
  const createBtn = document.getElementById('createAlbumBtn');
  const albumContainer = document.getElementById('albumContainer');
  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');

  // Clear message when user selects files
  imageInput.addEventListener('change', function () {
    document.getElementById('message').textContent = '';
  });

  // Upload form handler
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = document.getElementById('message');
    message.textContent = '';

    const formData = new FormData(uploadForm);
    await fetch('upload.php', {
      method: 'POST',
      body: formData
    }).then(res => res.text()).then(data => {
      message.textContent = data;
    }).catch(error => {
      console.error('Upload failed', error);
      message.textContent = 'Upload failed';
    });
  });

  // Create the album on button click
  createBtn.addEventListener('click', async () => {
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

    let currentPage = 0;

    function getImageHTML(index) {
      if (imagesData[index]) {
        return `<img src="images/${imagesData[index]}" alt="">`;
      } else {
        return `<img class="empty-image" src="" alt="Empty" style="display: none;">`;
      }
    }

    // Create each flipbook page with front and back (3 images per side)
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

    // Setup flipping navigation
    const pages = document.querySelectorAll('.page');
    currentPage = 0;

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
  });
});
