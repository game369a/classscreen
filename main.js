import { GoogleGenerativeAI } from 'https://esm.run/@google/generative-ai';

/**
 * Classroom Dashboard Core Logic V2.2 (Env Support)
 * Hardcoded API Key for Seamless User Experience
 */

const DEFAULT_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// 1. Clock Component
class ClassClock extends HTMLElement {
    connectedCallback() {
        this.update();
        this.interval = setInterval(() => this.update(), 1000);
    }
    disconnectedCallback() { clearInterval(this.interval); }
    update() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const dateStr = now.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
        this.innerHTML = `
            <div class='flex flex-col'>
                <span class='text-4xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400'>${timeStr}</span>
                <span class='text-sm text-slate-400 font-medium'>${dateStr}</span>
            </div>`;
    }
}
customElements.define('class-clock', ClassClock);

// 2. Weather Component
class ClassWeather extends HTMLElement {
    async connectedCallback() {
        this.innerHTML = '<div class="text-slate-500 animate-pulse text-sm">날씨 분석 중...</div>';
        setTimeout(() => this.render({ temp: 24, condition: '쾌청', dust: '좋음', icon: '☀️', advice: '활동하기 좋은 날씨입니다.' }), 1500);
    }
    render(data) {
        this.innerHTML = `
            <div class='flex items-center gap-4 text-right'>
                <div class='flex flex-col'>
                    <div class='flex items-center justify-end gap-2'>
                        <span class='text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold'>AI</span>
                        <span class='text-xl font-bold text-slate-200'>${data.condition} ${data.temp}°C</span>
                    </div>
                    <span class='text-xs text-slate-400'>${data.advice}</span>
                </div>
                <span class='text-4xl'>${data.icon}</span>
            </div>`;
    }
}
customElements.define('class-weather', ClassWeather);

// 3. Notice Component
class ClassNotice extends HTMLElement {
    connectedCallback() {
        const saved = localStorage.getItem('class-notice') || '';
        this.innerHTML = `<textarea class='w-full h-full bg-transparent border-none outline-none resize-none text-lg text-slate-300' placeholder='알림 사항 입력...'>${saved}</textarea>`;
        this.querySelector('textarea').addEventListener('input', (e) => localStorage.setItem('class-notice', e.target.value));
    }
}
customElements.define('class-notice', ClassNotice);

// 4. Traffic Light Component
class ClassTrafficLight extends HTMLElement {
    connectedCallback() {
        this.state = localStorage.getItem('class-traffic-state') || 'green';
        this.render();
    }
    setState(s) { this.state = s; localStorage.setItem('class-traffic-state', s); this.render(); }
    render() {
        const states = [{id:'red',l:'정숙',c:'bg-red-500'}, {id:'yellow',l:'집중',c:'bg-yellow-500'}, {id:'green',l:'활동',c:'bg-green-500'}];
        this.innerHTML = `<div class='flex gap-8 justify-around'>${states.map(s => `
            <button onclick='this.closest("class-traffic-light").setState("${s.id}")' class='flex flex-col items-center gap-2'>
                <div class='w-12 h-12 rounded-full transition-all ${this.state===s.id?s.c+" shadow-lg scale-110":"bg-slate-700 opacity-30"}'></div>
                <span class='text-xs font-bold ${this.state===s.id?"text-white":"text-slate-500"}'>${s.l}</span>
            </button>`).join('')}</div>`;
    }
}
customElements.define('class-traffic-light', ClassTrafficLight);

// 5. Advanced Timetable Component
class ClassTimetable extends HTMLElement {
    constructor() {
        super();
        const def = [{id:1,name:'1교시',start:'09:00',end:'09:40',alarm:true,sound:'bell'}];
        this.periods = JSON.parse(localStorage.getItem('class-timetable')) || def;
        this.isEditing = false;
    }
    connectedCallback() { this.render(); this.timer = setInterval(() => this.check(), 10000); }
    disconnectedCallback() { clearInterval(this.timer); }
    toggleEdit() { this.isEditing = !this.isEditing; if(!this.isEditing) localStorage.setItem('class-timetable', JSON.stringify(this.periods)); this.render(); }
    add() { this.periods.push({id:this.periods.length+1,name:'새 교시',start:'00:00',end:'00:00',alarm:true,sound:'bell'}); this.render(); }
    remove(i) { this.periods.splice(i,1); this.render(); }
    update(i,f,v) { this.periods[i][f] = v; }
    check() {
        const now = new Date();
        const cur = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        this.periods.forEach(p => {
            if(p.start === cur && p.alarm && !p.ringed) {
                const s = document.getElementById('alarm-'+p.sound);
                if(s) s.play().catch(()=>{});
                p.ringed = true;
                alert('🔔 ['+p.name+'] 시작 시간입니다!');
            }
        });
        this.render();
    }
    render() {
        const now = new Date();
        const cur = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        this.innerHTML = `
            <div class='flex flex-col h-full'>
                <div class='flex justify-end gap-2 mb-2'>
                    ${this.isEditing ? `<button onclick='this.closest("class-timetable").add()' class='text-xs px-2 py-1 bg-blue-600 rounded'>추가</button>` : ''}
                    <button onclick='this.closest("class-timetable").toggleEdit()' class='text-xs px-2 py-1 bg-slate-700 rounded'>${this.isEditing?'저장':'편집'}</button>
                </div>
                <div class='flex-1 overflow-y-auto space-y-2 pr-1'>
                    ${this.periods.map((p,i) => {
                        const act = !this.isEditing && cur >= p.start && cur < p.end;
                        return `
                        <div class='flex items-center gap-3 p-3 rounded-lg ${act?"bg-blue-600/30 border border-blue-500/50":"bg-slate-800/40 border border-white/5"}'>
                            <span class='text-xs font-bold text-slate-500'>${i+1}</span>
                            ${this.isEditing ? 
                                `<input type='text' value='${p.name}' oninput='this.closest("class-timetable").update(${i},"name",this.value)' class='bg-slate-900 text-xs p-1 rounded w-20'>
                                 <input type='time' value='${p.start}' oninput='this.closest("class-timetable").update(${i},"start",this.value)' class='bg-slate-900 text-xs p-1 rounded'>
                                 <input type='time' value='${p.end}' oninput='this.closest("class-timetable").update(${i},"end",this.value)' class='bg-slate-900 text-xs p-1 rounded'>
                                 <div class='flex flex-col gap-1'>
                                    <label class='text-[8px] flex items-center gap-1'><input type='checkbox' ${p.alarm?"checked":""} onchange='this.closest("class-timetable").update(${i},"alarm",this.checked)'> 알람</label>
                                    <select onchange='this.closest("class-timetable").update(${i},"sound",this.value)' class='bg-slate-900 text-[8px] p-0.5 rounded'>
                                        <option value='bell' ${p.sound==='bell'?"selected":""}>벨</option>
                                        <option value='chime' ${p.sound==='chime'?"selected":""}>차임</option>
                                        <option value='digital' ${p.sound==='digital'?"selected":""}>디지털</option>
                                    </select>
                                 </div>
                                 <button onclick='this.closest("class-timetable").remove(${i})' class='text-red-500 text-xs'>&times;</button>` :
                                `<span class='flex-1 font-bold ${act?"text-blue-200":"text-slate-300"}'>${p.name}</span>
                                 <span class='font-mono text-sm ${act?"text-blue-400":"text-slate-500"}'>${p.start} ~ ${p.end}</span>
                                 ${p.alarm ? "<span class='text-[10px]'>🔔</span>" : ""}`
                            }
                        </div>`;
                    }).join('')}
                </div>
            </div>`;
    }
}
customElements.define('class-timetable', ClassTimetable);

// 6. Gemini Chatbot Component (Simplified for User Experience)
class ClassChatbot extends HTMLElement {
    constructor() {
        super();
        this.history = [];
        this.apiKey = DEFAULT_API_KEY;
    }
    connectedCallback() { this.render(); }
    async send() {
        const input = this.querySelector('input');
        const text = input.value.trim();
        if(!text) return;

        this.history.push({ role: 'user', text });
        input.value = '';
        this.render();

        try {
            const genAI = new GoogleGenerativeAI(this.apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent(text);
            const response = await result.response;
            this.history.push({ role: 'model', text: response.text() });
        } catch (e) {
            this.history.push({ role: 'error', text: '오류 발생: ' + e.message });
        }
        this.render();
    }
    render() {
        this.innerHTML = `
            <div class='flex flex-col h-full gap-2'>
                <div class='flex-1 overflow-y-auto space-y-2 p-2 bg-black/20 rounded-xl' id='chat-box'>
                    ${this.history.length === 0 ? 
                        "<div class='h-full flex items-center justify-center text-slate-500 text-[10px]'>제미나이 AI와 대화를 시작해보세요.</div>" :
                        this.history.map(m => `
                            <div class='p-2 rounded-lg text-xs ${m.role==='user'?"bg-purple-600/20 ml-4 text-right":"bg-slate-700/50 mr-4 text-left"}'>
                                <p class='opacity-50 text-[8px] mb-1'>${m.role==='user'?'나':'제미나이'}</p>
                                <p class='whitespace-pre-wrap'>${m.text}</p>
                            </div>`).join('')
                    }
                </div>
                <div class='flex gap-2'>
                    <input type='text' placeholder='무엇이든 물어보세요...' class='flex-1 bg-slate-900 p-2 rounded text-xs' onkeypress='if(event.key==="Enter") this.closest("class-chatbot").send()'>
                    <button onclick='this.closest("class-chatbot").send()' class='px-3 bg-purple-600 rounded text-xs'>송신</button>
                </div>
            </div>`;
        const box = this.querySelector('#chat-box');
        if(box) box.scrollTop = box.scrollHeight;
    }
}
customElements.define('class-chatbot', ClassChatbot);