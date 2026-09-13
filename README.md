# 🛡️ SURAKSHA MESH (सुरक्षा मेश)
> **"Detect the Pattern. Protect the Child. Trigger the Right Intervention."**  
> *An explainable, privacy-first AI safety network protecting children and adolescents from digital threats across Indian languages.*

---

## 🌟 What is SURAKSHA MESH?

**SURAKSHA MESH** is a comprehensive, privacy-preserving AI safety framework designed to detect predatory grooming patterns, cyberbullying, sextortion, and online scams targeting children across India. 

Unlike traditional keyword-filtering tools that flag isolated words without context, SURAKSHA MESH analyzes multi-turn conversational trajectories, cross-platform behavioral progression, and multilingual Indic text/voice to provide early risk warnings, explainable indicators, and direct pathways to verified child-welfare authorities (such as **Childline 1098**, **1930 Cyber Helpline**, and **NCPCR e-BaalNidan**).

---

## 🚀 Key Features & Capabilities

1. **🗣️ Multilingual Indic Voice & Text Assistant**
   - Native voice-first interface powered by **Sarvam AI (Saaras / Bulbul)** and **Google Gemini AI**.
   - Supports major Indian languages: **Hindi (हिन्दी)**, **Marathi (मराठी)**, **Tamil (தமிழ்)**, **Telugu (తెలుగు)**, **Bengali (বাংলা)**, **Gujarati (ગુજરાતી)**, **Kannada (ಕನ್ನಡ)**, **Malayalam (മലയാളം)**, and **English**.
   - Real-time text-to-speech (TTS), speech-to-text (STT), and age-appropriate safety triage.

2. **💬 Multi-Turn Conversation Simulator & Grooming Progression Radar**
   - Analyzes grooming progression across 5 psychological phases (*Trust Building*, *Isolation*, *Boundary Testing*, *Coercion*, *Direct Exploitation*).
   - Dynamic real-time risk gauges (0–100%) with explainable evidence highlights.

3. **🖼️ Multilingual Screenshot Safety & OCR**
   - Ingests direct message screenshots from platforms like Instagram, Discord, WhatsApp, and Roblox.
   - Multilingual text extraction and visual threat analysis without storing raw personal imagery.

4. **📝 Zero-PII Anonymous Report Wizard**
   - 11-step structured reporting workflow with zero personal data leakage.
   - **UDISE+ School & Institution Directory** linking reports to official educational zones.
   - Generates encrypted Case Tracking Codes and automated legal mapping under the **POCSO Act 2012** and **IT Act 2000**.

5. **🗺️ SafeSchool Regional Heatmap & Threat Graph Visualizer**
   - Coarse-grain regional threat intensity mapping (Zero-PII coordinates).
   - 4-Tier Interactive Threat Graph correlating tactics, platforms, and risk clusters.

---

## 🏗️ System Architecture & Tech Stack

```
[ Frontend (React + Vite) ] 
       │ 
       ├──► [ FastAPI NLP & Triage Backend (Python) ]
       │         ├──► Sarvam AI (Indic STT / TTS Pipeline)
       │         ├──► Google Gemini Pro / Flash (Threat Intelligence)
       │         └──► Rule-Based Heuristic Safety Engine & Legal Matcher
       │
       └──► [ Supabase PostgreSQL DB ]
                 └──► Zero-PII Case Clusters & SafeSchool Metadata
```

- **Frontend**: React 18, Vite, Vanilla CSS Design System, Lucide React, Leaflet & React-Leaflet.
- **Backend**: FastAPI, Uvicorn, Python 3.10+, Pydantic, Scikit-learn.
- **AI & Speech**: Google Generative AI (`google-generativeai`), Sarvam AI REST APIs.
- **Database**: Supabase PostgreSQL with client-side zero-knowledge encryption.

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18 or newer) & npm
- Python (v3.10 or newer)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/PatriciaAlm25/surakshamesh.git
cd surakshamesh
```

### 2. Backend Setup
```bash
cd backend
# Create and activate virtual environment (optional but recommended)
python -m venv venv
venv\Scripts\activate   # On Windows
# source venv/bin/activate  # On macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment variables in backend/.env:
# GEMINI_API_KEY=your_gemini_api_key
# SARVAM_API_KEY=your_sarvam_api_key

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```
Backend API will be running at: `http://localhost:8000` (Swagger docs at `http://localhost:8000/docs`).

### 3. Frontend Setup
In a new terminal window:
```bash
cd my-app
npm install
npm run dev
```
Frontend Web Application will be live at: `http://localhost:5173`.

---

## ☁️ Cloud Deployment (Render)

### Deploy Backend (Web Service)
- **Environment**: Python 3
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**: Add `GEMINI_API_KEY`, `SARVAM_API_KEY`.

### Deploy Frontend (Static Site)
- **Root Directory**: `my-app`
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**: `VITE_API_BASE_URL` $\rightarrow$ set to your deployed backend URL (e.g. `https://surakshamesh-backend.onrender.com`).

---

## ⚖️ Legal & Privacy Compliance

- **Zero-PII Architecture**: Child identities, phone numbers, and exact residential GPS coordinates are never stored in databases.
- **Statutory Alignment**: Automated statutory mapping to Section 67B of the IT Act 2000, Section 11/12 of the POCSO Act 2012, and the Digital Personal Data Protection (DPDP) Act 2023.
- **Emergency Escalation**: Immediate one-click hotlinks to 1098 (Childline), 1930 (Cybercrime), and national mental health resources.

---

## 📄 License
This project is licensed under the MIT License. Developed for child welfare, online safety, and educational protection.
