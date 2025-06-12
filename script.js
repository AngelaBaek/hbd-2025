document.addEventListener('DOMContentLoaded', () => {
    const mainImage = document.getElementById('main-image');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');

    // 이미지 배열 (교체할 이미지들을 여기에 추가하세요)
    // 이미지 파일은 'images' 폴더에 넣어두세요.
    const images = [
        'images/image1.jpg',
        'images/image2.jpg',
        'images/image3.jpg',
        // 실제 사용할 이미지 파일의 경로를 여기에 추가해야 합니다.
        // 예: 'images/birthday_cake.jpg', 'images/jihoon_happy.png'
    ];

    let currentImageIndex = 0; // 현재 보여지는 이미지의 인덱스

    function updateImage() {
        // 이미지를 찾았고, 이미지 배열이 비어있지 않을 때만 src를 업데이트합니다.
        if (mainImage && images.length > 0) {
             mainImage.src = images[currentImageIndex];
        } else {
             // 개발자 도구 콘솔에서 이 메시지가 보인다면, 이미지 로딩에 문제가 있는 것입니다.
             console.error("이미지 요소(mainImage)를 찾을 수 없거나, 'images' 배열에 이미지가 없습니다.");
        }
    }

    // 이전 버튼 클릭 이벤트 리스너
    if (prevButton) { // prevButton이 존재하는지 확인 후 이벤트 리스너 추가
        prevButton.addEventListener('click', () => {
            currentImageIndex--; // 인덱스 감소
            if (currentImageIndex < 0) {
                currentImageIndex = images.length - 1; // 첫 이미지에서 이전 누르면 마지막 이미지로
            }
            updateImage(); // 이미지 업데이트
        });
    } else {
        console.error("이전 버튼(.prev-button)을 찾을 수 없습니다.");
    }


    // 다음 버튼 클릭 이벤트 리스너
    if (nextButton) { // nextButton이 존재하는지 확인 후 이벤트 리스너 추가
        nextButton.addEventListener('click', () => {
            currentImageIndex++; // 인덱스 증가
            if (currentImageIndex >= images.length) {
                currentImageIndex = 0; // 마지막 이미지에서 다음 누르면 첫 이미지로
            }
            updateImage(); // 이미지 업데이트
        });
    } else {
        console.error("다음 버튼(.next-button)을 찾을 수 없습니다.");
    }

    // 페이지 로드 시 초기 이미지 설정
    updateImage();
});

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