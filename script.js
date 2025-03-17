document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const workdaysOnlyCheckbox = document.getElementById('workdaysOnly');
    const excludeHolidaysCheckbox = document.getElementById('excludeHolidays');
    const holidaysSection = document.getElementById('holidaysSection');
    const holidaysTextarea = document.getElementById('holidays');
    const calculateButton = document.getElementById('calculate');
    const totalDaysSpan = document.getElementById('totalDays');
    const workDaysSpan = document.getElementById('workDays');
    const workdayResultDiv = document.getElementById('workdayResult');
    
    // 设置默认日期
    const today = new Date();
    const formattedDate = formatDate(today);
    startDateInput.value = formattedDate;
    endDateInput.value = formattedDate;
    
    // 事件监听
    excludeHolidaysCheckbox.addEventListener('change', function() {
        holidaysSection.classList.toggle('hidden', !this.checked);
    });
    
    workdaysOnlyCheckbox.addEventListener('change', function() {
        workdayResultDiv.classList.toggle('hidden', !this.checked);
    });
    
    calculateButton.addEventListener('click', calculateDateDifference);
    
    // 计算日期差异
    function calculateDateDifference() {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);
        
        // 验证输入
        if (!startDateInput.value || !endDateInput.value) {
            alert('请选择开始和结束日期');
            return;
        }
        
        if (startDate > endDate) {
            alert('开始日期不能晚于结束日期');
            return;
        }
        
        // 计算总天数（包括开始和结束日）
        const totalDays = calculateDaysBetween(startDate, endDate) + 1;
        totalDaysSpan.textContent = totalDays + ' 天';
        
        // 如果选择只计算工作日
        if (workdaysOnlyCheckbox.checked) {
            let workDays = 0;
            let holidays = [];
            
            // 处理节假日
            if (excludeHolidaysCheckbox.checked) {
                holidays = parseHolidays();
            }
            
            // 计算工作日
            const currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                const dayOfWeek = currentDate.getDay();
                const dateString = formatDate(currentDate);
                
                // 检查是否是周一至周五(0是周日，1-5是周一至周五，6是周六)
                if (dayOfWeek > 0 && dayOfWeek < 6) {
                    // 检查是否不是节假日
                    if (!holidays.includes(dateString)) {
                        workDays++;
                    }
                }
                
                // 移动到下一天
                currentDate.setDate(currentDate.getDate() + 1);
            }
            
            workDaysSpan.textContent = workDays + ' 天';
            workdayResultDiv.classList.remove('hidden');
        } else {
            workdayResultDiv.classList.add('hidden');
        }
    }
    
    // 解析节假日输入
    function parseHolidays() {
        if (!holidaysTextarea.value.trim()) {
            return [];
        }
        
        return holidaysTextarea.value
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && /^\d{4}-\d{2}-\d{2}$/.test(line));
    }
    
    // 计算两个日期之间的天数（不包括结束日期）
    function calculateDaysBetween(startDate, endDate) {
        const oneDayMs = 24 * 60 * 60 * 1000; // 一天的毫秒数
        const startMs = startDate.getTime();
        const endMs = endDate.getTime();
        
        return Math.floor((endMs - startMs) / oneDayMs);
    }
    
    // 格式化日期为YYYY-MM-DD
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }
}); 