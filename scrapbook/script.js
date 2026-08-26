// ===== SCRAPBOOK INTERACTION CONTROLLER (PAPER TEAR & MUSIC) ===== //

let currentPage = 0;
const pages = document.querySelectorAll('.page');
const totalPages = pages.length;

const audio = document.getElementById('bgm-audio');
const musicIcon = document.getElementById('music-icon');
const musicLabel = document.getElementById('music-label');
let isPlaying = false;

// Music Functions
function toggleMusic() {
    if (!audio) return;
    
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        musicIcon.classList.remove('playing');
        musicIcon.textContent = '🎵';
        musicLabel.textContent = 'Music';
    } else {
        audio.play().then(() => {
            isPlaying = true;
            musicIcon.classList.add('playing');
            musicIcon.textContent = '💿';
            musicLabel.textContent = 'Playing';
        }).catch(err => {
            console.log('Audio autoplay prevented or file missing:', err);
            alert('File lagu belum ditemukan di folder scrapbook. Silakan taruh lagu di folder scrapbook/music/song.mp3');
        });
    }
}

function tryPlayMusic() {
    if (!isPlaying && audio) {
        audio.play().then(() => {
            isPlaying = true;
            musicIcon.classList.add('playing');
            musicIcon.textContent = '💿';
            musicLabel.textContent = 'Playing';
        }).catch(() => {
            // Autoplay prevented by browser, user can click music button manually
        });
    }
}

// Setup stack z-indices & tear state
function initStack() {
    pages.forEach((page, index) => {
        if (index === 0) {
            page.classList.add('active');
            page.classList.remove('torn');
            page.style.zIndex = totalPages + 10;
        } else {
            page.classList.remove('active', 'torn');
            page.style.zIndex = totalPages - index;
        }
    });
}

function turnPage(targetPage) {
    if (targetPage < 0 || targetPage >= totalPages || targetPage === currentPage) return;

    pages.forEach((page, index) => {
        if (index < targetPage) {
            // Pages before target -> torn off to the left
            page.classList.add('torn');
            page.classList.remove('active');
            page.style.zIndex = totalPages - index;
        } else if (index === targetPage) {
            // Target page -> active on top of stack
            page.classList.remove('torn');
            page.classList.add('active');
            page.style.zIndex = totalPages + 10;
        } else {
            // Pages after target -> stacked underneath on right
            page.classList.remove('torn', 'active');
            page.style.zIndex = totalPages - index;
        }
    });

    currentPage = targetPage;
}

// Touch Swipe Gesture Support (Mobile Smoothness)
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    const minSwipeDistance = 45; // Minimum px to trigger paper tear

    if (swipeDistance < -minSwipeDistance) {
        // Swiped Left -> Tear off to Next
        if (currentPage < totalPages - 1) {
            turnPage(currentPage + 1);
        }
    } else if (swipeDistance > minSwipeDistance) {
        // Swiped Right -> Restore Previous
        if (currentPage > 0) {
            turnPage(currentPage - 1);
        }
    }
}

// Keyboard Arrow Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'Space') {
        if (currentPage < totalPages - 1) {
            turnPage(currentPage + 1);
        }
    } else if (e.key === 'ArrowLeft') {
        if (currentPage > 0) {
            turnPage(currentPage - 1);
        }
    }
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initStack);
