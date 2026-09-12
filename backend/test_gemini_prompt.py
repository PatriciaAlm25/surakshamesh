"""
SURAKSHA MESH - Invisible SOS Gemini AI Case Triage & Safety Graph Engine
--------------------------------------------------------------------------
Takes full 10-step anonymous report input and outputs:
1. Clinical Child-Protection Triage (Urgency, Risk Score, Childline Assignment)
2. Safety Graph Nodes:
   - Cluster (WHAT type of threat?)
   - Tactic/Pattern (HOW was the threat carried out?)
   - Case (WHICH incident/report?)
   - Platform (WHERE did it happen?)
"""

import os
import re
import json
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

load_dotenv()

CANDIDATE_MODELS = [
    "gemini-3.7-flash",
    "gemini-3.5-flash",
    "gemini-flash-lite-latest",
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash-lite",
    "gemini-flash-latest"
]

def triage_invisible_sos(report_payload: Dict[str, Any]) -> Dict[str, Any]:
    api_key = os.getenv("GEMINI_API_KEY", "")
    
    system_prompt = """You are the Suraksha Mesh AI Safety & Forensic Triage Engine for Child Protection in India.
Your mission is to analyze anonymous testimonies submitted through the "Invisible SOS" reporting system.

Analyze the user's input across all dimensions:
- Environment (Online vs Offline)
- Selected Problem Category
- Modus Operandi & Behavioral Tactics
- Platform / Physical Facility and specific sub-location
- Geographic Jurisdiction (City, District, State)
- Demographic Context (Age, School/College/Workplace, Relationship)
- Raw Testimony in the child's own words (English, Hindi, Marathi, Hinglish, etc.)
- Evidence presence, Frequency, and Immediate Danger status

MANDATORY RULES:
1. STRICT ANONYMITY: Do not ask for or output exact home addresses, phone numbers, or passwords.
2. EXTRACT 4 CORE SAFETY GRAPH NODES:
   - Cluster: WHAT type of threat? (Online Grooming, Cyberbullying, Coercive Sextortion, Phishing, Physical Abuse, etc.)
   - Tactic/Pattern: HOW was the threat carried out? (Secrecy, Manipulation, Photo request, Fake link, Threats, Isolation, etc.)
   - Case: WHICH incident/report? (Code like SM-2026-XXXXX)
   - Platform: WHERE did it happen? (Instagram, Roblox, WhatsApp, Discord, School, Hostel, etc.)
3. ASSIGN URGENCY & JURISDICTION:
   - Urgency: P1 - Immediate Intervention / P2 - Moderate Review / P3 - Standard Advisory
   - Organization: e.g., Special Juvenile Police Unit, Childline 1098, School Counselor Cell, Cyber Crime 1930.

Format your output as a single valid JSON object strictly matching this schema:
{
  "case_code": "SM-2026-XXXXX",
  "urgency_level": "P1 - Immediate Intervention | P2 - Moderate Review | P3 - Standard Advisory",
  "risk_score": 85,
  "risk_level": "LOW | MEDIUM | HIGH | CRITICAL",
  "primary_threat_cluster": "ONLINE_GROOMING | CYBERBULLYING | SEXTORTION | ABUSE | OTHER",
  "assigned_organization": "Name of assigned authority / NGO",
  "recommended_actions": ["Action 1", "Action 2"],
  "safety_graph_nodes": {
    "cluster": {
      "name": "Threat category name",
      "type": "THREAT_CATEGORY",
      "severity": "CRITICAL | HIGH | MEDIUM | LOW"
    },
    "tactics": ["Tactic 1", "Tactic 2"],
    "case": "SM-2026-XXXXX",
    "platform": {
      "name": "Platform name",
      "sub_surface": "Direct Message / Group Chat / Classroom",
      "vector": "DIGITAL_SOCIAL | PHYSICAL_SPACE"
    },
    "location_jurisdiction": {
      "city": "City name",
      "district": "District name",
      "state": "State name",
      "institution": "School/College name if provided"
    }
  },
  "case_structured_summary": {
    "headline": "Short 1-sentence forensic summary",
    "child_friendly_reassurance": "Empathetic reassurance in the child's language",
    "statutory_violation_flags": ["POCSO Act / IT Act section flags if applicable"]
  }
}
"""

    case_code = report_payload.get("case_code", f"SM-2026-{os.urandom(2).hex().upper()}")
    full_prompt = f"""{system_prompt}

USER INVISIBLE SOS REPORT SUBMISSION:
Case Identifier to assign: {case_code}
{json.dumps(report_payload, indent=2, ensure_ascii=False)}
"""

    if api_key and len(api_key) > 5:
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)

            for model_name in CANDIDATE_MODELS:
                try:
                    model = genai.GenerativeModel(model_name)
                    res = model.generate_content(full_prompt)
                    text = res.text.strip()
                    json_match = re.search(r'\{.*\}', text, re.DOTALL)
                    if json_match:
                        parsed = json.loads(json_match.group(0))
                        parsed["model_used"] = f"{model_name} (Cloud)"
                        return parsed
                except Exception as model_err:
                    continue
        except Exception as e:
            print(f"[Gemini API Error in Invisible SOS] {e}")

    # High-Fidelity Deterministic Fallback Engine
    return generate_deterministic_triage(report_payload, case_code)


def generate_deterministic_triage(data: Dict[str, Any], case_code: str) -> Dict[str, Any]:
    env = data.get("environment", "Online")
    category = data.get("primary_category", "Online Grooming")
    tactics = data.get("tactics_observed", [])
    story = data.get("raw_story", "")
    platform = data.get("platform", "Online Platform")
    sub_surface = data.get("platform_surface", "Direct Message")
    city = data.get("city", "Not specified")
    district = data.get("district", "Not specified")
    state = data.get("state", "Not specified")
    school = data.get("institution_name", "Not specified")
    age = data.get("age_bracket", "14-17")
    immediate = data.get("immediate_danger", "No")

    score = 50
    if immediate.lower().startswith("yes"):
        score += 40
    if any(t in str(tactics).lower() for t in ["photo", "blackmail", "threat", "secret"]):
        score += 30
    if "under" in str(age).lower() or "10" in str(age):
        score += 15

    score = min(98, max(15, score))
    urgency = "P1 - Immediate Intervention" if score >= 75 else ("P2 - Moderate Review" if score >= 50 else "P3 - Standard Advisory")
    risk_level = "CRITICAL" if score >= 90 else ("HIGH" if score >= 70 else ("MEDIUM" if score >= 40 else "LOW"))

    return {
        "case_code": case_code,
        "urgency_level": urgency,
        "risk_score": score,
        "risk_level": risk_level,
        "primary_threat_cluster": category.upper().replace(" ", "_"),
        "assigned_organization": "District Child Welfare Committee & Cyber Cell (1930)" if score >= 75 else "School Counseling Cell",
        "recommended_actions": [
            "Do not comply with demands or send additional media.",
            "Preserve screenshots and digital timestamps without modifying content.",
            "Reach out to trusted adults or toll-free Childline 1098."
        ],
        "safety_graph_nodes": {
            "cluster": {
                "name": category,
                "type": "THREAT_CATEGORY",
                "severity": risk_level
            },
            "tactics": tactics or ["Unsolicited Contact", "Boundary Testing"],
            "case": case_code,
            "platform": {
                "name": platform,
                "sub_surface": sub_surface,
                "vector": "DIGITAL_SOCIAL" if env == "Online" else "PHYSICAL_SPACE"
            },
            "location_jurisdiction": {
                "city": city,
                "district": district,
                "state": state,
                "institution": school
            }
        },
        "case_structured_summary": {
            "headline": f"Anonymous report regarding {category} on {platform} in {city}, {state}",
            "child_friendly_reassurance": "You are safe and this is not your fault. Verified responders will review your case anonymously.",
            "statutory_violation_flags": ["POCSO / IT Act Safety Advisory"]
        },
        "model_used": "Deterministic Safety Engine (Fallback)"
    }


if __name__ == "__main__":
    # Test with realistic sample submission
    sample_report = {
        "environment": "Online",
        "primary_category": "Online Grooming / Private Photo Pressure",
        "tactics_observed": [
            "Someone asked me to keep it secret",
            "Private photo/video request",
            "Blackmail / extortion",
            "Threatened me"
        ],
        "platform": "Instagram",
        "platform_surface": "Direct Message",
        "city": "Pune",
        "district": "Pune",
        "state": "Maharashtra",
        "locality": "Shivaji Nagar",
        "age_bracket": "10-13",
        "status_role": "School student",
        "institution_name": "Modern English High School",
        "relationship": "Online stranger",
        "raw_story": "Someone started texting me on Instagram pretending to be a model scout. Then they asked for private photos and said they would share my account with everyone at school if I block them. They told me not to tell my parents.",
        "evidence_type": "Screenshots",
        "timeframe": "In the last few days",
        "is_repeated": True,
        "immediate_danger": "No"
    }

    print("--- Running Invisible SOS Triage with Gemini ---")
    result = triage_invisible_sos(sample_report)
    print(json.dumps(result, indent=2, ensure_ascii=False))
