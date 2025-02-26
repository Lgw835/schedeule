/**
 * 课程时间模拟器
 * 用于测试不同时间点的课程高亮效果
 * 默认隐藏，按下 Ctrl+Shift+T 显示
 */

// 保存原始的Date构造函数
const OriginalDate = Date;
let mockDate = null;

// 创建模拟时间控制面板
function createTimeSimulator() {
    // 创建模拟器容器
    const simulatorContainer = document.createElement('div');
    simulatorContainer.className = 'time-simulator';
    simulatorContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
        width: 300px;
        display: none; /* 默认隐藏 */
    `;

    // 创建标题和关闭按钮容器
    const headerContainer = document.createElement('div');
    headerContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        border-bottom: 1px solid #eee;
        padding-bottom: 8px;
    `;
    
    // 创建标题
    const title = document.createElement('h3');
    title.textContent = '时间模拟器';
    title.style.cssText = `
        margin: 0;
        font-size: 16px;
        color: #333;
    `;
    headerContainer.appendChild(title);
    
    // 创建关闭按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.cssText = `
        background: none;
        border: none;
        font-size: 20px;
        color: #999;
        cursor: pointer;
        padding: 0 5px;
    `;
    closeButton.onclick = () => {
        simulatorContainer.style.display = 'none';
    };
    headerContainer.appendChild(closeButton);
    
    simulatorContainer.appendChild(headerContainer);

    // 创建日期选择器
    const dateContainer = document.createElement('div');
    dateContainer.style.marginBottom = '10px';
    
    const dateLabel = document.createElement('label');
    dateLabel.textContent = '日期: ';
    dateLabel.style.display = 'block';
    dateLabel.style.marginBottom = '5px';
    dateContainer.appendChild(dateLabel);
    
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.id = 'mock-date';
    dateInput.style.cssText = `
        width: 100%;
        padding: 5px;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-bottom: 10px;
    `;
    // 设置默认日期为今天
    const today = new OriginalDate();
    dateInput.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    dateContainer.appendChild(dateInput);
    
    simulatorContainer.appendChild(dateContainer);

    // 创建时间选择器
    const timeContainer = document.createElement('div');
    timeContainer.style.marginBottom = '10px';
    
    const timeLabel = document.createElement('label');
    timeLabel.textContent = '时间: ';
    timeLabel.style.display = 'block';
    timeLabel.style.marginBottom = '5px';
    timeContainer.appendChild(timeLabel);
    
    const timeInput = document.createElement('input');
    timeInput.type = 'time';
    timeInput.id = 'mock-time';
    timeInput.style.cssText = `
        width: 100%;
        padding: 5px;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-bottom: 10px;
    `;
    // 设置默认时间为当前时间
    timeInput.value = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;
    timeContainer.appendChild(timeInput);
    
    simulatorContainer.appendChild(timeContainer);

    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between';
    
    // 应用按钮
    const applyButton = document.createElement('button');
    applyButton.textContent = '应用模拟时间';
    applyButton.style.cssText = `
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        flex: 1;
        margin-right: 5px;
    `;
    applyButton.onclick = applyMockTime;
    buttonContainer.appendChild(applyButton);
    
    // 重置按钮
    const resetButton = document.createElement('button');
    resetButton.textContent = '恢复真实时间';
    resetButton.style.cssText = `
        background-color: #f44336;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        flex: 1;
        margin-left: 5px;
    `;
    resetButton.onclick = resetToRealTime;
    buttonContainer.appendChild(resetButton);
    
    simulatorContainer.appendChild(buttonContainer);

    // 添加当前模拟状态显示
    const statusContainer = document.createElement('div');
    statusContainer.id = 'simulator-status';
    statusContainer.style.cssText = `
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid #eee;
        font-size: 12px;
        color: #666;
    `;
    statusContainer.textContent = '当前使用: 真实时间';
    simulatorContainer.appendChild(statusContainer);

    // 添加到页面
    document.body.appendChild(simulatorContainer);
    
    // 添加快捷键监听
    document.addEventListener('keydown', function(event) {
        // Ctrl+1 显示模拟器
        if (event.ctrlKey && event.key === '1') {
            simulatorContainer.style.display = simulatorContainer.style.display === 'none' ? 'block' : 'none';
            event.preventDefault();
        }
    });
    
    // 添加一个小提示，显示快捷键
    const tipElement = document.createElement('div');
    tipElement.style.cssText = `
        position: fixed;
        bottom: 5px;
        right: 5px;
        font-size: 10px;
        color: #aaa;
        padding: 3px;
        z-index: 999;
    `;
    tipElement.textContent = '按 Ctrl+1 显示/隐藏时间模拟器';
    document.body.appendChild(tipElement);
    
    // 5秒后隐藏提示
    setTimeout(() => {
        tipElement.style.display = 'none';
    }, 5000);
    
    return simulatorContainer;
}

// 应用模拟时间
function applyMockTime() {
    const dateInput = document.getElementById('mock-date');
    const timeInput = document.getElementById('mock-time');
    
    if (!dateInput || !timeInput) return;
    
    const dateValue = dateInput.value;
    const timeValue = timeInput.value;
    
    if (!dateValue || !timeValue) {
        alert('请选择有效的日期和时间');
        return;
    }
    
    // 解析日期和时间
    const [year, month, day] = dateValue.split('-').map(Number);
    const [hours, minutes] = timeValue.split(':').map(Number);
    
    // 创建模拟日期对象
    mockDate = new OriginalDate();
    mockDate.setFullYear(year);
    mockDate.setMonth(month - 1); // 月份从0开始
    mockDate.setDate(day);
    mockDate.setHours(hours);
    mockDate.setMinutes(minutes);
    mockDate.setSeconds(0);
    
    // 覆盖原生Date构造函数
    window.Date = function() {
        if (arguments.length === 0) {
            // 如果没有参数，返回模拟时间
            const clonedDate = new OriginalDate(mockDate.getTime());
            return clonedDate;
        }
        // 否则使用原始Date构造函数
        return new OriginalDate(...arguments);
    };
    
    // 复制原始Date的所有静态方法
    for (const prop in OriginalDate) {
        if (OriginalDate.hasOwnProperty(prop)) {
            window.Date[prop] = OriginalDate[prop];
        }
    }
    
    // 复制原型方法
    window.Date.prototype = OriginalDate.prototype;
    window.Date.prototype.constructor = window.Date;
    
    // 更新状态显示
    const statusElement = document.getElementById('simulator-status');
    if (statusElement) {
        const formattedDate = `${year}年${month}月${day}日 ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        statusElement.textContent = `当前使用: 模拟时间 (${formattedDate})`;
        statusElement.style.color = '#e91e63';
    }
    
    // 立即更新时间显示和课程高亮
    updateCurrentTime();
    highlightCurrentClass();
}

// 重置为真实时间
function resetToRealTime() {
    // 恢复原始Date构造函数
    window.Date = OriginalDate;
    mockDate = null;
    
    // 更新状态显示
    const statusElement = document.getElementById('simulator-status');
    if (statusElement) {
        statusElement.textContent = '当前使用: 真实时间';
        statusElement.style.color = '#666';
    }
    
    // 立即更新时间显示和课程高亮
    updateCurrentTime();
    highlightCurrentClass();
}

// 页面加载完成后初始化模拟器
document.addEventListener('DOMContentLoaded', () => {
    // 等待主脚本加载完成后再添加模拟器
    setTimeout(() => {
        createTimeSimulator();
    }, 1000);
}); 