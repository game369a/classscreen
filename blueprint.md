# Classroom Dashboard Project Blueprint

## Overview
A comprehensive web-based dashboard designed for teachers to manage classroom activities efficiently. It integrates time management, weather information, notices, and behavioral signaling into a single, intuitive interface.

## Current Features & Design
- **Base Structure**: Initial boilerplate set up with `index.html`, `main.js`, and `style.css`.
- **Styling**: Tailwind CSS will be used for rapid UI development.
- **Components**: Web Components (Custom Elements) will be used for modularity.

## Implementation Plan

### 1. Layout & Theme
- [ ] Set up Tailwind CSS CDN and basic dark-themed layout.
- [ ] Create a responsive grid: 
    - Top: Header with Clock & Weather.
    - Left (60%): Timetable & Traffic Light.
    - Right (40%): Notice Board.

### 2. Components
- [ ] **Digital Clock (`<class-clock>`)**: Real-time 'HH:mm:ss' display.
- [ ] **Weather Info (`<class-weather>`)**: Fetch and display weather/fine dust (simulated via API logic).
- [ ] **Smart Timetable (`<class-timetable>`)**: 
    - List of periods with start times.
    - Current period highlighting.
    - Alarm notification logic.
- [ ] **Notice Board (`<class-notice>`)**: 
    - Text area for daily notes.
    - Auto-save to LocalStorage.
- [ ] **Traffic Light (`<class-traffic-light>`)**: 
    - 3-state control (Red, Yellow, Green).
    - Visual feedback for students.

### 3. Data & Persistence
- [ ] Centralized LocalStorage manager for saving timetable, notices, and traffic light state.
- [ ] Audio alert for the timetable alarm.

### 4. Visual Polish
- [ ] Dark mode/Pastel palette optimization.
- [ ] Interactive "glow" effects and smooth transitions.
- [ ] Mobile responsive adjustments.
