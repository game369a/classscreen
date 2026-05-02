# Classroom Dashboard Project Blueprint

## Overview
A comprehensive web-based dashboard designed for teachers to manage classroom activities efficiently. It integrates time management, weather information, notices, and behavioral signaling into a single, intuitive interface.

## Current Features & Design
- **Digital Clock**: Real-time 'HH:mm:ss' display.
- **Weather Info**: Simulated Gemini AI weather analysis.
- **Traffic Light**: 3-state classroom mood control.
- **Notice Board**: Persistent daily notes.
- **Timetable (V1)**: Period management with basic alarms.

## Implementation Plan (V2 Expansion)

### 1. Advanced Timetable (<class-timetable>)
- [ ] **Dynamic Management**: Buttons to add or remove periods.
- [ ] **Individual Alarm Control**: 
    - Toggle alarm ON/OFF per period.
    - Selection of alarm sounds (e.g., Bell, Chime, Digital).
- [ ] **Enhanced UI**: Improved edit mode to handle new controls.

### 2. Gemini AI Chatbot (<class-chatbot>)
- [ ] **AI Integration**: Use @google/generative-ai SDK.
- [ ] **UI/UX**: 
    - Floating chat button or dedicated sidebar card.
    - Message history display.
    - API Key management (LocalStorage for persistence).

### 3. Audio Assets
- [ ] Add multiple audio files for different alarm types.

### 4. Persistence
- [ ] Update LocalStorage schema to accommodate new timetable properties.
