let currentUser = 'user1';

async function switchUser(user) {
    currentUser = user;
    
    // 更新按钮状态
    document.querySelectorAll('.user-switch button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`btn-${user}`).classList.add('active');
    
    // 获取并更新课程表
    const response = await fetch(`/get_schedule/${user}`);
    const scheduleHtml = await response.text();
    document.querySelector('.schedule-container').innerHTML = scheduleHtml;
    
    // 重新初始化高亮功能
    highlightCurrentClass();
}

function updateCurrentTime() {
    const now = new Date();
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('currentTime').textContent = `${hours}:${minutes}:${seconds}`;
    document.getElementById('currentDay').textContent = days[now.getDay()];
}

function highlightCurrentClass() {
    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // 将当前时间转换为分钟数
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    // 定义课程时间段（以分钟表示）
    const timeSlots = [
        // 上午
        { start: '08:00', end: '08:45', section: 1 },
        { start: '08:50', end: '09:35', section: 2 },
        { start: '09:55', end: '10:40', section: 3 },
        { start: '10:45', end: '11:30', section: 4 },
        { start: '11:35', end: '12:20', section: 5 },
        // 下午
        { start: '13:15', end: '14:00', section: 6 },
        { start: '14:05', end: '14:50', section: 7 },
        { start: '15:05', end: '15:50', section: 8 },
        { start: '15:55', end: '16:40', section: 9 },
        // 晚上
        { start: '18:00', end: '18:45', section: 10 },
        { start: '18:50', end: '19:35', section: 11 },
        { start: '19:40', end: '20:25', section: 12 }
    ].map(slot => ({
        ...slot,
        startMinutes: parseInt(slot.start.split(':')[0]) * 60 + parseInt(slot.start.split(':')[1]),
        endMinutes: parseInt(slot.end.split(':')[0]) * 60 + parseInt(slot.end.split(':')[1])
    }));

    // 移除所有现有的高亮
    document.querySelectorAll('.course-cell.current').forEach(cell => {
        cell.classList.remove('current');
        cell.style.animation = '';
    });

    // 如果是周末，直接返回
    if (currentDay === 0 || currentDay === 6) {
        return;
    }

    // 获取所有课程单元格
    const courseCells = document.querySelectorAll('.course-cell');
    
    // 遍历所有课程单元格
    courseCells.forEach(cell => {
        const cellRow = cell.closest('tr');
        if (!cellRow) return;

        // 获取当前行的节次信息
        const sectionText = cellRow.querySelector('td:first-child').textContent;
        const sectionMatch = sectionText.match(/第(\d+)节/);
        if (!sectionMatch) return;

        const section = parseInt(sectionMatch[1]);
        
        // 获取单元格的列索引，第3列开始是周一到周日
        const cellIndex = Array.from(cellRow.children).indexOf(cell.parentElement);
        const cellDay = cellIndex - 2; // 第3列是周一(0)，第4列是周二(1)，以此类推

        // 获取课程的跨度
        const rowspan = parseInt(cell.parentElement.getAttribute('rowspan')) || 1;
        
        // 检查当前时间是否在课程时间范围内
        let courseStartSlot, courseEndSlot;
        
        // 根据section判断是上午还是下午的课程
        if (section > 9) { // 第10节及以后是晚上课程
            courseStartSlot = timeSlots.find(slot => slot.section === section);
            courseEndSlot = timeSlots.find(slot => slot.section === (section + rowspan - 1));
        } else if (section > 5) { // 第6-9节是下午课程
            courseStartSlot = timeSlots.find(slot => slot.section === section);
            courseEndSlot = timeSlots.find(slot => slot.section === (section + rowspan - 1));
        } else { // 第1-5节是上午课程
            courseStartSlot = timeSlots.find(slot => slot.section === section);
            courseEndSlot = timeSlots.find(slot => slot.section === (section + rowspan - 1));
        }
        
        if (courseStartSlot && courseEndSlot) {
            const courseStartTime = courseStartSlot.startMinutes - 5;
            const courseEndTime = courseEndSlot.endMinutes + 5;
            
            if (cellDay === currentDay - 1 && 
                currentTimeInMinutes >= courseStartTime && 
                currentTimeInMinutes <= courseEndTime) {
                
                cell.classList.add('current');
                cell.style.animation = 'none';
                cell.offsetHeight;
                cell.style.animation = 'pulse 2s infinite';
                cell.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

// 更新样式文件中的动画效果
const styleSheet = document.createElement('style');
styleSheet.textContent = `
@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(0, 102, 204, 0.4);
        transform: scale(1);
    }
    50% {
        box-shadow: 0 0 0 15px rgba(0, 102, 204, 0);
        transform: scale(1.02);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(0, 102, 204, 0);
        transform: scale(1);
    }
}

.course-cell.current {
    background-color: var(--apple-blue) !important;
    color: white !important;
    animation: pulse 2s infinite;
    box-shadow: 0 0 20px rgba(0, 102, 204, 0.3);
    z-index: 1;
}

.course-cell.current .course-location {
    color: rgba(255, 255, 255, 0.9) !important;
}
`;
document.head.appendChild(styleSheet);

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    switchUser('user1');
    updateCurrentTime();
    highlightCurrentClass();
    
    // 设置定时器
    setInterval(updateCurrentTime, 1000);
    setInterval(highlightCurrentClass, 30000); // 每30秒更新一次高亮状态
}); 