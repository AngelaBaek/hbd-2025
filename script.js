document.addEventListener('DOMContentLoaded', () => {
    // --- Image Gallery Functionality ---
    const mainImage = document.getElementById('main-image');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');

    // 이미지 배열 (교체할 이미지들을 여기에 추가하세요)
    // 이미지 파일은 'images' 폴더에 넣어두세요.
    const images = [
        'https://github.com/AngelaBaek/hbd-2025/blob/main/images/image1.jpg',
        'https://github.com/AngelaBaek/hbd-2025/blob/main/images/image2.jpg',
        'https://github.com/AngelaBaek/hbd-2025/blob/main/images/image3.jpg',
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

    // --- Guestbook Functionality (Keep this as is, assuming it works as intended) ---
    const displayPhoto = document.getElementById('display-photo'); // This element doesn't seem to exist in index.html for this project, might be leftover from another project
    const thumbnails = document.querySelectorAll('.thumbnail'); // These elements don't seem to exist in index.html for this project

    // This section related to 'displayPhoto' and 'thumbnails' seems to be leftover from a different project
    // As it's not present in the provided index.html, it won't affect the current image gallery directly,
    // but it's good practice to remove unused code.
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            // Update the main display photo
            if (displayPhoto) { // Check if displayPhoto exists
                displayPhoto.src = thumbnail.src;
            }

            // Remove 'active' class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));

            // Add 'active' class to the clicked thumbnail
            thumbnail.classList.add('active');
        });
    });

    // Set the first thumbnail as active by default
    if (thumbnails.length > 0) {
        thumbnails[0].classList.add('active');
        if (displayPhoto) { // Check if displayPhoto exists
            displayPhoto.src = thumbnails[0].src;
        }
    }


    // --- Guestbook Functionality ---
    const guestbookForm = document.getElementById('guestbook-form'); // This element doesn't seem to exist in index.html for this project
    const guestbookEntriesContainer = document.getElementById('guestbook-entries'); // This element doesn't seem to exist in index.html for this project
    const nameInput = document.getElementById('name'); // This element doesn't seem to exist in index.html for this project
    const messageInput = document.getElementById('message'); // This element doesn't seem to exist in index.html for this project
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
        if (!guestbookEntriesContainer) return; // Exit if container not found
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
    if (guestbookForm) { // Check if guestbookForm exists
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
    }

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
        const paginationContainer = document.querySelector('.pagination'); // This element doesn't seem to exist in index.html for this project
        if (!paginationContainer) return; // Exit if container not found

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
    // These functions related to guestbook won't execute if the corresponding elements are not in index.html
    loadGuestbookEntries();
    renderGuestbook();
});

document.addEventListener('DOMContentLoaded', () => {
    const confettiContainer = document.getElementById('confetti-container');
    const colors = ['#f06', '#ff0', '#0f0', '#0ff', '#00f', '#f0f']; // 다양한 색상
    const numConfetti = 200; // 생성할 꽃가루 개수

    function createConfetti() {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.backgroundColor = colors [Math.floor(Math.random() * colors.length)];
        confetti.style.left = `${Math.random() * 100}vw`; // 화면 가로 위치 랜덤
        confetti.style.animationDelay = `${Math.random() * 5}s`; // 애니메이션 시작 딜레이
        confetti.style.animationDuration = `${Math.random() * 3 + 3}s`; // 애니메이션 지속 시간 (속도 조절)
        confetti.style.opacity = Math.random() * 0.7 + 0.3; // 투명도 랜덤
        confetti.style.transform = `scale(${Math.random() * 0.5 + 0.5})`; // 크기 랜덤

        // 회전 방향 및 속도 랜덤화 (css 변수 활용)
        const rotateDirection = Math.random() > 0.5 ? 1 : -1;
        const rotateSpeed = Math.random() * 180 + 180; // 180 ~ 360 deg/s
        confetti.style.setProperty('--rotate-direction', rotateDirection);
        confetti.style.setProperty('--rotate-speed', rotateSpeed);
        confetti.style.animationName = 'fall';

        confettiContainer.appendChild(confetti);

        // 꽃가루가 화면 아래로 사라지면 다시 생성 (지속적인 효과)
        confetti.addEventListener('animationiteration', () => {
            confetti.remove();
            createConfetti();
        });
    }

    // 초기 꽃가루 생성
    for (let i = 0; i < numConfetti; i++) {
        createConfetti();
    }

    // 기존 script.js 코드 (이미지 슬라이드 등)를 이어서 작성하거나 합칩니다.
});

    // --- 커스텀 마우스 커서 기능 시작 ---
    const customCursor = document.getElementById('custom-cursor');

    // customCursor 요소가 존재하는지 확인
    if (customCursor) {
        document.addEventListener('mousemove', (e) => {
            // 마우스의 현재 좌표를 가져와 커스텀 커서의 위치를 업데이트합니다.
            // transform을 사용하면 top/left보다 성능이 좋습니다.
            // -25px는 커서 이미지의 중심을 마우스 포인터에 맞추기 위함입니다 (커서 크기가 50px이라고 가정).
            customCursor.style.transform = `translate(${e.clientX - 25}px, ${e.clientY - 25}px)`;
        });
    } else {
        console.warn("ID가 'custom-cursor'인 요소를 찾을 수 없습니다. HTML에 추가했는지 확인해주세요.");
    }
    // --- 커스텀 마우스 커서 기능 끝 ---


    // 배경 음악 요소 가져오기
    const bgMusic = document.getElementById('background-music');

    // 최초 사용자 상호작용(예: 클릭) 발생 시 음악 재생 시도
    // (이벤트 리스너를 body에 추가하여 어디든 클릭하면 재생되도록)
    document.body.addEventListener('click', () => {
        if (bgMusic && bgMusic.paused) { // 음악이 일시정지 상태일 때만 재생
            bgMusic.play().catch(error => {
                // 자동 재생이 차단되었을 때 오류 처리
                console.log('오디오 자동 재생이 차단되었습니다:', error);
                // 사용자에게 재생 버튼을 누르도록 안내하는 메시지 등을 표시할 수 있습니다.
            });
        }
    }, { once: true }); // 이 리스너는 한 번만 실행되도록 설정
