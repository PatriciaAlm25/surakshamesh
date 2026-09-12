"""
SURAKSHA MESH - FastAPI AI Safety & Case Routing Engine
------------------------------------------------------
Provides RESTful APIs for:
1. Multilingual conversational risk analysis & grooming progression
2. OCR Screenshot extraction and threat classification
3. AI Case Translator (Story -> Structured Triage)
4. Anonymous reporting & Supabase CRUD bridge
5. SafeSchool aggregated threat heatmap data
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import datetime
import random
import re

app = FastAPI(
    title="SURAKSHA MESH AI Engine",
    description="Dedicated Safety Analysis Pipeline combining Multilingual NLP, Grooming Progression Radar, and Explainable Risk Engine.",
    version="2.0.0"
)

# Enable CORS for React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- DATA MODELS -----------------
class MessageItem(BaseModel):
    id: str
    sender: str  # 'child' or 'contact'
    text: str
    timestamp: str
    media_url: Optional[str] = None
    media_type: Optional[str] = None  # 'image', 'video', 'link'

class ConversationAnalysisRequest(BaseModel):
    messages: List[MessageItem]
    child_age: int = 13
    contact_name: str = "Unknown Contact"
    is_unknown_contact: bool = True

class RiskProgressionPoint(BaseModel):
    step: int
    sender: str
    text_snippet: str
    score: int
    level: str
    detected_flag: Optional[str] = None

class ConversationAnalysisResponse(BaseModel):
    overall_risk_score: int
    risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    category: str
    summary: str
    detected_indicators: List[str]
    progression_curve: List[RiskProgressionPoint]
    action_recommendations: List[str]
    under_14_protection_applied: bool

class CaseSubmissionRequest(BaseModel):
    raw_story: str
    category_hint: Optional[str] = "OTHER_CONCERN"
    child_age_bracket: str = "UNDER_14"
    platform: str = "Direct"
    language: str = "en"

class CaseTranslatorResponse(BaseModel):
    case_code: str
    category: str
    urgency_level: str
    risk_score: int
    detected_indicators: List[str]
    evidence_snippets: List[str]
    structured_summary: str
    recommended_action: str
    assigned_organization: str

# ----------------- HEURISTIC NLP & PATTERN ENGINE -----------------
SECRECY_PATTERNS = [
    r"(don'?t|do not) tell (your )?(parents|mom|dad|family|anyone)",
    r"keep this (a )?secret",
    r"our little secret",
    r"delete this chat",
    r"kisi ko mat batana",
    r"ghar walo ko mat batana",
    r"koiri sangtai naka",
    r"gupta theva"
]

GROOMING_FLATTERY = [
    r"mature for your age",
    r"you look so pretty",
    r"you can trust me",
    r"i understand you better than",
    r"special friend",
    r"tum bahut samajhdaar ho",
    r"tum mujhpe bharosa karo"
]

MEDIA_REQUESTS = [
    r"send (me )?(a )?(private |exclusive |cute )?(photo|picture|pic|video|snap|selfie)",
    r"show me (what you look like|your room|yourself)",
    r"webcam on karo",
    r"photo bhejo",
    r"tasveer pathva"
]

BULLYING_THREATS = [
    r"i will (leak|post|share|expose) your (photos|chats|secrets)",
    r"ruin your life",
    r"make everyone hate you",
    r"loser",
    r"kill yourself",
    r"sabko bata dunga",
    r"mar ja"
]

PHISHING_PATTERNS = [
    r"free (robux|v-bucks|diamonds|gems|coins)",
    r"click (this )?link",
    r"verify your account at",
    r"claim reward",
    r"http[s]?://",
    r"\.xyz|\.top|\.ru|\.gift"
]

def analyze_conversation_flow(messages: List[MessageItem], age: int) -> Dict[str, Any]:
    score = 10
    indicators = []
    progression = []
    
    for idx, msg in enumerate(messages):
        text_lower = msg.text.lower()
        step_flag = None
        step_delta = 0
        
        # Check Secrecy
        for pat in SECRECY_PATTERNS:
            if re.search(pat, text_lower):
                step_delta += 30
                step_flag = "Secrecy / Isolation Request"
                if "Secrecy Request" not in indicators:
                    indicators.append("Secrecy Request")
        
        # Check Flattery / Trust Building
        for pat in GROOMING_FLATTERY:
            if re.search(pat, text_lower):
                step_delta += 15
                step_flag = step_flag or "Trust Building / Flattery"
                if "Trust Exploitation" not in indicators:
                    indicators.append("Trust Exploitation")
                    
        # Check Private Media Request
        for pat in MEDIA_REQUESTS:
            if re.search(pat, text_lower):
                step_delta += 40
                step_flag = "Private Media Request"
                if "Private Media Solicitation" not in indicators:
                    indicators.append("Private Media Solicitation")
                    
        # Check Bullying / Threat
        for pat in BULLYING_THREATS:
            if re.search(pat, text_lower):
                step_delta += 45
                step_flag = "Threat / Blackmail"
                if "Extortion & Blackmail" not in indicators:
                    indicators.append("Extortion & Blackmail")
                    
        # Check Phishing
        for pat in PHISHING_PATTERNS:
            if re.search(pat, text_lower):
                step_delta += 25
                step_flag = "Suspicious Link / Phishing"
                if "Malicious Link Detection" not in indicators:
                    indicators.append("Malicious Link Detection")
                    
        # Media Flagging
        if msg.media_type in ['image', 'video'] and msg.sender != 'child':
            step_delta += 20
            step_flag = step_flag or "Unverified Incoming Media"
            if "Incoming Unverified Media" not in indicators:
                indicators.append("Incoming Unverified Media")
                
        score = min(100, max(10, score + step_delta))
        
        level = "LOW"
        if score >= 75:
            level = "CRITICAL" if score >= 90 else "HIGH"
        elif score >= 40:
            level = "MEDIUM"
            
        progression.append({
            "step": idx + 1,
            "sender": msg.sender,
            "text_snippet": msg.text[:40] + ("..." if len(msg.text) > 40 else ""),
            "score": score,
            "level": level,
            "detected_flag": step_flag
        })
        
    final_level = "LOW"
    if score >= 75:
        final_level = "CRITICAL" if score >= 90 else "HIGH"
    elif score >= 40:
        final_level = "MEDIUM"
        
    primary_category = "ONLINE_GROOMING" if "Secrecy Request" in indicators or "Private Media Solicitation" in indicators else ("CYBERBULLYING" if "Extortion & Blackmail" in indicators else "GENERAL_SAFETY")
    
    recommendations = []
    if final_level in ["HIGH", "CRITICAL"]:
        recommendations.extend([
            "🛑 Do not reply or send any photos/personal information.",
            "🔒 Tap Quick Block to prevent further communication.",
            "🛡️ Submit an Anonymous Report to trigger verified support.",
            "💬 Speak with a trusted adult, parent, or school counsellor."
        ])
    elif final_level == "MEDIUM":
        recommendations.extend([
            "⚠️ Be cautious about sharing personal life details.",
            "🔍 Remember that online contacts may misrepresent their identity.",
            "👀 Keep AI Protection active."
        ])
    else:
        recommendations.append("✅ Conversation appears within safe parameters. AI continuous monitoring active.")

    return {
        "overall_risk_score": score,
        "risk_level": final_level,
        "category": primary_category,
        "summary": f"Detected {len(indicators)} risk factor(s) with progressive escalation. Highest flag: {indicators[-1] if indicators else 'None'}.",
        "detected_indicators": indicators,
        "progression_curve": progression,
        "action_recommendations": recommendations,
        "under_14_protection_applied": age < 14
    }

# ----------------- REST ENDPOINTS -----------------
@app.get("/")
def read_root():
    return {
        "system": "SURAKSHA MESH AI Engine",
        "status": "ONLINE",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "modules": ["Grooming Radar", "Multilingual NLP", "AI Case Translator", "SafeSchool Heatmap"]
    }

class SimpleConversationRequest(BaseModel):
    messages: List[str]

@app.post("/api/analyze-conversation")
def analyze_conversation(req: SimpleConversationRequest):
    from ai_engine.conversation_risk import calculate_conversation_risk
    return calculate_conversation_risk(req.messages)

@app.post("/api/translate-case", response_model=CaseTranslatorResponse)
def translate_case(req: CaseSubmissionRequest):
    code = f"SM-2026-{random.randint(10000, 99999)}"
    text = req.raw_story
    
    indicators = []
    if re.search(r"secret|tell.*parents|ghar|kisi ko mat", text, re.I):
        indicators.append("Secrecy Demand")
    if re.search(r"photo|pic|camera|video|tasveer", text, re.I):
        indicators.append("Private Media Request")
    if re.search(r"leak|post|hate|threat|ruin|mar", text, re.I):
        indicators.append("Harassment / Extortion")
    if re.search(r"address|school|where do you live|location", text, re.I):
        indicators.append("Personal Info Solicitation")
    if not indicators:
        indicators.append("Uncomfortable Interaction")
        
    score = 45 + (len(indicators) * 15)
    score = min(98, score)
    
    urgency = "P1 - Immediate Intervention" if score >= 75 else ("P2 - Moderate Review" if score >= 50 else "P3 - Standard Advisory")
    
    category = "ONLINE_GROOMING" if "Secrecy Demand" in indicators or "Private Media Request" in indicators else ("CYBERBULLYING" if "Harassment / Extortion" in indicators else "PRIVACY_CONCERN")
    
    org = "Childline & Cyber Cell Unit" if score >= 80 else "School Mental Health & Counseling Cell"
    
    return {
        "case_code": code,
        "category": category,
        "urgency_level": urgency,
        "risk_score": score,
        "detected_indicators": indicators,
        "evidence_snippets": [s.strip() for s in text.split(".") if len(s.strip()) > 5][:3],
        "structured_summary": f"Child reported distress regarding {category.replace('_', ' ').lower()}. Natural testimony reveals {', '.join(indicators)}.",
        "recommended_action": "Initiate confidential counselling outreach and preserve anonymous digital footprint evidence.",
        "assigned_organization": org
    }

# ----------------- MULTILINGUAL VOICE ASSISTANT (SARVAM + GEMINI + SAFETY ENGINE) -----------------
from assistant_pipeline import UnifiedVoiceAssistantPipeline, SUPPORTED_INDIC_LANGUAGES

assistant_pipeline = UnifiedVoiceAssistantPipeline()

class AssistantChatRequest(BaseModel):
    message: str
    language_code: Optional[str] = "hi-IN"

@app.get("/api/assistant/languages")
def get_supported_languages():
    return {"languages": SUPPORTED_INDIC_LANGUAGES}

@app.post("/api/assistant/chat")
def assistant_chat(req: AssistantChatRequest):
    return assistant_pipeline.process_text_turn(req.message, language_code=req.language_code)

@app.post("/api/assistant/process-audio")
async def assistant_process_audio(
    audio_file: UploadFile = File(...),
    language_code: str = Form("hi-IN")
):
    audio_bytes = await audio_file.read()
    return assistant_pipeline.process_audio_turn(audio_bytes, language_code=language_code)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

