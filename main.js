/**
 * Classroom Dashboard Core Logic
 * Using Web Components for modularity and LocalStorage for persistence.
 */

// 1. Clock Component
class ClassClock extends HTMLElement {
    connectedCallback() {
        this.update();
        this.interval = setInterval(() => this.update(), 1000);
    }
    disconnectedCallback() {
        clearInterval(this.interval);
    }
    update() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('ko-KR', { 
            hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' 
        });
        const dateStr = now.toLocaleDateString('ko-KR', { 
            year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' 
        });
        
        this.innerHTML = `
            <div class='flex flex-col'>
                <span class='text-4xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400'>${timeStr}</span>
                <span class='text-sm text-slate-400 font-medium'>${dateStr}</span>
            </div>
        `;
    }
}
customElements.define('class-clock', ClassClock);

// 2. Weather Component (Simulated Gemini API Integration)
class ClassWeather extends HTMLElement {
    async connectedCallback() {
        this.innerHTML = '<div class="text-slate-500 animate-pulse text-sm">Gemini AI가 날씨 분석 중...</div>';
        await this.fetchWeather();
    }
    async fetchWeather() {
        // Simulating Gemini Flash 2.5 response
        setTimeout(() => {
            const mockData = {
                temp: 24,
                condition: '쾌청',
                dust: '좋음 (12µg/m³)',
                icon: '☀️',
                advice: '활동하기 좋은 날씨입니다.'
            };
            this.render(mockData);
        }, 2000);
    }
    render(data) {
        this.innerHTML = `
            <div class='flex items-center gap-4 text-right'>
                <div class='flex flex-col'>
                    <div class='flex items-center justify-end gap-2'>
                        <span class='text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold tracking-tighter'>GEMINI AI</span>
                        <span class='text-xl font-bold text-slate-200'>${data.condition} ${data.temp}°C</span>
                    </div>
                    <span class='text-xs text-slate-400'>${data.advice} | 미세먼지: <span class='text-green-400'>${data.dust}</span></span>
                </div>
                <span class='text-4xl filter drop-shadow-lg'>${data.icon}</span>
            </div>
        `;
    }
}
customElements.define('class-weather', ClassWeather);

// 3. Notice Board Component
class ClassNotice extends HTMLElement {
    connectedCallback() {
        const saved = localStorage.getItem('class-notice') || '';
        this.innerHTML = `
            <textarea 
                class='w-full h-full bg-transparent border-none outline-none resize-none text-lg leading-relaxed text-slate-300 placeholder-slate-600 font-light'
                placeholder='오늘의 알림 사항을 입력하세요...'
            >${saved}</textarea>
        `;
        const textarea = this.querySelector('textarea');
        textarea.addEventListener('input', (e) => {
            localStorage.setItem('class-notice', e.target.value);
        });
    }
}
customElements.define('class-notice', ClassNotice);

// 4. Traffic Light Component
class ClassTrafficLight extends HTMLElement {
    connectedCallback() {
        this.state = localStorage.getItem('class-traffic-state') || 'green';
        this.render();
    }
    setState(newState) {
        this.state = newState;
        localStorage.setItem('class-traffic-state', newState);
        this.render();
    }
    render() {
        const states = [
            { id: 'red', label: '정숙', color: 'bg-red-500', glow: 'glow-red' },
            { id: 'yellow', label: '집중', color: 'bg-yellow-500', glow: 'glow-yellow' },
            { id: 'green', label: '활동', color: 'bg-green-500', glow: 'glow-green' }
        ];

        this.innerHTML = `
            <div class='flex gap-8 items-center justify-around h-full'>
                ${states.map(s => `
                    <button 
                        onclick="this.closest('class-traffic-light').setState('${s.id}')"
                        class='flex flex-col items-center gap-3 group transition-transform active:scale-95'
                    >
                        <div class='w-14 h-14 rounded-full transition-all duration-500 ${this.state === s.id ? s.color + ' ' + s.glow + ' scale-110' : 'bg-slate-700 opacity-30 group-hover:opacity-50'}'></div>
                        <span class='text-xs font-black tracking-widest ${this.state === s.id ? 'text-slate-100' : 'text-slate-500'}'>${s.label}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }
}
customElements.define('class-traffic-light', ClassTrafficLight);

// 5. Timetable Component (With Edit Mode)
class ClassTimetable extends HTMLElement {
    constructor() {
        super();
        const defaultPeriods = [
            { id: 1, name: '1교시', start: '09:00', end: '09:40' },
            { id: 2, name: '2교시', start: '09:50', end: '10:30' },
            { id: 3, name: '3교시', start: '10:40', end: '11:20' },
            { id: 4, name: '4교시', start: '11:30', end: '12:10' },
            { id: 5, name: '점심시간', start: '12:10', end: '13:00' },
            { id: 6, name: '5교시', start: '13:00', end: '13:40' }
        ];
        this.periods = JSON.parse(localStorage.getItem('class-timetable')) || defaultPeriods;
        this.isEditing = false;
    }
    connectedCallback() {
        this.render();
        this.checkInterval = setInterval(() => this.checkAlarm(), 10000);
    }
    disconnectedCallback() {
        clearInterval(this.checkInterval);
    }
    toggleEdit() {
        this.isEditing = !this.isEditing;
        if (!this.isEditing) {
            localStorage.setItem('class-timetable', JSON.stringify(this.periods));
        }
        this.render();
    }
    updatePeriod(index, field, value) {
        this.periods[index][field] = value;
    }
    checkAlarm() {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        this.periods.forEach(p => {
            if (p.start === currentTime && !p.alarmed) {
                this.triggerAlarm(p);
                p.alarmed = true;
            }
        });
        this.render();
    }
    triggerAlarm(p) {
        const sound = document.getElementById('alarm-sound');
        if (sound) sound.play().catch(() => {});
        // Visual alarm
        document.body.classList.add('glow-blue');
        setTimeout(() => document.body.classList.remove('glow-blue'), 5000);
    }
    render() {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        this.innerHTML = `
            <div class='flex flex-col h-full'>
                <div class='flex justify-end mb-2'>
                    <button onclick='this.closest("class-timetable").toggleEdit()' class='text-[10px] px-3 py-1 rounded-full border border-slate-700 hover:bg-slate-700 transition-colors'>
                        ${this.isEditing ? '저장하기' : '일정 편집'}
                    </button>
                </div>
                <div class='flex-1 overflow-y-auto space-y-3 pr-2'>
                    ${this.periods.map((p, i) => {
                        const isActive = !this.isEditing && currentTime >= p.start && currentTime < p.end;
                        return `
                            <div class='flex items-center justify-between p-4 rounded-xl transition-all ${isActive ? 'bg-blue-600/30 border border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)] scale-[1.02]' : 'bg-slate-800/40 border border-white/5'}'>
                                <div class='flex items-center gap-4'>
                                    <span class='w-8 h-8 flex items-center justify-center rounded-lg ${isActive ? 'bg-blue-500' : 'bg-slate-700'} font-bold text-xs'>${p.id}</span>
                                    ${this.isEditing ? 
                                        `<input type='text' value='${p.name}' oninput='this.closest("class-timetable").updatePeriod(${i}, "name", this.value)' class='bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm w-24'>` :
                                        `<span class='font-bold text-lg ${isActive ? 'text-blue-200' : 'text-slate-300'}'>${p.name}</span>`
                                    }
                                </div>
                                <div class='flex items-center gap-2'>
                                    ${this.isEditing ? 
                                        `<div class='flex gap-1'>
                                            <input type='time' value='${p.start}' oninput='this.closest("class-timetable").updatePeriod(${i}, "start", this.value)' class='bg-slate-900 border border-slate-700 rounded px-1 text-xs'>
                                            <span class='text-slate-600'>~</span>
                                            <input type='time' value='${p.end}' oninput='this.closest("class-timetable").updatePeriod(${i}, "end", this.value)' class='bg-slate-900 border border-slate-700 rounded px-1 text-xs'>
                                        </div>` :
                                        `<div class='text-right'>
                                            <span class='block font-mono text-xl ${isActive ? 'text-blue-400' : 'text-slate-500'}'>${p.start} ~ ${p.end}</span>
                                            ${isActive ? "<span class='text-[10px] uppercase tracking-widest text-blue-400 font-bold animate-pulse'>수업 중</span>" : ''}
                                        </div>`
                                    }
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
}
customElements.define('class-timetable', ClassTimetable);