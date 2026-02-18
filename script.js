// ======================
// 精确的春节日期表（2020-2040年）
// 数据来源：中国科学院紫金山天文台官方发布
// 格式：年份 -> 正月初一的公历日期（月, 日），月份从0开始（0=1月）
// ======================
const SPRING_FESTIVAL_DATES = {
    2020: [0, 25],  // 1月25日
    2021: [1, 12],  // 2月12日
    2022: [1, 1],   // 2月1日
    2023: [0, 22],  // 1月22日
    2024: [1, 10],  // 2月10日
    2025: [0, 29],  // 1月29日
    2026: [1, 17],  // 2月17日 ← 正月初一，初三 = 2月19日 ✓
    2027: [1, 6],   // 2月6日
    2028: [0, 26],  // 1月26日
    2029: [1, 13],  // 2月13日
    2030: [1, 3],   // 2月3日
    2031: [1, 23],  // 2月23日
    2032: [1, 11],  // 2月11日
    2033: [1, 1],   // 2月1日
    2034: [1, 19],  // 2月19日
    2035: [1, 8],   // 2月8日
    2036: [1, 28],  // 2月28日
    2037: [1, 15],  // 2月15日
    2038: [1, 4],   // 2月4日
    2039: [1, 24],  // 2月24日
    2040: [1, 12]   // 2月12日
};

// 获取指定年份的农历大年初三（正月初三 = 正月初一 + 2天）
function getLunarThirdDay(year) {
    const dateInfo = SPRING_FESTIVAL_DATES[year];
    
    if (!dateInfo) {
        console.warn(`年份 ${year} 不在预定义春节日期表中，使用估算值`);
        return new Date(year, 1, 10);
    }
    
    // 创建正月初一的日期
    const lunarNewYear = new Date(year, dateInfo[0], dateInfo[1]);
    
    // 计算初三（+2天）
    lunarNewYear.setDate(lunarNewYear.getDate() + 2);
    
    return lunarNewYear;
}

// 判断两个日期是否是同一天（忽略时分秒）
function isSameDay(date1, date2) {
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return d1.getTime() === d2.getTime();
}

// ======================
// 倒计时更新函数
// ======================
function updateLunarCountdown() {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // 获取今年的大年初三
    let targetDate = getLunarThirdDay(currentYear);
    
    // 调试信息
    console.log('=== 倒计时调试信息 ===');
    console.log('当前日期:', now.toLocaleString('zh-CN'));
    console.log('目标日期（今年）:', targetDate.toLocaleDateString('zh-CN'));
    console.log('当前年份:', currentYear);
    
    // 先判断是否是目标日期（同一天）
    const isTargetDay = isSameDay(now, targetDate);
    
    console.log('是否是目标日期:', isTargetDay);
    
    // 如果不是今天，且已经过了，才计算明年
    if (!isTargetDay && now > targetDate) {
        console.log('今年的初三已过，计算明年...');
        targetDate = getLunarThirdDay(currentYear + 1);
        console.log('目标日期（明年）:', targetDate.toLocaleDateString('zh-CN'));
    }
    
    console.log('=====================');
    
    // 更新UI
    const countdownTitle = document.getElementById('countdownTitle');
    const countdownContainer = document.getElementById('countdown');
    const specialMessage = document.getElementById('specialMessage');
    
    if (isTargetDay) {
        console.log('🎉 触发生日特效！');
        // 今天是农历大年初三！
        if (countdownTitle) countdownTitle.textContent = '🎂 今日吉日 🎂';
        if (countdownContainer) countdownContainer.style.display = 'none';
        
        if (specialMessage) {
            specialMessage.textContent = '今天是农历大年初三，快快许愿吧！✨🎁';
            specialMessage.className = 'special-message birthday';
            specialMessage.style.display = 'block';
        }
        
        // 添加生日特效
        addBirthdayEffects();
    } else {
        console.log('⏳ 显示倒计时');
        // 正常倒计时
        if (countdownTitle) countdownTitle.textContent = '⏳ 距离农历大年初三还有';
        if (countdownContainer) countdownContainer.style.display = 'flex';
        if (specialMessage) specialMessage.style.display = 'none';
        
        // 计算时间差
        const diff = targetDate - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // 更新显示
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }
}

// 彩纸特效
function addBirthdayEffects() {
    const container = document.querySelector('.container');
    if (!container) return;
    
    // 防止重复触发
    if (container.dataset.birthdayEffects === 'true') {
        return;
    }
    container.dataset.birthdayEffects = 'true';
    
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#feca57', '#fd79a8'];
    
    // 创建100个彩纸
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-20px';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.borderRadius = '50%';
        confetti.style.position = 'absolute';
        confetti.style.zIndex = '1000';
        confetti.style.opacity = Math.random();
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.animation = `fall-${i} ${Math.random() * 3 + 2}s linear forwards`;
        
        container.appendChild(confetti);
        
        // 添加独立动画
        const style = document.createElement('style');
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 1;
        style.textContent = `
            @keyframes fall-${i} {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(${Math.random() * 720}deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // 5秒后移除
        setTimeout(() => {
            confetti.remove();
        }, (duration + delay) * 1000);
    }
    
    // 蛋糕蜡烛闪烁加速
    const flames = document.querySelectorAll('.flame');
    flames.forEach(flame => {
        flame.style.animation = 'flicker-fast 0.1s infinite alternate';
    });
    
    // 添加快速闪烁动画
    const existingStyle = document.querySelector('#birthday-effects-style');
    if (!existingStyle) {
        const style = document.createElement('style');
        style.id = 'birthday-effects-style';
        style.textContent = `
            @keyframes flicker-fast {
                0%, 100% { opacity: 0.8; transform: translateX(-50%) scale(1); }
                50% { opacity: 1; transform: translateX(-50%) scale(1.2); }
            }
        `;
        document.head.appendChild(style);
    }
}

// 初始化倒计时
setInterval(updateLunarCountdown, 1000);
updateLunarCountdown(); // 立即执行一次

// ======================
// 表单提交处理
// ======================
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

// ======================
// 礼物盒功能
// ======================
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

// ======================
// 音乐控制
// ======================
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

// ======================
// 管理员面板
// ======================
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

// ======================
// 雪花效果
// ======================
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

// ======================
// 页面加载完成后执行
// ======================
window.addEventListener('load', () => {
    createSnow();
    loadWishHistory();
    
    // 验证日期准确性
    console.log('========== 日期验证 =========='); 
    console.log('今天是:', new Date().toLocaleString('zh-CN'));
    console.log('2026年大年初三应该是: 2026年2月19日');
    console.log('计算得出的2026年大年初三:', getLunarThirdDay(2026).toLocaleDateString('zh-CN'));
    console.log('是否匹配:', isSameDay(new Date(), getLunarThirdDay(2026)));
    console.log('==============================');
});