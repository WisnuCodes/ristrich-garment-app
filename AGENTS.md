# AGENTS.md - Workspace Instructions & Anti-Slop Directive

> **Strict Quality Directive:** This workspace enforces **Zero AI Slop** using the combined power of:
> 1. **miqdadbadjuber/anti-slop** (`.agents/skills/antislop*`, `.agents/rules/antislop.md`)
> 2. **leonxlnx/taste-skill** (`.agents/skills/design-taste-frontend/`)

---

## 1. Anti-Slop Core Principles (`miqdadbadjuber/anti-slop`)

All agents, subagents, and tools working in this repository MUST strictly follow the anti-slop guidelines:

### A. Visual & UI Anti-Slop (Hard Gates)
- **NO Generic Gradients:** Avoid standard AI purple-to-blue or neon pastel mesh gradients. Use solid, restrained background colors (`#ffffff`, `#f9fbfc`, `#f0f2f4`).
- **NO Glowing Borders / Neon Halos:** Do not use `box-shadow: 0 0 25px rgba(...)` or glowing borders around cards.
- **NO Oversized Floating Pill Buttons:** Buttons must have crisp, intentional geometry (standard radii 6px-8px), not exaggerated 9999px pills with blurry drop shadows.
- **NO Decorative Filler Icons:** Every icon must serve a functional purpose; do not scatter random stars, sparkles, or generic rocket icons.
- **Zero Horizontal Overflow:** Mobile and desktop layouts must never overflow the viewport horizontally (`overflow-x: hidden`).

### B. Copywriting Anti-Slop
- **NO Generic AI Clichés:** Ban phrases like:
  - *"In today's fast-paced digital world..."*
  - *"Seamlessly streamline your workflow..."*
  - *"Unlock the power of next-generation..."*
  - *"Empowering communities with cutting-edge AI..."*
- **Use Real Indonesian Municipal Domain Copy:** Use authentic, professional terminology:
  - *"Sistem Pengelolaan Sampah Terpadu"*
  - *"Laporan Timbulan Sampah Liar"*
  - *"Petugas Lapangan Dinas Lingkungan Hidup"*
  - *"Estimasi Berat (Kg)", "Koordinat GPS", "Kategori Sampah"*

### C. Code & Comment Hygiene
- **NO Robotic Explanatory Comments:** Do NOT write comments explaining the obvious (e.g. `// render button`, `// handle click function`, `// import react`).
- **Preserve Documentation Integrity:** Maintain existing functional comments, docblocks, and type hints that explain *why* or describe architectural contracts.

---

## 2. Taste Skill "Framed Sheet" Architecture (`leonxlnx/taste-skill`)

The frontend application (`waste-fe`) is built strictly on the **Framed Sheet Shell** design pattern:
- **Ground Frame:** `#f9fbfc` fills the entire viewport (`100vw`, `100vh`, `overflow: hidden`).
- **Top Bar:** Fixed 48px height (`Navbar.jsx`), no border separating it from the frame.
- **Sidebar Rail:** 228px width (`Sidebar.jsx`), flush against the tinted frame ground.
- **Work Sheet:** An inset white card (`#ffffff`, `border: 1px solid #e8eaec`, `border-radius: 16px`, inset 8px from right and bottom) with internal `overflow-y: auto`.
- **Typography:**
  - Primary UI & Headings: `IBM Plex Sans`, `-apple-system`, `sans-serif`.
  - Tabular & Data (numbers, counts, dates, weights, coordinates): `IBM Plex Mono` with `font-variant-numeric: tabular-nums`.

---

## 3. Technology Stack & Directory Architecture

```text
waste-app/
├── .agents/
│   ├── rules/antislop.md           # Master Anti-Slop Rules
│   ├── skills/
│   │   ├── antislop/               # Core filter & delivery gate
│   │   ├── antislop-ui/            # UI layout & contrast
│   │   ├── antislop-copywriting/   # High-signal copy
│   │   ├── antislop-human/         # A11y & interaction states
│   │   ├── antislop-layoutmobile/  # Mobile responsiveness
│   │   ├── antislop-code/          # Clean code & comments
│   │   └── design-taste-frontend/  # Framed Sheet & Taste Skill
│   └── antislop.md
├── waste-be/                       # Laravel 12 + Sanctum + MySQL (3306)
│   ├── app/Http/Controllers/Api/   # Auth, Dashboard, WasteReport, Category, User, File
│   ├── app/Http/Requests/          # Form Validation Requests
│   ├── app/Http/Resources/         # API Resource Transformers
│   ├── app/Traits/                 # ApiResponseTrait, FileUploadTrait
│   └── app/Http/Middleware/        # CheckRole.php ('role:admin')
├── waste-fe/                       # React 19 + Vite + Material UI (Port 5173)
│   └── src/
│       ├── api/axios.js            # Axios with Bearer token interceptor
│       ├── components/
│       │   ├── atoms/              # Button, Input, Select, StatusChip, Spinner
│       │   ├── molecules/          # StatCard, SearchFilterBar, StatusTimeline
│       │   ├── organisms/          # Navbar (48px), Sidebar (228px), ReportTable, Charts
│       │   └── templates/          # MainLayout (Framed Sheet), AuthLayout
│       └── pages/                  # Dashboard, Reports, Users, Profile, Login
└── waste-ml/                       # FastAPI Waste Classifier (Port 5000)
    ├── api.py                      # REST API (POST /predict)
    ├── model.py                    # MobileNetV3 + Feature Fallback Classifier
    └── requirements.txt            # FastAPI, Uvicorn, Pillow, NumPy
├── waste-mobile/                   # React Native (Expo) Mobile App
    ├── assets/                     # App icon & splash
    ├── src/
    │   ├── constants/              # config.js, theme.js (Anti-Slop), categories.js
    │   ├── services/               # api.js (Sanctum), aiService.js (FastAPI)
    │   ├── context/                # AuthContext.js
    │   ├── components/             # Header, Button, Input, StatusChip, StatCard, AIDetectionCard
    │   ├── screens/                # Login, Register, Dashboard, CreateReport, ReportsList, ReportDetail, Profile
    │   └── navigation/             # AppNavigator.js
    ├── App.js                      # Root Component
    └── package.json
```

---

## 4. Operational Execution Commands

- **Backend (Laravel):**
  `cd waste-be; php artisan serve --port=8000`
- **Frontend (React Vite):**
  `cd waste-fe; npm run dev` (Runs on `http://localhost:5173`)
- **Machine Learning (FastAPI):**
  `cd waste-ml; python -m uvicorn api:app --host 127.0.0.1 --port 5000 --reload`
- **Mobile App (React Native Expo):**
  `cd waste-mobile; npm start` (atau `npm run web` / `npm run android`)

