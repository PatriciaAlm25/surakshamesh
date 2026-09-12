from typing import List, Dict, Any
from .risk_engine import analyze_conversation

def calculate_conversation_risk(messages: List[str]) -> Dict[str, Any]:
    """
    Analyzes a conversation chronologically, tracking cumulative risk and patterns.
    """
    message_results = []
    risk_progression = []
    all_patterns = set()
    
    current_cumulative_score = 0
    overall_category = "safe"
    overall_severity = "NONE"
    
    for idx, msg in enumerate(messages):
        # Analyze the individual message using the existing ML model and pattern engine
        result = analyze_conversation([msg])
        
        score = result["final_risk_score"]
        patterns = result["patterns"]
        category = result["category"]
        severity = result["severity"]
        
        # Track all unique patterns detected so far
        all_patterns.update(patterns)
        
        # Escalation Logic:
        # Start with the highest between current message score and cumulative score
        current_cumulative_score = max(current_cumulative_score, score)
        
        # Add escalation bonus for accumulating patterns
        if len(patterns) > 0:
            current_cumulative_score += 5 * len(patterns)
            
        # Additional bonus if we have multiple specific grooming patterns
        grooming_signals = {
            "age_probing", "secrecy_request", "isolation_attempt", 
            "image_request", "private_channel_migration", 
            "reward_manipulation", "offline_contact_attempt", 
            "sexualization", "coercion_or_blackmail"
        }
        detected_grooming = all_patterns.intersection(grooming_signals)
        if len(detected_grooming) >= 2:
            current_cumulative_score += 10
            
        # Cap score at 100
        current_cumulative_score = min(100, current_cumulative_score)
        
        # Determine current severity based on cumulative score
        if current_cumulative_score >= 85:
            overall_severity = "CRITICAL"
        elif current_cumulative_score >= 65:
            overall_severity = "HIGH"
        elif current_cumulative_score >= 40:
            overall_severity = "MEDIUM"
        elif current_cumulative_score >= 20:
            overall_severity = "LOW"
        else:
            overall_severity = "NONE"
            
        # Update overall category if a non-safe category is detected
        if category != "safe":
            overall_category = category
            
        message_results.append({
            "message_number": idx + 1,
            "message": msg,
            "category": category,
            "severity": severity,
            "risk_score": score,
            "patterns": patterns
        })
        
        risk_progression.append({
            "message_number": idx + 1,
            "score": current_cumulative_score,
            "severity": overall_severity
        })
        
    escalation = False
    if len(risk_progression) > 1 and risk_progression[-1]["score"] > risk_progression[0]["score"]:
        escalation = True
        
    # If no message tripped a category but the score escalated due to vague patterns
    if overall_category == "safe" and current_cumulative_score >= 40:
        overall_category = "general_risk"
        
    from .safety_explanations import generate_safety_explanation
    
    # We only show explanations for patterns detected. If severity is low/none and no patterns, 
    # generate_safety_explanation handles the "safe" message.
    safety_explanation = generate_safety_explanation(list(all_patterns))
        
    return {
        "overall_category": overall_category,
        "overall_severity": overall_severity,
        "overall_risk_score": current_cumulative_score,
        "escalation": escalation,
        "message_results": message_results,
        "risk_progression": risk_progression,
        "detected_patterns": list(all_patterns),
        "safety_explanation": safety_explanation
    }
