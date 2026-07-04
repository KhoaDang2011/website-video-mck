document.addEventListener('DOMContentLoaded', () => {
    const videoPlayer = document.querySelector('.video-player video');
    const videoTitle = document.getElementById('video-title');
    const videoStats = document.getElementById('video-stats');
    const suggestionSidebar = document.querySelector('.suggestion-sidebar');
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

    // 1. Lấy ID video từ localStorage
    const currentVideoId = localStorage.getItem('currentVideoId');
    const localVideos = JSON.parse(localStorage.getItem('myTubeVideos')) || videos;

    if (!currentVideoId) {
        videoTitle.textContent = "Không tìm thấy video.";
        return;
    }

    // 2. Tìm video chính và hiển thị
    const mainVideo = localVideos.find(video => video.id === currentVideoId);

    if (mainVideo) {
        videoPlayer.src = mainVideo.videoSrc || '';
        videoPlayer.poster = mainVideo.thumbnail;
        videoTitle.textContent = mainVideo.title;
        videoStats.textContent = `${mainVideo.views} lượt xem • ${mainVideo.time}`;
    } else {
        videoTitle.textContent = "Lỗi: Không thể tải video.";
    }

    // 3. Hiển thị danh sách video gợi ý
    const suggestedVideos = localVideos.filter(video => video.id !== currentVideoId);
    suggestionSidebar.innerHTML = ''; // Xóa gợi ý cũ

    suggestedVideos.forEach(video => {
        const suggestionCardHTML = `
            <div class="suggestion-card" data-id="${video.id}">
                <div class="thumbnail">
                    <img src="${video.thumbnail}" alt="Thumbnail">
                    <span class="duration">${video.duration || '00:00'}</span>
                </div>
                <div class="text-info">
                    <h3>${video.title}</h3>
                    <p>${video.channelName}</p>
                    <p>${video.views} lượt xem</p>
                </div>
            </div>
        `;
        suggestionSidebar.insertAdjacentHTML('beforeend', suggestionCardHTML);
    });

    // 4. Thêm sự kiện click cho các video gợi ý
    const suggestionCards = document.querySelectorAll('.suggestion-card');
    suggestionCards.forEach(card => {
        card.addEventListener('click', () => {
            const videoId = card.getAttribute('data-id');
            localStorage.setItem('currentVideoId', videoId);
            window.location.reload();
        });
    });
});
