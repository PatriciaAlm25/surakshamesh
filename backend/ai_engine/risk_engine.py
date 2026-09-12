import joblib
from pathlib import Path
from .pattern_engine import calculate_pattern_risk


# ============================================================
# LOAD MODEL
# ============================================================

print("Loading Bal Suraksha ML model...")

MODEL_PATH = Path(__file__).resolve().parent / "bal_suraksha_model.pkl"

print(f"Loading Bal Suraksha ML model from: {MODEL_PATH}")

model = joblib.load(MODEL_PATH)

print("Bal Suraksha ML model loaded successfully!")




# ============================================================
# ANALYZE CONVERSATION
# ============================================================

def analyze_conversation(messages):

    # --------------------------------------------------------
    # CLEAN MESSAGES
    # --------------------------------------------------------

    messages = [
        str(message).strip()
        for message in messages
        if str(message).strip()
    ]

    if not messages:

        return {
            "category": "safe",
            "severity": "NONE",
            "final_risk_score": 0,
            "ml_risk_score": 0,
            "pattern_risk_score": 0,
            "patterns": [],
            "message_results": []
        }


    # ========================================================
    # ML ANALYSIS
    # ========================================================

    probabilities = model.predict_proba(
        messages
    )

    classes = model.classes_

    message_results = []

    risk_scores = {
        "cyberbullying": [],
        "grooming": [],
        "scam": []
    }


    for message, probability in zip(
        messages,
        probabilities
    ):

        scores = {
            category: float(score)
            for category, score in zip(
                classes,
                probability
            )
        }

        prediction = max(
            scores,
            key=scores.get
        )

        confidence = scores[prediction]


        message_results.append({

            "message": message,

            "prediction": prediction,

            "confidence": round(
                confidence,
                4
            ),

            "probabilities": {
                category: round(
                    score,
                    4
                )
                for category, score
                in scores.items()
            }
        })


        for category in risk_scores:

            risk_scores[category].append(
                scores.get(
                    category,
                    0
                )
            )


    # ========================================================
    # ML CATEGORY SCORES
    # ========================================================

    ml_category_scores = {}


    for category, scores in risk_scores.items():

        scores = sorted(
            scores,
            reverse=True
        )

        # Only use strongest 3 messages.
        top_scores = scores[:3]


        if top_scores:

            average = (
                sum(top_scores)
                /
                len(top_scores)
            )

        else:

            average = 0


        ml_category_scores[category] = (
            average * 100
        )


    # ========================================================
    # ML DOMINANT CATEGORY
    # ========================================================

    ml_category = max(
        ml_category_scores,
        key=ml_category_scores.get
    )

    ml_risk_score = ml_category_scores[
        ml_category
    ]


    # ========================================================
    # BEHAVIOURAL PATTERN ANALYSIS
    # ========================================================

    pattern_result = calculate_pattern_risk(
        messages
    )

    pattern_risk_score = pattern_result[
        "score"
    ]

    patterns = pattern_result[
        "patterns"
    ]


    pattern_names = {
        pattern["signal"]
        for pattern in patterns
    }


    # ========================================================
    # GROOMING SIGNALS
    # ========================================================

    grooming_signals = {
        "age_probing",
        "secrecy_request",
        "isolation_attempt",
        "image_request",
        "private_channel_migration",
        "reward_manipulation",
        "offline_contact_attempt",
        "sexualization",
        "coercion_or_blackmail"
    }


    grooming_pattern_count = len(
        pattern_names.intersection(
            grooming_signals
        )
    )


    # ========================================================
    # SCAM SIGNALS
    # ========================================================

    scam_signals = {
        "prize_scam",
        "urgent_action",
        "credential_request",
        "suspicious_link"
    }


    scam_pattern_count = len(
        pattern_names.intersection(
            scam_signals
        )
    )


    # ========================================================
    # DETERMINE CATEGORY
    # ========================================================

    # Strong behavioural evidence takes priority
    # over weak ML predictions.


    if grooming_pattern_count >= 2:

        final_category = "grooming"


    elif scam_pattern_count >= 2:

        final_category = "scam"


    elif ml_category == "cyberbullying":

        # Require reasonably strong ML evidence
        # before calling something bullying.

        if ml_risk_score >= 45:

            final_category = "cyberbullying"

        else:

            final_category = "safe"


    elif ml_category == "grooming":

        # ML-only grooming predictions are treated
        # cautiously because our current model has
        # demonstrated false positives.

        if ml_risk_score >= 75:

            final_category = "grooming"

        else:

            final_category = "safe"


    elif ml_category == "scam":

        if ml_risk_score >= 30:

            final_category = "scam"

        else:

            final_category = "safe"


    else:

        final_category = "safe"


    # ========================================================
    # FINAL RISK SCORE
    # ========================================================

    # Start with ML contribution.

    final_risk_score = (
        ml_risk_score * 0.40
        +
        pattern_risk_score * 0.60
    )


    # --------------------------------------------------------
    # Behavioural escalation
    # --------------------------------------------------------

    if grooming_pattern_count >= 2:

        final_risk_score = max(
            final_risk_score,
            65
        )


    if grooming_pattern_count >= 4:

        final_risk_score = max(
            final_risk_score,
            80
        )


    if grooming_pattern_count >= 5:

        final_risk_score = max(
            final_risk_score,
            90
        )


    # --------------------------------------------------------
    # Scam escalation
    # --------------------------------------------------------

    if scam_pattern_count >= 2:

        final_risk_score = max(
            final_risk_score,
            50
        )


    if scam_pattern_count >= 3:

        final_risk_score = max(
            final_risk_score,
            70
        )


    if scam_pattern_count >= 4:

        final_risk_score = max(
            final_risk_score,
            85
        )


    # --------------------------------------------------------
    # Cyberbullying escalation
    # --------------------------------------------------------

    if (
        final_category == "cyberbullying"
        and
        ml_risk_score >= 60
    ):

        final_risk_score = max(
            final_risk_score,
            40
        )


    # ========================================================
    # SAFE OVERRIDE
    # ========================================================

    # If there are NO behavioural signals and the
    # ML confidence is relatively weak, don't allow
    # the model to automatically create a high-risk alert.

    if (
        len(pattern_names) == 0
        and
        ml_risk_score < 70
        and
        final_category in {
            "grooming",
            "scam",
            "cyberbullying"
        }
    ):

        if final_category == "grooming":

            final_category = "safe"


        final_risk_score = min(
            final_risk_score,
            30
        )


    # ========================================================
    # CAP SCORE
    # ========================================================

    final_risk_score = min(
        final_risk_score,
        100
    )


    # ========================================================
    # SEVERITY
    # ========================================================

    if final_risk_score >= 85:

        severity = "CRITICAL"

    elif final_risk_score >= 65:

        severity = "HIGH"

    elif final_risk_score >= 40:

        severity = "MEDIUM"

    elif final_risk_score >= 20:

        severity = "LOW"

    else:

        severity = "NONE"


    # ========================================================
    # SAFETY: SAFE CATEGORY
    # ========================================================

    if final_category == "safe":

        # Don't show an alarming severity for safe
        # conversations unless strong behavioural
        # evidence exists.

        if pattern_risk_score == 0:

            severity = "NONE"

            final_risk_score = min(
                final_risk_score,
                19
            )


    # ========================================================
    # FINAL RESULT
    # ========================================================

    return {

        "category": final_category,

        "severity": severity,

        "final_risk_score": round(
            final_risk_score,
            2
        ),

        "ml_category": ml_category,

        "ml_risk_score": round(
            ml_risk_score,
            2
        ),

        "ml_category_scores": {
            category: round(
                score,
                2
            )
            for category, score
            in ml_category_scores.items()
        },

        "pattern_risk_score": pattern_risk_score,

        "patterns": [
            pattern["signal"]
            for pattern in patterns
        ],

        "pattern_details":
            pattern_result[
                "pattern_details"
            ],

        "message_results":
            message_results
    }