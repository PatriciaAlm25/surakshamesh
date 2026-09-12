def generate_safety_explanation(detected_patterns):
    if not detected_patterns:
        return {
            "title": "You're doing okay",
            "reason": "We didn't find any major warning signs in this conversation.",
            "action_title": "Keep staying safe",
            "action": "Avoid sharing private information with people you don't know online.",
            "reassurance": "If anything ever makes you uncomfortable, it's okay to ask a trusted adult for help."
        }
        
    explanations = {
        "age_probing": {
            "reason": "They're asking about your age. Someone you don't know online doesn't need to know personal details about you.",
            "action": "Don't share your age, school, address, or other private information."
        },
        "secrecy_request": {
            "reason": "Asking you to keep chats secret is a warning sign. You should never feel like you have to hide an online friendship.",
            "action": "Stop the conversation if you feel uncomfortable and tell a trusted adult."
        },
        "image_request": {
            "reason": "You never have to send someone a photo just because they ask. They could save or share it without your permission.",
            "action": "Don't send it. If they keep asking, stop replying and tell a trusted adult."
        },
        "private_channel_migration": {
            "reason": "Moving a conversation somewhere private can make it harder for others to notice if something goes wrong.",
            "action": "Stay on the current platform and talk to a trusted adult if you're unsure."
        },
        "reward_manipulation": {
            "reason": "Promises of gifts, prizes, or rewards can sometimes be used to gain your trust or pressure you.",
            "action": "Don't share personal information or send anything to get the reward."
        },
        "offline_contact_attempt": {
            "reason": "Someone online asking to meet you in person can be risky, especially if you don't know them in real life.",
            "action": "Never meet an online stranger alone. Tell a trusted adult first."
        },
        "sexualization": {
            "reason": "Messages that turn a conversation sexual are not okay if they make you uncomfortable.",
            "action": "Don't send sexual messages or photos. Stop replying and tell a trusted adult."
        },
        "coercion": {
            "reason": "Trying to pressure, threaten, or control you is not okay.",
            "action": "Stop replying, save the messages, and tell a trusted adult."
        },
        "coercion_or_blackmail": {
            "reason": "Threatening you to make you send something or keep a secret is not okay. You are not in trouble.",
            "action": "Don't give in to the threat. Save the messages, block them, and tell a trusted adult."
        },
        "blackmail": {
            "reason": "Threatening you to make you send something or keep a secret is not okay. You are not in trouble.",
            "action": "Don't give in to the threat. Save the messages, block them, and tell a trusted adult."
        },
        "prize_scam": {
            "reason": "Promises of prizes or free rewards can be used to trick you into giving away information.",
            "action": "Don't share personal or payment information just to claim a prize."
        },
        "urgent_action": {
            "reason": "Messages that rush you to act can make it easier to make a mistake.",
            "action": "Pause before clicking, paying, or sharing anything."
        },
        "credential_request": {
            "reason": "Nobody should need your password, OTP, or login details to help you.",
            "action": "Never share passwords or OTPs. Ask a trusted adult if you're unsure."
        },
        "suspicious_link": {
            "reason": "Unknown links can lead to fake websites or try to steal your information.",
            "action": "Don't click the link. Check with a trusted adult first."
        },
        "cyberbullying": {
            "reason": "These messages may be trying to hurt, embarrass, or threaten someone.",
            "action": "Don't fight back. Save the messages, block/report the person, and tell a trusted adult."
        }
    }
    
    # Priority sorting based on weight or severity (roughly based on how bad they are)
    priority_order = [
        "coercion_or_blackmail", "blackmail", "coercion", "sexualization", "offline_contact_attempt",
        "credential_request", "secrecy_request", "image_request", "private_channel_migration",
        "prize_scam", "reward_manipulation", "age_probing", "urgent_action", "suspicious_link",
        "cyberbullying"
    ]
    
    # Sort detected patterns by priority
    sorted_patterns = sorted([p for p in detected_patterns if p in explanations], 
                             key=lambda x: priority_order.index(x) if x in priority_order else 999)
    
    # Take top 1-3 patterns
    top_patterns = sorted_patterns[:3]
    
    if not top_patterns:
        return {
            "title": "This conversation has some warning signs.",
            "reason": "We noticed some concerning patterns in this conversation.",
            "action_title": "What can I do?",
            "action": "Stop the conversation if you feel uncomfortable and tell a trusted adult.",
            "reassurance": "You haven't done anything wrong. It's okay to ask for help."
        }
        
    combined_reason = " ".join([explanations[p]["reason"] for p in top_patterns])
    
    # Use the action from the highest priority pattern
    primary_action = explanations[top_patterns[0]]["action"]
    
    # Prepend the intro if we have multiple reasons to make it flow like the user asked:
    # "This conversation has some warning signs. They're asking you..."
    if len(top_patterns) > 1:
        combined_reason = "This conversation has some warning signs. " + combined_reason
        
    return {
        "title": "Why is this risky?",
        "reason": combined_reason,
        "action_title": "What can I do?",
        "action": primary_action,
        "reassurance": "You haven't done anything wrong. It's okay to ask for help."
    }
