import csv
import os
from typing import List, Dict, Any

CSV_PATH = os.path.join(os.path.dirname(__file__), "data", "ngos_india.csv")

def load_ngos() -> List[Dict[str, Any]]:
    ngos = []
    if not os.path.exists(CSV_PATH):
        return ngos
    with open(CSV_PATH, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row.get("active", "True").lower() == "true":
                ngos.append({
                    "organization_name": row.get("organization_name", ""),
                    "organization_type": row.get("organization_type", ""),
                    "city": row.get("city", ""),
                    "district": row.get("district", ""),
                    "state": row.get("state", ""),
                    "child_protection": row.get("child_protection", "False").lower() == "true",
                    "cyber_support": row.get("cyber_support", "False").lower() == "true",
                    "counselling": row.get("counselling", "False").lower() == "true",
                    "legal_aid": row.get("legal_aid", "False").lower() == "true",
                    "sexual_abuse_support": row.get("sexual_abuse_support", "False").lower() == "true",
                    "services": row.get("services", ""),
                    "verification_status": row.get("verification_status", ""),
                    "darpan_id": row.get("darpan_id", ""),
                    "address": row.get("address", ""),
                    "phone": row.get("phone", ""),
                    "email": row.get("email", ""),
                    "website": row.get("website", ""),
                })
    return ngos

def match_ngos_by_location(city: str = "", district: str = "", state: str = "", category: str = "", limit: int = 4) -> List[Dict[str, Any]]:
    all_ngos = load_ngos()
    clean_city = (city or "").strip().lower()
    clean_district = (district or "").strip().lower()
    clean_state = (state or "").strip().lower()
    clean_cat = (category or "").strip().lower()

    needs_cyber = any(w in clean_cat for w in ["cyber", "grooming", "photo", "extortion", "blackmail"])
    needs_sexual_abuse = any(w in clean_cat for w in ["sexual", "abuse", "pocso", "photo"])

    scored = []
    for ngo in all_ngos:
        score = 0
        reasons = []

        n_city = ngo["city"].lower()
        n_dist = ngo["district"].lower()
        n_state = ngo["state"].lower()

        if clean_city and n_city and (clean_city in n_city or n_city in clean_city):
            score += 100
            reasons.append(f"Located directly in {ngo['city']}")
        elif clean_district and n_dist and (clean_district in n_dist or n_dist in clean_district):
            score += 80
            reasons.append(f"District presence in {ngo['district']}")
        elif clean_state and n_state and (clean_state in n_state or n_state in clean_state):
            score += 50
            reasons.append(f"State-level organization for {ngo['state']}")
        elif ngo["state"] == "All India":
            score += 30
            reasons.append("National Statutory Helpline")

        if needs_cyber and ngo["cyber_support"]:
            score += 40
            reasons.append("Specialized in Cyber Safety & Digital Abuse")
        if needs_sexual_abuse and ngo["sexual_abuse_support"]:
            score += 35
            reasons.append("POCSO & Sexual Abuse Support")
        if ngo["counselling"]:
            score += 15
        if ngo["legal_aid"]:
            score += 15

        ngo_copy = dict(ngo)
        ngo_copy["relevance_score"] = score
        ngo_copy["match_reason"] = " • ".join(reasons) or "Verified Child Welfare Partner"
        scored.append(ngo_copy)

    scored.sort(key=lambda x: x["relevance_score"], reverse=True)

    # Combine top local + national resources
    local_ngos = [n for n in scored if n["state"] != "All India"]
    national_ngos = [n for n in scored if n["state"] == "All India"]

    results = []
    seen = set()
    for n in local_ngos[:2] + national_ngos[:2] + scored:
        if n["organization_name"] not in seen:
            seen.add(n["organization_name"])
            results.append(n)
        if len(results) >= limit:
            break

    return results
