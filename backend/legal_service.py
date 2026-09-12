import json
import os
from typing import List, Dict, Any

LAWS_JSON_PATH = os.path.join(os.path.dirname(__file__), "data", "laws_dataset.json")

def load_laws() -> List[Dict[str, Any]]:
    if not os.path.exists(LAWS_JSON_PATH):
        return []
    with open(LAWS_JSON_PATH, mode="r", encoding="utf-8") as f:
        return json.load(f)

def match_applicable_laws(category: str = "", tactics: List[str] = None, age: str = "", environment: str = "Online", limit: int = 3) -> List[Dict[str, Any]]:
    tactics = tactics or []
    all_laws = load_laws()
    clean_cat = (category or "").strip().lower()
    clean_tactics = [t.lower() for t in tactics]

    matched = []
    for law in all_laws:
        score = 0
        reasons = []

        # Check category match
        for cat in law.get("categories", []):
            if cat.lower() in clean_cat or clean_cat in cat.lower():
                score += 50
                reasons.append(f"Direct violation for {cat}")
                break

        # Check tactics match
        for law_tactic in law.get("tactics", []):
            for user_tactic in clean_tactics:
                if law_tactic.lower() in user_tactic or user_tactic in law_tactic.lower():
                    score += 30
                    reasons.append(f"Matches tactic: '{law_tactic}'")
                    break

        # Special priority for POCSO and IT Act 67B when minor or photo extortion
        if "pocso" in law["id"].lower() and any(w in clean_cat for w in ["grooming", "photo", "sexual", "abuse"]):
            score += 40
        if "67b" in law["id"].lower() and any(w in clean_cat for w in ["photo", "extortion", "grooming"]):
            score += 40

        # Always include Article 21 baseline protection
        if "article 21" in law["section"].lower():
            score += 20

        if score > 0:
            law_copy = dict(law)
            law_copy["match_score"] = score
            law_copy["citation_reason"] = " • ".join(reasons[:2]) or "Statutory child-protection guarantee"
            matched.append(law_copy)

    # Sort by match score descending
    matched.sort(key=lambda x: x["match_score"], reverse=True)
    return matched[:limit]
