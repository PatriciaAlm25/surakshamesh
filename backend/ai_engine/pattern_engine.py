import re


# ============================================================
# BEHAVIOURAL PATTERNS
# ============================================================

PATTERNS = {

    # --------------------------------------------------------
    # GROOMING SIGNALS
    # --------------------------------------------------------

    "age_probing": {
        "patterns": [
            r"\bhow old are you\b",
            r"\bwhat age are you\b",
            r"\byour age\b",
            r"\bare you \d{1,2}\b",
            r"\bhow many years old\b"
        ],
        "weight": 20
    },

    "secrecy_request": {
    "patterns": [
        r"\bdon'?t tell your parents\b",
        r"\bdon'?t tell (anyone|anybody)\b",
        r"\bkeep this (a )?secret\b",
        r"\bkeep (our|this) (chat|chats|conversation|conversations) secret\b",
        r"\bkeep (our|this) (chat|chats|conversation|conversations) private\b",
        r"\bkeep this between us\b",
        r"\bthis stays between us\b",
        r"\bno one needs to know\b",
        r"\bno one should know\b",
        r"\bplease don'?t tell anyone\b",
        r"\bthis is just between you and me\b",
        r"\bwhat we talk about stays private\b",
        r"\bkeep it between us\b",
        r"\bdon'?t let your parents know\b",
        r"\bdon'?t let anyone know\b"
    ],
    "weight": 30
},

    "isolation_attempt": {
        "patterns": [
            r"\bdon't listen to your parents\b",
            r"\bdont listen to your parents\b",
            r"\byou don't need your parents\b",
            r"\byou dont need your parents\b",
            r"\bthey won't understand\b",
            r"\bthey wont understand\b",
            r"\byour parents don't understand\b",
            r"\byour parents dont understand\b"
        ],
        "weight": 30
    },
"image_request": {
    "patterns": [
        r"\bsend me a picture\b",
        r"\bsend me a photo\b",
        r"\bsend a picture\b",
        r"\bsend a photo\b",
        r"\bsend me your pic\b",
        r"\bsend me a pic\b",
        r"\bcan you send.*picture\b",
        r"\bcan you send.*photo\b",
        r"\bshow me a picture\b",
        r"\bshow me a photo\b",

        # Natural requests / pressure
        r"\b(wants|want|asking for|asked for|asking me for|asked me for).*(photo|picture|pic|selfie)\b",
        r"\b(wants|want|asking|asked).*(my|your).*(photo|picture|pic|selfie)\b",
        r"\b(asking|pressuring|pressures|forcing).*(photo|picture|pic|selfie)\b",
        r"\b(send|share|give).*(your|my).*(photo|picture|pic|selfie)\b",
        r"\bphoto of (you|me|yourself)\b",
        r"\bpicture of (you|me|yourself)\b",
        r"\bpic of (you|me|yourself)\b",
        r"\bselfie\b",
        r"\bprivate (photo|picture|pic|selfie)\b",
        r"\bpersonal (photo|picture|pic|selfie)\b"
    ],
    "weight": 30
},

    "private_channel_migration": {
        "patterns": [
            r"\bmove to whatsapp\b",
            r"\bmessage me on whatsapp\b",
            r"\bchat on whatsapp\b",
            r"\badd me on snapchat\b",
            r"\bmessage me on snapchat\b",
            r"\bmove to telegram\b",
            r"\bmessage me on telegram\b",
            r"\bprivate chat\b",
            r"\bprivate message\b",
            r"\bdm me\b",
            r"\btalk somewhere private\b",
            r"\bmove somewhere private\b",
            r"\bchat privately\b",
            r"\bcontinue somewhere private\b"
        ],
        "weight": 20
    },

    "reward_manipulation": {
        "patterns": [
            r"\bi'll give you money\b",
            r"\bi will give you money\b",
            r"\bi'll buy you\b",
            r"\bi will buy you\b",
            r"\bi'll send you money\b",
            r"\bi will send you money\b",
            r"\bi can get you\b.*\bgift\b",
            r"\byou'll get a gift\b",
            r"\byou will get a gift\b"
        ],
        "weight": 20
    },

    "offline_contact_attempt": {
        "patterns": [
            r"\bmeet me\b",
            r"\blet's meet\b",
            r"\blets meet\b",
            r"\bcome meet me\b",
            r"\bmeet in person\b",
            r"\bcome to my place\b",
            r"\bcome over\b",
            r"\bwhere do you live\b",
            r"\bwhat is your address\b",
            r"\bwhere is your house\b"
        ],
        "weight": 35
    },

    "sexualization": {
        "patterns": [
            r"\bshow me your body\b",
            r"\bshow your body\b",
            r"\bshow me your chest\b",
            r"\bshow me your breasts\b",
            r"\bshow me your private\b",
            r"\bwhat are you wearing\b",
            r"\bare you naked\b",
            r"\bsend nudes\b",
            r"\bsend me nudes\b",
            r"\bsexy picture\b",
            r"\bsexual\b"
        ],
        "weight": 40
    },

    "coercion_or_blackmail": {
        "patterns": [
            r"\bi'll expose you\b",
            r"\bi will expose you\b",
            r"\bi'll tell everyone\b",
            r"\bi will tell everyone\b",
            r"\bif you don't.*i'll\b",
            r"\bif you dont.*ill\b",
            r"\byou better do it\b",
            r"\bor else\b",
            r"\bi'll leak\b",
            r"\bi will leak\b",
            r"\bblackmail\b"
        ],
        "weight": 45
    },


    # --------------------------------------------------------
    # SCAM SIGNALS
    # --------------------------------------------------------

    "prize_scam": {
        "patterns": [
            r"\bwon\b.*\bprize\b",
            r"\bwon\b.*\biphone\b",
            r"\bwon\b.*\bphone\b",
            r"\bwon\b.*\bmoney\b",
            r"\bwon\b.*\bcash\b",
            r"\bwon\b.*\breward\b",
            r"\bcongratulations\b.*\bwon\b",
            r"\bcongrats\b.*\bwon\b",
            r"\byou are a winner\b",
            r"\byou're a winner\b",
            r"\byou have won\b",
            r"\byou've won\b"
        ],
        "weight": 30
    },

    "urgent_action": {
        "patterns": [
            r"\bclick\b.*\bimmediately\b",
            r"\bclick\b.*\bnow\b",
            r"\bclaim\b.*\bimmediately\b",
            r"\bclaim\b.*\bnow\b",
            r"\bact now\b",
            r"\bact immediately\b",
            r"\brespond immediately\b",
            r"\brespond now\b",
            r"\burgent\b",
            r"\bimmediately\b"
        ],
        "weight": 20
    },

    "credential_request": {
        "patterns": [
            r"\benter\b.*\bpassword\b",
            r"\benter\b.*\botp\b",
            r"\benter\b.*\baccount details\b",
            r"\benter\b.*\blogin\b",
            r"\bsend\b.*\bpassword\b",
            r"\bsend\b.*\botp\b",
            r"\bprovide\b.*\bpassword\b",
            r"\bprovide\b.*\botp\b",
            r"\baccount details\b",
            r"\blogin details\b",
            r"\bbank details\b",
            r"\bcredit card\b",
            r"\bcard details\b",
            r"\bcredentials\b"
        ],
        "weight": 40
    },

    "suspicious_link": {
        "patterns": [
            r"\bclick\b.*\blink\b",
            r"\bopen\b.*\blink\b",
            r"\bvisit\b.*\blink\b",
            r"\bclick here\b",
            r"\bclick this\b",
            r"https?://",
            r"www\."
        ],
        "weight": 20
    },

    # --------------------------------------------------------
    # CYBERBULLYING SIGNALS
    # --------------------------------------------------------

    "insult_name_calling": {
        "patterns": [
            r"\b(stupid|idiot|dumb|ugly|fat|loser|weird|freak|trash)\b",
            r"\byou're so.*\b(stupid|idiot|dumb|ugly|fat|loser|weird|freak|trash)\b",
            r"\byou are.*\b(stupid|idiot|dumb|ugly|fat|loser|weird|freak|trash)\b"
        ],
        "weight": 25
    },

    "repeated_humiliation": {
        "patterns": [
            r"\beveryone hates you\b",
            r"\bnobody likes you\b",
            r"\bno one likes you\b",
            r"\beveryone should laugh at you\b",
            r"\beveryone thinks you're\b",
            r"\bwhy are you even here\b",
            r"\byou're useless\b"
        ],
        "weight": 35
    },

    "threats": {
        "patterns": [
            r"\byou'll regret this\b",
            r"\byou will regret this\b",
            r"\bi'll hurt you\b",
            r"\bi will hurt you\b",
            r"\bwatch your back\b",
            r"\bi'm going to get you\b"
        ],
        "weight": 40
    },

    "social_exclusion": {
        "patterns": [
            r"\bdon't talk to them\b",
            r"\bnobody wants you here\b",
            r"\bwe don't want you\b",
            r"\bleave us alone\b",
            r"\byou can't sit with us\b",
            r"\byou shouldn't be here\b",
            r"\byou should just disappear\b"
        ],
        "weight": 30
    }
}


# ============================================================
# ANALYZE CONVERSATION
# ============================================================

def calculate_pattern_risk(messages):

    # Convert everything to lowercase
    messages = [
        str(message).lower().strip()
        for message in messages
        if str(message).strip()
    ]

    detected_patterns = []
    pattern_details = []

    score = 0


    # --------------------------------------------------------
    # CHECK EVERY MESSAGE
    # --------------------------------------------------------

    for message in messages:

        for signal_name, signal_data in PATTERNS.items():

            # Don't count the same signal repeatedly
            # just because it appears in several messages.

            if signal_name in detected_patterns:
                continue

            for pattern in signal_data["patterns"]:

                if re.search(pattern, message):

                    detected_patterns.append(
                        signal_name
                    )

                    score += signal_data["weight"]

                    pattern_details.append({
                        "signal": signal_name,
                        "weight": signal_data["weight"],
                        "message": message
                    })

                    break


    # ========================================================
    # GROOMING COMBINATION BONUSES
    # ========================================================

    if (
        "age_probing" in detected_patterns
        and
        "secrecy_request" in detected_patterns
        and
        "isolation_attempt" in detected_patterns
    ):

        score += 25


    if (
        "secrecy_request" in detected_patterns
        and
        "image_request" in detected_patterns
    ):

        score += 30


    if (
        "age_probing" in detected_patterns
        and
        "image_request" in detected_patterns
    ):

        score += 20


    if (
        "private_channel_migration" in detected_patterns
        and
        "secrecy_request" in detected_patterns
    ):

        score += 25


    if (
        "sexualization" in detected_patterns
        and
        "image_request" in detected_patterns
    ):

        score += 40


    if (
        "offline_contact_attempt" in detected_patterns
        and
        "age_probing" in detected_patterns
    ):

        score += 35


    # ========================================================
    # SCAM COMBINATION BONUSES
    # ========================================================

    if (
        "prize_scam" in detected_patterns
        and
        "urgent_action" in detected_patterns
    ):

        score += 20


    if (
        "credential_request" in detected_patterns
        and
        "suspicious_link" in detected_patterns
    ):

        score += 30


    if (
        "prize_scam" in detected_patterns
        and
        "credential_request" in detected_patterns
    ):

        score += 30


    # ========================================================
    # CAP SCORE
    # ========================================================

    score = min(score, 100)


    # ========================================================
    # DETERMINE SEVERITY
    # ========================================================

    if score >= 85:

        severity = "CRITICAL"

    elif score >= 65:

        severity = "HIGH"

    elif score >= 40:

        severity = "MEDIUM"

    elif score >= 20:

        severity = "LOW"

    else:

        severity = "NONE"


    # ========================================================
    # RETURN RESULT
    # ========================================================

    return {

        "score": score,

        "severity": severity,

        "patterns": [
            {
                "signal": pattern,
                "weight": PATTERNS[pattern]["weight"]
            }
            for pattern in detected_patterns
        ],

        "pattern_details": pattern_details
    }