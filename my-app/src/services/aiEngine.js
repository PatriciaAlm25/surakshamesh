/**
 * SURAKSHA MESH - AI Safety Engine & Grooming Radar
 * Multilingual NLP, Grooming Progression Radar, OCR Analyzer & AI Case Translator
 */

export const SCENARIO_PRESETS = [
  {
    id: 'grooming_progression',
    title: '🚨 Grooming Progression (Multi-Day)',
    badge: 'Critical Danger',
    category: 'ONLINE_GROOMING',
    description: 'Demonstrates escalation across 4 stages: Friendly contact -> Trust building -> Secrecy demand -> Exploitative media request.',
    contact: {
      name: 'Alex_Shadow99',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      status: 'Online',
      handle: '@alex_shadow_real'
    },
    messages: [
      {
        id: 'g1',
        sender: 'contact',
        text: 'Hey! I saw your post about Roblox and anime. What games do you like to play?',
        timestamp: 'Day 1 • 4:15 PM',
        stage: 'Initial Contact'
      },
      {
        id: 'g2',
        sender: 'child',
        text: 'Hi! I play Roblox Bedwars and Genshin Impact mostly.',
        timestamp: 'Day 1 • 4:18 PM'
      },
      {
        id: 'g3',
        sender: 'contact',
        text: 'That is awesome! You are honestly so mature for your age compared to other people.',
        timestamp: 'Day 3 • 6:30 PM',
        stage: 'Trust Building / Flattery'
      },
      {
        id: 'g4',
        sender: 'child',
        text: 'Thanks haha, people say that a lot.',
        timestamp: 'Day 3 • 6:32 PM'
      },
      {
        id: 'g5',
        sender: 'contact',
        text: 'You can tell me anything. But please don\'t tell your parents or friends that we talk here, they won\'t understand our friendship.',
        timestamp: 'Day 6 • 9:45 PM',
        stage: 'Secrecy & Isolation'
      },
      {
        id: 'g6',
        sender: 'child',
        text: 'Why would I need to hide it?',
        timestamp: 'Day 6 • 9:50 PM'
      },
      {
        id: 'g7',
        sender: 'contact',
        text: 'Because they are too strict. Hey, send me a private photo of yourself in your room to prove you trust me.',
        timestamp: 'Day 10 • 11:15 PM',
        stage: 'Private Media Solicitation'
      }
    ]
  },
  {
    id: 'cyberbullying_blackmail',
    title: '🛑 Cyberbullying & Blackmail',
    badge: 'High Threat',
    category: 'CYBERBULLYING',
    description: 'Detects toxic targeted harassment, reputation extortion, and intimidation patterns.',
    contact: {
      name: 'Vortex_Anon',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      status: 'Active now',
      handle: '@vortex_secret'
    },
    messages: [
      {
        id: 'b1',
        sender: 'contact',
        text: 'Hey loser. I have screenshots of your private chat logs from school server.',
        timestamp: 'Today • 3:00 PM'
      },
      {
        id: 'b2',
        sender: 'child',
        text: 'What are you talking about? Leave me alone.',
        timestamp: 'Today • 3:02 PM'
      },
      {
        id: 'b3',
        sender: 'contact',
        text: 'I will post your photos everywhere and make everyone in your class hate you unless you pay me or do what I say.',
        timestamp: 'Today • 3:05 PM'
      }
    ]
  },
  {
    id: 'media_safety_shield',
    title: '📸 Unsafe Media Interception',
    badge: 'Media Guard',
    category: 'INAPPROPRIATE_MEDIA',
    description: 'Incoming photo/video is intercepted before viewing, presenting a safety shield overlay.',
    contact: {
      name: 'Strangr_Direct',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80',
      status: 'Online',
      handle: '@stranger_x'
    },
    messages: [
      {
        id: 'm1',
        sender: 'contact',
        text: 'Hey check out this picture I took. Open it right now!',
        timestamp: 'Today • 8:12 PM'
      },
      {
        id: 'm2',
        sender: 'contact',
        text: 'Sent an image attachment',
        media_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
        media_type: 'image',
        is_unsafe: true,
        flag_reason: 'Potentially Explicit or Inappropriate Visual Content',
        timestamp: 'Today • 8:13 PM'
      }
    ]
  },
  {
    id: 'phishing_link',
    title: '🔗 Suspicious Link & Phishing',
    badge: 'Malware / Phishing',
    category: 'MALICIOUS_PHISHING',
    description: 'Detects lure scams seeking credentials or personal tracking links.',
    contact: {
      name: 'GameMod_Rewards',
      avatar: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=150&auto=format&fit=crop&q=80',
      status: 'Online',
      handle: '@free_rewards_official'
    },
    messages: [
      {
        id: 'p1',
        sender: 'contact',
        text: 'Congratulations! You won 10,000 Free Game Diamonds! Click this link to claim now: http://free-rewards-login-verify.xyz/gift',
        timestamp: 'Today • 1:20 PM'
      }
    ]
  },
  {
    id: 'multilingual_indic',
    title: '🌐 Indic Regional (Hindi / Hinglish / Marathi)',
    badge: 'Regional NLP',
    category: 'ONLINE_GROOMING',
    description: 'Evaluates regional vernaculars including Hindi, Hinglish, Marathi, and Konkani.',
    contact: {
      name: 'Rohan_Unknown',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'Online',
      handle: '@rohan_ind'
    },
    messages: [
      {
        id: 'i1',
        sender: 'contact',
        text: 'Namaste! Tum bohot sweet ho. Kya hum acche dost ban sakte hain?',
        timestamp: 'Today • 5:10 PM'
      },
      {
        id: 'i2',
        sender: 'child',
        text: 'Main aapko nahi jaanta.',
        timestamp: 'Today • 5:12 PM'
      },
      {
        id: 'i3',
        sender: 'contact',
        text: 'Kisi ko mat batana hamare baare mein. Apni ek private photo bhejo, bas main hi dekhunga.',
        timestamp: 'Today • 5:15 PM'
      }
    ]
  },
  {
    id: 'safe_control_chat',
    title: '🟢 Normal Safe Peer Chat (Control Baseline)',
    badge: 'Safe Baseline',
    category: 'SAFE',
    description: 'Normal school homework conversation demonstrating zero false positives in the AI model.',
    contact: {
      name: 'Ananya (Classmate)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      status: 'Online',
      handle: '@ananya_school'
    },
    messages: [
      {
        id: 's1',
        sender: 'contact',
        text: 'Hey! Did you finish the Science project presentation for tomorrow?',
        timestamp: 'Today • 6:00 PM'
      },
      {
        id: 's2',
        sender: 'child',
        text: 'Yes, almost done with the slides on renewable energy. Sending you the PDF notes.',
        timestamp: 'Today • 6:02 PM'
      },
      {
        id: 's3',
        sender: 'contact',
        text: 'Great! See you in class tomorrow morning.',
        timestamp: 'Today • 6:05 PM'
      }
    ]
  }
];

// Heuristic keyword patterns across languages
const PATTERN_RULES = {
  secrecy: [
    /don'?t tell (your )?(parents|mom|dad|family|anyone|friends)/i,
    /keep (this|it) (a )?secret/i,
    /our little secret/i,
    /delete this chat/i,
    /hide this/i,
    /kisi ko mat batana/i,
    /ghar walo ko mat/i,
    /koni sangtai naka/i,
    /gupta theva/i,
    /koiri sangu naka/i
  ],
  grooming_trust: [
    /mature for your age/i,
    /you look so (pretty|cute|hot|special)/i,
    /you can trust me/i,
    /i understand you better than/i,
    /special friend/i,
    /tum bahut samajhdaar ho/i,
    /tum bohot sweet ho/i,
    /mujhpe bharosa karo/i
  ],
  media_solicitation: [
    /send (me )?(a )?(private |exclusive |cute )?(photo|picture|pic|video|snap|selfie)/i,
    /show me (what you look like|your room|yourself)/i,
    /webcam on/i,
    /photo bhejo/i,
    /tasveer pathva/i,
    /ek pic bhej/i
  ],
  bullying_threats: [
    /i will (leak|post|share|expose) your (photos|chats|secrets)/i,
    /ruin your life/i,
    /make everyone hate you/i,
    /loser/i,
    /kill yourself/i,
    /sabko bata dunga/i,
    /mar ja/i
  ],
  phishing: [
    /free (robux|v-bucks|diamonds|gems|coins)/i,
    /click (this )?link/i,
    /claim (your )?reward/i,
    /http[s]?:\/\//i,
    /\.xyz|\.top|\.gift|\.free/i
  ],
  doxxing: [
    /where do you live/i,
    /what is your address/i,
    /which school do you go to/i,
    /send live location/i,
    /tumhara ghar kahan hai/i,
    /kuth rahtos/i
  ]
};

/**
 * Analyzes conversation messages and returns explainable risk progression
 */
export function evaluateConversationSafety(messages, childAge = 13) {
  let score = 12;
  const indicators = new Set();
  const progression = [];
  let highestTrigger = null;

  messages.forEach((msg, idx) => {
    const text = msg.text || '';
    let stepDelta = 0;
    let stepFlag = null;

    if (msg.sender !== 'child') {
      // Check Secrecy
      for (const pat of PATTERN_RULES.secrecy) {
        if (pat.test(text)) {
          stepDelta += 32;
          stepFlag = 'Secrecy / Isolation Request';
          indicators.add('Secrecy Request');
          break;
        }
      }

      // Check Grooming Trust
      for (const pat of PATTERN_RULES.grooming_trust) {
        if (pat.test(text)) {
          stepDelta += 18;
          stepFlag = stepFlag || 'Trust Exploitation / Flattery';
          indicators.add('Trust Exploitation');
          break;
        }
      }

      // Check Media Request
      for (const pat of PATTERN_RULES.media_solicitation) {
        if (pat.test(text)) {
          stepDelta += 45;
          stepFlag = 'Private Media Solicitation';
          indicators.add('Private Media Solicitation');
          break;
        }
      }

      // Check Bullying / Extortion
      for (const pat of PATTERN_RULES.bullying_threats) {
        if (pat.test(text)) {
          stepDelta += 50;
          stepFlag = 'Threat & Extortion';
          indicators.add('Threat & Extortion');
          break;
        }
      }

      // Check Phishing
      for (const pat of PATTERN_RULES.phishing) {
        if (pat.test(text)) {
          stepDelta += 30;
          stepFlag = 'Malicious Link / Scam';
          indicators.add('Malicious Link Detection');
          break;
        }
      }

      // Check Doxxing
      for (const pat of PATTERN_RULES.doxxing) {
        if (pat.test(text)) {
          stepDelta += 25;
          stepFlag = 'Personal Information Harvesting';
          indicators.add('Doxxing / Personal Info Request');
          break;
        }
      }

      // Check Media Payload
      if (msg.media_type && msg.is_unsafe) {
        stepDelta += 35;
        stepFlag = 'Potentially Inappropriate Media';
        indicators.add('Unverified Sensitive Media');
      }
    }

    score = Math.min(100, Math.max(10, score + stepDelta));

    let level = 'LOW';
    if (score >= 75) level = 'HIGH';
    else if (score >= 40) level = 'MEDIUM';

    if (stepFlag) highestTrigger = stepFlag;

    progression.push({
      step: `Msg ${idx + 1}`,
      sender: msg.sender,
      textSnippet: text.length > 25 ? text.slice(0, 25) + '...' : text,
      score: score,
      level: level,
      flag: stepFlag
    });
  });

  let finalLevel = 'LOW';
  if (score >= 75) finalLevel = 'HIGH';
  else if (score >= 40) finalLevel = 'MEDIUM';

  const indicatorList = Array.from(indicators);

  let category = 'SAFE';
  if (indicators.has('Private Media Solicitation') || indicators.has('Secrecy Request') || indicators.has('Trust Exploitation')) {
    category = 'ONLINE_GROOMING';
  } else if (indicators.has('Threat & Extortion')) {
    category = 'CYBERBULLYING';
  } else if (indicators.has('Malicious Link Detection')) {
    category = 'MALICIOUS_PHISHING';
  } else if (indicators.has('Doxxing / Personal Info Request')) {
    category = 'PRIVACY_DOXXING';
  }

  // Recommendations
  const recommendations = [];
  if (finalLevel === 'HIGH') {
    recommendations.push({
      action: '🛑 STOP RESPONDING',
      detail: 'Do not send any photos, personal details, or further replies.'
    });
    recommendations.push({
      action: '🔒 QUICK BLOCK',
      detail: 'Block this user across all social platforms to prevent continuous contact.'
    });
    recommendations.push({
      action: '🛡️ FILE ANONYMOUS SOS',
      detail: 'Submit this report to SURAKSHA MESH to notify verified child advocates.'
    });
    recommendations.push({
      action: '💬 TALK TO A TRUSTED ADULT',
      detail: 'Show this conversation to a parent, guardian, or school teacher.'
    });
  } else if (finalLevel === 'MEDIUM') {
    recommendations.push({
      action: '⚠️ EXERCISE CAUTION',
      detail: 'Keep boundaries firm. Never share your live location or school name.'
    });
    recommendations.push({
      action: '🛡️ KEEP AI ACTIVE',
      detail: 'Maintain AI protection active for unknown contact monitoring.'
    });
  } else {
    recommendations.push({
      action: '✅ CONVERSATION APPEARS SAFE',
      detail: 'No risk indicators detected. AI remains in background monitoring mode.'
    });
  }

  return {
    score,
    level: finalLevel,
    category,
    indicators: indicatorList,
    progression,
    highestTrigger,
    recommendations,
    isUnder14: childAge < 14
  };
}

/**
 * AI Case Translator: Converts child's informal natural language testimony into structured triage
 */
export function translateChildTestimony(rawText, childAge = 'UNDER_14') {
  const textLower = rawText.toLowerCase();
  const detected = [];

  if (/secret|don'?t tell|chupao|kisi ko mat|ghar walo/i.test(textLower)) {
    detected.push({ tag: 'Secrecy Coercion', severity: 'HIGH' });
  }
  if (/photo|pic|camera|video|selfie|tasveer|bhejo/i.test(textLower)) {
    detected.push({ tag: 'Private Media Solicitation', severity: 'HIGH' });
  }
  if (/leak|post|ruin|hate|threat|blackmail|dhamki|sabko bata/i.test(textLower)) {
    detected.push({ tag: 'Extortion / Blackmail', severity: 'HIGH' });
  }
  if (/where i live|address|school|pata|location/i.test(textLower)) {
    detected.push({ tag: 'Personal Info Harvesting', severity: 'MEDIUM' });
  }
  if (/link|website|free|robux|diamonds/i.test(textLower)) {
    detected.push({ tag: 'Malicious Link / Scam', severity: 'MEDIUM' });
  }

  if (detected.length === 0) {
    detected.push({ tag: 'Uncomfortable Interaction', severity: 'LOW' });
  }

  const highCount = detected.filter(d => d.severity === 'HIGH').length;
  let riskScore = 40 + (highCount * 25) + (detected.length * 10);
  riskScore = Math.min(98, Math.max(25, riskScore));

  let urgency = 'P3 - Standard Advisory';
  if (riskScore >= 75) urgency = 'P1 - Immediate Intervention (High Risk)';
  else if (riskScore >= 50) urgency = 'P2 - Priority Review (Moderate Risk)';

  let category = 'OTHER_CONCERN';
  if (detected.some(d => d.tag.includes('Media') || d.tag.includes('Secrecy'))) {
    category = 'ONLINE_GROOMING';
  } else if (detected.some(d => d.tag.includes('Extortion') || d.tag.includes('Blackmail'))) {
    category = 'CYBERBULLYING';
  } else if (detected.some(d => d.tag.includes('Personal Info'))) {
    category = 'PRIVACY_DOXXING';
  }

  // Evidence extraction: snippetize sentences
  const snippets = rawText
    .split(/[.!?\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 8)
    .slice(0, 3);

  const assignedOrg = riskScore >= 75 ? 'Verified NGO & National Cyber Cell' : 'School Mental Health & Guidance Cell';

  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const caseCode = `SM-2026-${randomNum}`;

  return {
    caseCode,
    category,
    urgency,
    riskScore,
    detectedIndicators: detected.map(d => d.tag),
    evidenceSnippets: snippets.length > 0 ? snippets : [rawText.slice(0, 80) + '...'],
    structuredSummary: `Child reported emotional distress regarding ${category.replace('_', ' ').toLowerCase()}. Automated NLP identified ${detected.map(d => d.tag).join(', ')}.`,
    recommendedAction: 'Initiate trauma-informed outreach, shield victim anonymity, and archive encrypted forensic transcript.',
    assignedOrganization: assignedOrg,
    timestamp: new Date().toISOString()
  };
}

/**
 * OCR Screenshot Simulation Parser
 */
export function simulateOCRScan(imagePresetId) {
  const SAMPLES = {
    insta_dm: {
      title: 'Instagram Direct Message Screenshot',
      detectedText: [
        'Alex: Hey, you are so pretty for your age',
        'Alex: Do not tell your parents about our chat',
        'Alex: Send me a private selfie in your room right now'
      ],
      language: 'English (US)',
      confidence: '98.4%',
      boundingCount: 3,
      riskResult: {
        score: 91,
        level: 'HIGH',
        category: 'ONLINE_GROOMING',
        flags: ['Secrecy Demand', 'Private Media Solicitation', 'Flattery Grooming']
      }
    },
    indic_hinglish: {
      title: 'WhatsApp Hinglish Chat Screenshot',
      detectedText: [
        'Unknown: Tum bohot sweet ho',
        'Unknown: Ghar walo ko mat batana',
        'Unknown: Ek private photo bhejo jaldi'
      ],
      language: 'Hinglish / Hindi (Indic NLP)',
      confidence: '96.2%',
      boundingCount: 3,
      riskResult: {
        score: 88,
        level: 'HIGH',
        category: 'ONLINE_GROOMING',
        flags: ['Regional Secrecy Flag (घर वालों को मत बताना)', 'Private Photo Demand']
      }
    },
    youtube_hate: {
      title: 'Social Video Comment Section',
      detectedText: [
        'Troll_99: I know what school you go to, I will leak your photos tomorrow',
        'Troll_99: Nobody likes you, quit internet'
      ],
      language: 'English',
      confidence: '97.1%',
      boundingCount: 2,
      riskResult: {
        score: 94,
        level: 'HIGH',
        category: 'CYBERBULLYING',
        flags: ['Doxxing Threat', 'Targeted Harassment', 'Extortion']
      }
    }
  };

  return SAMPLES[imagePresetId] || SAMPLES.insta_dm;
}
