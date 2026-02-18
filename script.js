// 倒计时功能
function updateCountdown() {
    const now = new Date();
    const nextBirthday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    if (now.getMonth() === 11 && now.getDate() === 31) {
        nextBirthday.setFullYear(now.getFullYear() + 1, 0, 1);
    }
    
    const diff = nextBirthday - now;
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('countdown').innerHTML = 
        `⏳ 距离下一个生日还有: ${hours}小时 ${minutes}分钟 ${seconds}秒`;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// 许愿功能
let wishCount = 0;
function addWish() {
    wishCount++;
    const wishList = document.getElementById('wishList');
    const wishItem = document.createElement('div');
    wishItem.className = 'wish-item';
    wishItem.innerHTML = `✨ 愿望 #${wishCount}: 希望所有的梦想都能实现！`;
    wishList.insertBefore(wishItem, wishList.firstChild);
    
    // 限制显示最近5个愿望
    if (wishList.children.length > 5) {
        wishList.removeChild(wishList.lastChild);
    }
}

// 礼物盒功能
function openGift() {
    const gift = document.querySelector('.gift');
    const giftText = document.querySelector('.gift-text');
    
    if (!gift.classList.contains('open')) {
        gift.classList.add('open');
        giftText.textContent = '🎊 礼物已打开！祝你生日快乐！🎊';
        
        // 显示惊喜消息
        setTimeout(() => {
            alert('🎉 恭喜！你收到了一份特别的生日祝福！愿你天天开心，万事如意！🎂');
        }, 500);
    }
}

// 音乐控制
const birthdaySong = document.getElementById('birthdaySong');
let isPlaying = false;

function toggleMusic() {
    const musicBtn = document.querySelector('.music-btn');
    
    if (isPlaying) {
        birthdaySong.pause();
        musicBtn.innerHTML = '<i class="fas fa-music"></i> 播放音乐';
        isPlaying = false;
    } else {
        // 注意：需要添加birthday.mp3文件或使用在线音乐链接
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        birthdaySong.play().then(() => {
            musicBtn.innerHTML = '<i class="fas fa-pause"></i> 暂停音乐';
            isPlaying = true;
        }).catch(e => {
            console.log('自动播放被阻止，请点击页面任意位置后再试');
            // 添加点击事件来触发音频播放
            document.body.addEventListener('click', () => {
                birthdaySong.play();
                musicBtn.innerHTML = '<i class="fas fa-pause"></i> 暂停音乐';
                isPlaying = true;
            }, { once: true });
        });
    }
}

// 雪花效果（可选）
function createSnow() {
    const container = document.querySelector('.container');
    for (let i = 0; i < 50; i++) {
        const snow = document.createElement('div');
        snow.className = 'snow';
        snow.style.left = Math.random() * 100 + 'vw';
        snow.style.animationDuration = Math.random() * 3 + 2 + 's';
        snow.style.opacity = Math.random();
        snow.style.width = Math.random() * 10 + 5 + 'px';
        snow.style.height = snow.style.width;
        container.appendChild(snow);
    }
}

// 页面加载完成后执行
window.addEventListener('load', () => {
    createSnow();
});