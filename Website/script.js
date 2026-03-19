document.addEventListener('DOMContentLoaded', () => {
    const videoContent = document.querySelector('.video-content');
    const searchInput = document.querySelector('.search-box input');
    const uploadIcon = document.querySelector('.fa-video');
    const uploadInput = document.getElementById('upload-input');
    const userAvatar = document.querySelector('.user-avatar');

    // --- DARK MODE LOGIC ---
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    userAvatar.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.removeItem('theme');
        }
    });

    // Lấy dữ liệu video từ localStorage hoặc từ data.js nếu chưa có
    let localVideos = JSON.parse(localStorage.getItem('myTubeVideos'));
    if (!localVideos) {
        localVideos = videos; // `videos` từ data.js
        localStorage.setItem('myTubeVideos', JSON.stringify(localVideos));
    }

    // Gán sự kiện click cho các video card
    function addVideoClickHandlers() {
        const videoCards = document.querySelectorAll('.video-card');
        videoCards.forEach(card => {
            card.addEventListener('click', () => {
                const videoId = card.getAttribute('data-id');
                localStorage.setItem('currentVideoId', videoId);
                window.location.href = 'watch.html';
            });
        });
    }

    // Hàm để render danh sách video
    function renderVideos(videoArray) {
        videoContent.innerHTML = ''; // Xóa nội dung cũ

        videoArray.forEach(video => {
            const videoCardHTML = `
                <div class="video-card" data-id="${video.id}">
                    <div class="thumbnail">
                        <img src="${video.thumbnail}" alt="Thumbnail">
                        <span class="duration">${video.duration || '00:00'}</span>
                    </div>
                    <div class="video-info">
                        <div class="channel-img"></div>
                        <div class="text-info">
                            <h3>${video.title}</h3>
                            <p>${video.channelName}</p>
                            <p>${video.views} lượt xem • ${video.time}</p>
                        </div>
                    </div>
                </div>
            `;
            videoContent.insertAdjacentHTML('beforeend', videoCardHTML);
        });

        addVideoClickHandlers();
    }

    // Sự kiện tìm kiếm
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredVideos = localVideos.filter(video => 
            video.title.toLowerCase().includes(searchTerm)
        );
        renderVideos(filteredVideos);
    });

    // Sự kiện Upload
    uploadIcon.addEventListener('click', () => {
        uploadInput.click();
    });

    uploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const title = prompt("Nhập tiêu đề cho video:", "Video mới của tôi");
            if (title) {
                const newVideo = {
                    id: 'v' + Date.now(), // Tạo ID duy nhất
                    title: title,
                    thumbnail: URL.createObjectURL(file),
                    videoSrc: URL.createObjectURL(file), // Link để xem video
                    channelName: 'Kênh Của Bạn',
                    views: '0',
                    time: 'Vừa xong',
                    duration: '00:00'
                };

                localVideos.unshift(newVideo); // Thêm vào đầu mảng
                localStorage.setItem('myTubeVideos', JSON.stringify(localVideos)); // Cập nhật localStorage
                renderVideos(localVideos); // Hiển thị lại danh sách
            }
        }
    });

    // Hiển thị video khi tải trang
    // renderVideos(localVideos);

    // --- SKELETON LOADING LOGIC ---
    function displaySkeletons() {
        videoContent.innerHTML = ''; // Xóa nội dung cũ
        for (let i = 0; i < 10; i++) { // Hiển thị 10 khung xương
            const skeletonCardHTML = `
                <div class="skeleton-card">
                    <div class="thumbnail skeleton"></div>
                    <div class="video-info">
                        <div class="channel-img skeleton"></div>
                        <div class="text-info" style="flex: 1;">
                            <div class="skeleton skeleton-title"></div>
                            <div class="skeleton skeleton-channel"></div>
                        </div>
                    </div>
                </div>
            `;
            videoContent.insertAdjacentHTML('beforeend', skeletonCardHTML);
        }
    }

    displaySkeletons();

    setTimeout(() => {
        renderVideos(localVideos);
    }, 1500); // Tải dữ liệu thật sau 1.5 giây
});
