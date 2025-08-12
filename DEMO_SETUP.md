# 🎯 VS Code Demo Setup Guide

## 🚀 Quick Demo Setup (2 minutes)

### Step 1: Install Live Preview Extension
1. Press `Ctrl+Shift+X` (Extensions)
2. Search: `Live Preview`
3. Install the **Microsoft** official extension
4. Reload VS Code if prompted

### Step 2: Open Split-Screen Demo View

#### Option A: Using Live Preview (Recommended)
1. Press `Ctrl+Shift+P` (Command Palette)
2. Type: `Live Preview: Show Preview (External Browser)`
3. Enter URL: `http://localhost:3000`

#### Option B: Using Simple Browser (Built-in)
1. Press `Ctrl+Shift+P`
2. Type: `Simple Browser: Show`
3. Enter URL: `http://localhost:3000`

#### Option C: Using Demo Redirect File
1. Right-click `demo-redirect.html` in Explorer
2. Select "Open with Live Server" or "Open with Simple Browser"

### Step 3: Arrange Demo Layout

#### Perfect Demo Layout:
```
┌─────────────────┬─────────────────┐
│                 │                 │
│   Code Editor   │   Live Preview  │
│   (Left Side)   │   (Right Side)  │
│                 │                 │
│                 │                 │
├─────────────────┴─────────────────┤
│         Integrated Terminal       │
│    (Backend/Frontend Logs)        │
└───────────────────────────────────┘
```

## 🎨 Demo Flow Recommendations

### 1. Start with Architecture Overview
- Show `docs/03-design-document.md`
- Highlight the microservices architecture
- Explain the tech stack

### 2. Show the Running Application
- Switch to Live Preview panel
- Demonstrate the three risk scenarios:
  - 🟢 Low Risk: "Logging Service Warning"
  - 🟡 High Risk: "Production Database CPU Alert"  
  - 🔴 Critical Risk: "Payment System Critical Alert"

### 3. Show the Code Implementation
- `frontend/src/components/ImpactAnalysis.jsx` - React component
- `backend/src/demo-server.js` - API implementation
- `backend/src/services/impactAnalysisService.js` - Business logic

### 4. Highlight Key Features
- Real-time validation
- Professional Material-UI design
- Comprehensive error handling
- Test-driven development approach

## ⚡ Quick Commands for Demo

| Action | Command |
|--------|---------|
| Open Command Palette | `Ctrl+Shift+P` |
| Toggle Terminal | `Ctrl+`` |
| Split Editor Right | `Ctrl+\` |
| Focus Explorer | `Ctrl+Shift+E` |
| Quick File Open | `Ctrl+P` |
| Find in Files | `Ctrl+Shift+F` |

## 🔧 Troubleshooting

### If Live Preview doesn't work:
1. Use Simple Browser instead
2. Or open external browser manually: http://localhost:3000

### If services aren't running:
```bash
# Check backend
curl http://localhost:3001/health

# Restart if needed
cd backend && node src/demo-server.js &

# Check frontend
curl -I http://localhost:3000
```

## 🎯 Demo Script Highlights

1. **"This is a production-ready Parameter Risk Analysis application..."**
2. **"Built with modern React and Node.js, following TDD principles..."**
3. **"Let me show you the three risk scenarios we've implemented..."**
4. **"Notice the real-time validation and professional UI design..."**
5. **"The backend uses sophisticated algorithms to calculate customer impact..."**

---
**Ready for Demo! 🚀**
