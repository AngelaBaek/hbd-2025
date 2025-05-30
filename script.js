document.addEventListener('DOMContentLoaded', () => {
  // --- Image Gallery Functionality ---
  const displayPhoto = document.getElementById('display-photo');
  const thumbnails = document.querySelectorAll('.thumbnail');

  thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', () => {
          // Update the main display photo
          displayPhoto.src = thumbnail.src;

          // Remove 'active' class from all thumbnails
          thumbnails.forEach(t => t.classList.remove('active'));

          // Add 'active' class to the clicked thumbnail
          thumbnail.classList.add('active');
      });
  });

  // Set the first thumbnail as active by default
  if (thumbnails.length > 0) {
      thumbnails[0].classList.add('active');
      displayPhoto.src = thumbnails[0].src;
  }


  // --- Guestbook Functionality ---
  const guestbookForm = document.getElementById('guestbook-form');
  const guestbookEntriesContainer = document.getElementById('guestbook-entries');
  const nameInput = document.getElementById('name');
  const messageInput = document.getElementById('message');
  const entriesPerPage = 3; // Number of guestbook entries per page
  let currentPage = 1;
  let guestbookEntries = [];

  // Load entries from localStorage
  function loadGuestbookEntries() {
      const storedEntries = localStorage.getItem('guestbookEntries');
      if (storedEntries) {
          guestbookEntries = JSON.parse(storedEntries);
      }
  }

  // Save entries to localStorage
  function saveGuestbookEntries() {
      localStorage.setItem('guestbookEntries', JSON.stringify(guestbookEntries));
  }

  // Render guestbook entries for the current page
  function renderGuestbook() {
      guestbookEntriesContainer.innerHTML = ''; // Clear existing entries
      const startIndex = (currentPage - 1) * entriesPerPage;
      const endIndex = startIndex + entriesPerPage;
      const entriesToDisplay = guestbookEntries.slice(startIndex, endIndex);

      if (entriesToDisplay.length === 0 && guestbookEntries.length > 0 && currentPage > 1) {
          // If no entries on current page but there are entries, go to previous page
          currentPage--;
          renderGuestbook();
          return;
      }


      entriesToDisplay.forEach((entry, index) => {
          const entryDiv = document.createElement('div');
          entryDiv.classList.add('guestbook-entry');
          entryDiv.innerHTML = `
              <div class="entry-header">
                  <span class="name">${entry.name}</span>
                  <span class="date">${entry.date}</span>
              </div>
              <div class="entry-content">${entry.message}</div>
              <button class="delete-button" data-index="${startIndex + index}">삭제</button>
          `;
          guestbookEntriesContainer.appendChild(entryDiv);
      });

      addDeleteButtonListeners();
      renderPagination();
  }

  // Add event listeners to delete buttons
  function addDeleteButtonListeners() {
      document.querySelectorAll('.delete-button').forEach(button => {
          button.addEventListener('click', (event) => {
              const indexToDelete = parseInt(event.target.dataset.index);
              deleteGuestbookEntry(indexToDelete);
          });
      });
  }

  // Handle guestbook form submission
  guestbookForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent default form submission

      const name = nameInput.value.trim();
      const message = messageInput.value.trim();

      if (name && message) {
          const newEntry = {
              name: name,
              message: message,
              date: new Date().toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
              }).replace(/\. /g, '.').replace(/\.$/, '') // Format like "YYYY.MM.DD HH:MM"
          };
          guestbookEntries.unshift(newEntry); // Add new entry to the beginning
          saveGuestbookEntries();
          currentPage = 1; // Go to the first page to see the new entry
          renderGuestbook();
          guestbookForm.reset(); // Clear the form
      } else {
          alert('이름과 메시지를 모두 입력해주세요.');
      }
  });

  // Delete a guestbook entry
  function deleteGuestbookEntry(index) {
      if (confirm('정말로 이 메시지를 삭제하시겠습니까?')) {
          guestbookEntries.splice(index, 1);
          saveGuestbookEntries();
          renderGuestbook();
      }
  }

  // Render pagination buttons
  function renderPagination() {
      const paginationContainer = document.querySelector('.pagination');
      paginationContainer.innerHTML = '';
      const totalPages = Math.ceil(guestbookEntries.length / entriesPerPage);

      if (totalPages <= 1) {
          return; // No pagination needed if 1 or less pages
      }

      for (let i = 1; i <= totalPages; i++) {
          const button = document.createElement('button');
          button.textContent = i;
          button.classList.add('page-button');
          if (i === currentPage) {
              button.classList.add('active');
          }
          button.addEventListener('click', () => {
              currentPage = i;
              renderGuestbook();
          });
          paginationContainer.appendChild(button);
      }
  }

  // Initial load of guestbook entries
  loadGuestbookEntries();
  renderGuestbook();
});