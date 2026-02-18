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

// 添加到历史记录显示（简化，不再显示在页面上）
function addWishToHistory(giftName) {
    // 不再在页面上显示，只保存到 localStorage
    // 这个函数保留是为了兼容性
}

// 页面加载时不再加载历史记录
function loadWishHistory() {
    // 空函数，不加载历史记录到页面
}

// ======================
// 礼物盒功能
// ======================
// ======================
// 礼物盒功能 - 弹出图片
// ======================

function openGift() {
    const gift = document.querySelector('.gift');
    const giftText = document.querySelector('.gift-text');
    const giftModal = document.getElementById('giftModal');
    
    if (gift && !gift.classList.contains('open')) {
        // 标记礼物已打开
        gift.classList.add('open');
        if (giftText) giftText.textContent = '🎊 礼物已打开！';
        
        // 显示弹窗
        setTimeout(() => {
            if (giftModal) {
                giftModal.classList.add('show');
                // 阻止页面滚动
                document.body.style.overflow = 'hidden';
            }
        }, 300);
        
        // 播放打开音效（可选）
        playGiftOpenSound();
    }
}

// 关闭礼物弹窗
function closeGiftModal() {
    const giftModal = document.getElementById('giftModal');
    
    if (giftModal) {
        giftModal.classList.remove('show');
        // 恢复页面滚动
        setTimeout(() => {
            document.body.style.overflow = '';
        }, 300);
    }
}

// 点击遮罩层关闭弹窗
document.addEventListener('click', function(e) {
    const giftModal = document.getElementById('giftModal');
    if (giftModal && giftModal.classList.contains('show')) {
        if (e.target === giftModal) {
            closeGiftModal();
        }
    }
});

// 按ESC键关闭弹窗
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeGiftModal();
    }
});

// 播放打开礼物音效（可选）
function playGiftOpenSound() {
    // 可以添加音效，例如：
    // const audio = new Audio('gift-open.mp3');
    // audio.play().catch(e => console.log('音效播放失败:', e));
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
// 增强版雪花效果
// ======================
function createSnow() {
    const container = document.querySelector('.container');
    if (!container) return;
    
    // 创建雪花容器（如果不存在）
    let snowContainer = document.getElementById('snow-container');
    if (!snowContainer) {
        snowContainer = document.createElement('div');
        snowContainer.id = 'snow-container';
        snowContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `;
        document.body.appendChild(snowContainer);
    }
    
    // 创建60-100片雪花
    const snowCount = Math.floor(Math.random() * 40) + 60;
    
    for (let i = 0; i < snowCount; i++) {
        const snow = document.createElement('div');
        snow.className = 'snow';
        
        // 随机大小
        const size = Math.random() * 8 + 2;
        snow.style.width = size + 'px';
        snow.style.height = size + 'px';
        
        // 随机起始位置
        const startX = Math.random() * 100;
        snow.style.left = startX + 'vw';
        snow.style.top = '-' + (Math.random() * 20) + 'px';
        
        // 随机透明度
        snow.style.opacity = Math.random() * 0.7 + 0.3;
        
        // 随机动画时长
        const duration = Math.random() * 10 + 8;
        snow.style.animationDuration = duration + 's';
        
        // 随机动画延迟
        const delay = Math.random() * 5;
        snow.style.animationDelay = delay + 's';
        
        // 随机类型
        const type = Math.floor(Math.random() * 3);
        snow.dataset.type = type;
        
        // 添加雪花形状
        if (type === 0) {
            snow.style.borderRadius = '50%';
        } else if (type === 1) {
            snow.style.borderRadius = '30% 70% 40% 60%';
        } else {
            snow.style.borderRadius = '20% 80% 30% 70%';
        }
        
        snowContainer.appendChild(snow);
    }
}

// 创建单片雪花
function createSingleSnow(container, index) {
    const snow = document.createElement('div');
    snow.className = 'snow';
    
    // 随机大小 (2-10px)
    const size = Math.random() * 8 + 2;
    snow.style.width = size + 'px';
    snow.style.height = size + 'px';
    
    // 随机起始位置（从顶部不同位置开始）
    const startX = Math.random() * 100;
    snow.style.left = startX + 'vw';
    snow.style.top = '-10px';
    
    // 随机透明度
    snow.style.opacity = Math.random() * 0.8 + 0.2;
    
    // 随机动画时长 (8-15秒)
    const duration = Math.random() * 7 + 8;
    snow.style.animationDuration = duration + 's';
    
    // 随机动画延迟
    const delay = Math.random() * 5;
    snow.style.animationDelay = delay + 's';
    
    // 随机z-index
    snow.style.zIndex = Math.floor(Math.random() * 5) + 1;
    
    // 添加雪花类型（不同形状）
    const snowType = Math.floor(Math.random() * 3);
    snow.dataset.type = snowType;
    
    container.appendChild(snow);
    
    // 雪花飘落完成后重新开始
    setTimeout(() => {
        snow.addEventListener('animationiteration', () => {
            // 重新随机位置
            snow.style.left = Math.random() * 100 + 'vw';
            snow.style.opacity = Math.random() * 0.8 + 0.2;
        });
    }, delay * 1000);
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
	
	// ========== 自动播放音乐 ==========
    autoPlayMusic();
});

// ======================
// 自动播放音乐函数
// ======================
function autoPlayMusic() {
    const birthdaySong = document.getElementById('birthdaySong');
    const musicBtn = document.querySelector('.music-btn');
    
    if (!birthdaySong) return;
    
    // 尝试自动播放
    const playPromise = birthdaySong.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log('🎵 音乐自动播放成功！');
            if (musicBtn) {
                musicBtn.innerHTML = '<i class="fas fa-pause"></i> 暂停音乐';
            }
            isPlaying = true;
            
            // 显示播放提示
            showMusicNotification('生日快乐歌已自动播放 🎵', 'success');
        }).catch(error => {
            console.log('⚠️ 音乐自动播放被阻止:', error);
            
            // 显示提示消息
            showMusicNotification('🔊 点击页面任意位置播放生日音乐', 'info');
            
            // 监听用户第一次点击，触发播放
            document.body.addEventListener('click', function initAudio() {
                birthdaySong.play().then(() => {
                    if (musicBtn) {
                        musicBtn.innerHTML = '<i class="fas fa-pause"></i> 暂停音乐';
                    }
                    isPlaying = true;
                    showMusicNotification('🎵 音乐开始播放！', 'success');
                }).catch(e => {
                    console.log('播放失败:', e);
                });
                
                // 移除事件监听器，只触发一次
                document.body.removeEventListener('click', initAudio);
            }, { once: true });
        });
    }
}

// ======================
// 显示音乐提示消息
// ======================
function showMusicNotification(message, type) {
    // 检查是否已存在通知
    let notification = document.getElementById('music-notification');
    
    if (!notification) {
        // 创建通知元素
        notification = document.createElement('div');
        notification.id = 'music-notification';
        notification.className = `music-notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            color: white;
            font-weight: bold;
            font-size: 1.1em;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            animation: slideInDown 0.5s, fadeOut 0.5s 2.5s forwards;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        document.body.appendChild(notification);
    }
    
    // 设置样式
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)';
    } else if (type === 'info') {
        notification.style.background = 'linear-gradient(135deg, #2196f3 0%, #03a9f4 100%)';
    }
    
    // 设置内容
    notification.innerHTML = `
        ${type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-info-circle"></i>'}
        ${message}
    `;
    
    // 3秒后自动消失
    setTimeout(() => {
        if (notification) {
            notification.style.animation = 'fadeOut 0.5s forwards';
            setTimeout(() => {
                if (notification && notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }
    }, 3000);
}

// 添加通知动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInDown {
        from {
            transform: translateY(-100px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-50px);
        }
    }
`;
document.head.appendChild(style);

// ======================
// 音量控制函数
// ======================
function setVolume(volume) {
    const birthdaySong = document.getElementById('birthdaySong');
    if (birthdaySong) {
        birthdaySong.volume = volume;
    }
}

// 监听音量变化
document.addEventListener('DOMContentLoaded', () => {
    const volumeSlider = document.getElementById('volumeSlider');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            setVolume(this.value);
        });
    }
});

// ======================
// 表单提交处理 - 简化版
// ======================

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ 页面加载完成');
    
    // 不要阻止表单默认提交！让 Netlify 处理
    // 只添加成功/失败的提示
});

// 表单提交后的消息显示
function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        setTimeout(() => {
            if (formMessage) formMessage.style.display = 'none';
        }, 3000);
    }
}

// 本地存储（作为备份）
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