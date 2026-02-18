// ======================
// 农历倒计时功能
// ======================

function updateLunarCountdown() {
    // 获取当前日期
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // 计算今年的农历大年初三
    let targetDate = getLunarDate(currentYear, 1, 3); // 农历正月初三
    
    // 如果今年的大年初三已过，计算明年的
    if (now > targetDate) {
        targetDate = getLunarDate(currentYear + 1, 1, 3);
    }
    
    // 检查今天是否是目标日期（精确到天）
    const isTargetDay = isSameDay(now, targetDate);
    
    // 更新UI
    if (isTargetDay) {
        // 今天是农历大年初三！
        document.getElementById('countdownTitle').textContent = '🎉 今日吉日 🎉';
        document.getElementById('countdown').style.display = 'none';
        
        const specialMessage = document.getElementById('specialMessage');
        specialMessage.textContent = '今天是农历大年初三，快快许愿吧！🎂✨';
        specialMessage.className = 'special-message birthday';
        specialMessage.style.display = 'block';
        
        // 添加生日特效
        addBirthdayEffects();
    } else {
        // 正常倒计时
        document.getElementById('countdownTitle').textContent = '⏳ 距离农历大年初三还有';
        document.getElementById('countdown').style.display = 'flex';
        document.getElementById('specialMessage').style.display = 'none';
        
        // 计算时间差
        const diff = targetDate - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // 更新显示
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
}

// 获取农历对应的公历日期
function getLunarDate(year, lunarMonth, lunarDay) {
    try {
        // chineseLunar 是全局变量，由 CDN 加载
        const solarDate = chineseLunar.lunarToSolar(year, lunarMonth, lunarDay, 0);
        // solarDate 格式: [year, month(1-12), day, leapMonth]
        return new Date(solarDate[0], solarDate[1] - 1, solarDate[2]);
    } catch (e) {
        console.error('农历计算失败:', e);
        // 备用方案：使用2025年大年初三作为示例（2025年1月31日是大年初一，2月2日是初三）
        if (year === 2025) return new Date(2025, 1, 2); // 2025年2月2日
        if (year === 2026) return new Date(2026, 1, 21); // 2026年2月21日（估算）
        return new Date(year, 1, 15); // 默认返回2月15日
    }
}

// 判断两个日期是否是同一天
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

// 生日特效
function addBirthdayEffects() {
    // 添加飘落的彩纸
    createConfetti();
    
    // 蛋糕蜡烛闪烁加速
    const flames = document.querySelectorAll('.flame');
    flames.forEach(flame => {
        flame.style.animation = 'flicker 0.1s infinite alternate';
    });
}

// 彩纸效果
function createConfetti() {
    const container = document.querySelector('.container');
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#feca57'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-20px';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.opacity = Math.random();
        confetti.style.position = 'absolute';
        confetti.style.zIndex = '100';
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
        
        container.appendChild(confetti);
        
        // 3秒后移除
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
    
    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// 初始化倒计时（每秒更新）
setInterval(updateLunarCountdown, 1000);
updateLunarCountdown(); // 立即执行一次

// ======================
// 其他原有功能保持不变
// ======================

// 表单提交处理（保持原有逻辑）
const giftForm = document.getElementById('giftForm');
const formMessage = document.getElementById('formMessage');
const wishList = document.getElementById('wishList');

if (giftForm) {
    giftForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const giftInput = document.getElementById('giftInput');
        const giftName = giftInput.value.trim();
        
        if (!giftName) {
            showFormMessage('请输入你想要的礼物！', 'error');
            return;
        }
        
        // 显示加载状态
        const submitBtn = giftForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
        submitBtn.disabled = true;
        
        try {
            // 保存到本地作为备份
            saveGiftLocally(giftName);
            addWishToHistory(giftName);
            
            showFormMessage('🎉 愿望已发送！生日当天可能会实现哦~', 'success');
            giftInput.value = '';
            
        } catch (error) {
            console.error('提交失败:', error);
            showFormMessage('❌ 提交失败，请稍后重试！', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

function showFormMessage(message, type) {
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // 3秒后自动隐藏
        setTimeout(() => {
            if (formMessage) formMessage.style.display = 'none';
        }, 3000);
    }
}

// 本地存储礼物
function saveGiftLocally(giftName) {
    const gifts = JSON.parse(localStorage.getItem('birthdayGifts') || '[]');
    const newGift = {
        id: Date.now(),
        name: giftName,
        timestamp: new Date().toISOString()
    };
    gifts.unshift(newGift);
    localStorage.setItem('birthdayGifts', JSON.stringify(gifts));
}

// 添加到历史记录显示
function addWishToHistory(giftName) {
    if (wishList) {
        const wishItem = document.createElement('div');
        wishItem.className = 'wish-item';
        wishItem.innerHTML = `🎁 ${giftName}`;
        wishList.insertBefore(wishItem, wishList.firstChild);
        
        // 限制显示最近5个
        if (wishList.children.length > 5) {
            wishList.removeChild(wishList.lastChild);
        }
    }
}

// 页面加载时显示历史记录
function loadWishHistory() {
    const gifts = JSON.parse(localStorage.getItem('birthdayGifts') || '[]');
    gifts.slice(0, 5).forEach(gift => {
        addWishToHistory(gift.name);
    });
}

// 礼物盒功能
function openGift() {
    const gift = document.querySelector('.gift');
    const giftText = document.querySelector('.gift-text');
    
    if (gift && !gift.classList.contains('open')) {
        gift.classList.add('open');
        if (giftText) giftText.textContent = '🎊 礼物已打开！祝你生日快乐！🎊';
        
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
    
    if (!birthdaySong) return;
    
    if (isPlaying) {
        birthdaySong.pause();
        if (musicBtn) musicBtn.innerHTML = '<i class="fas fa-music"></i> 播放音乐';
        isPlaying = false;
    } else {
        // 需要用户交互才能播放音频
        const playPromise = birthdaySong.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                if (musicBtn) musicBtn.innerHTML = '<i class="fas fa-pause"></i> 暂停音乐';
                isPlaying = true;
            }).catch(e => {
                console.log('自动播放被阻止，请点击页面任意位置后再试');
                document.body.addEventListener('click', () => {
                    birthdaySong.play();
                    if (musicBtn) musicBtn.innerHTML = '<i class="fas fa-pause"></i> 暂停音乐';
                    isPlaying = true;
                }, { once: true });
            });
        }
    }
}

// 管理员面板
function showAdminPanel() {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title">🎁 礼物愿望管理后台</div>
                <button class="close-btn" onclick="closeModal(this)">&times;</button>
            </div>
            <div class="admin-login">
                <h3>🔒 管理员登录</h3>
                <input type="password" id="adminPassword" placeholder="输入管理员密码">
                <button onclick="loginAdmin()">登录</button>
            </div>
            <div class="gift-records" id="giftRecords">
                <!-- 礼物记录将显示在这里 -->
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function closeModal(btn) {
    const modal = btn.closest('.modal');
    if (modal) modal.remove();
}

function loginAdmin() {
    const password = document.getElementById('adminPassword')?.value;
    const correctPassword = 'birthday2026'; // 修改为你自己的密码
    
    if (password === correctPassword) {
        showGiftRecords();
    } else {
        alert('❌ 密码错误！');
    }
}

function showGiftRecords() {
    const loginSection = document.querySelector('.admin-login');
    const recordsSection = document.getElementById('giftRecords');
    
    if (loginSection) loginSection.style.display = 'none';
    if (recordsSection) {
        recordsSection.style.display = 'block';
        loadGiftRecords();
    }
}

function loadGiftRecords() {
    const recordsSection = document.getElementById('giftRecords');
    if (!recordsSection) return;
    
    const gifts = JSON.parse(localStorage.getItem('birthdayGifts') || '[]');
    
    if (gifts.length === 0) {
        recordsSection.innerHTML = '<div class="no-records">📭 还没有人许愿哦~</div>';
        return;
    }
    
    let html = '<h3>🎁 收到的愿望清单</h3>';
    
    gifts.forEach((gift, index) => {
        const date = new Date(gift.timestamp);
        const formattedDate = date.toLocaleString('zh-CN');
        
        html += `
            <div class="record-item">
                <div class="gift-name">${index + 1}. ${gift.name}</div>
                <div class="timestamp">🕒 ${formattedDate}</div>
            </div>
        `;
    });
    
    recordsSection.innerHTML = html;
}

// 雪花效果
function createSnow() {
    const container = document.querySelector('.container');
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
        const snow = document.createElement('div');
        snow.className = 'snow';
        snow.style.left = Math.random() * 100 + 'vw';
        snow.style.animationDuration = Math.random() * 3 + 2 + 's';
        snow.style.opacity = Math.random();
        snow.style.width = Math.random() * 10 + 5 + 'px';
        snow.style.height = snow.style.width;
        snow.style.position = 'absolute';
        snow.style.top = '-20px';
        snow.style.backgroundColor = 'white';
        snow.style.borderRadius = '50%';
        snow.style.zIndex = '1';
        container.appendChild(snow);
    }
}

// 页面加载完成后执行
window.addEventListener('load', () => {
    createSnow();
    loadWishHistory();
    
    // 确保农历库已加载
    if (typeof chineseLunar === 'undefined') {
        console.warn('农历库加载失败，使用备用方案');
        // 可以在这里添加备用倒计时逻辑
    }
});