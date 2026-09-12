import lawsData from '../data/laws_dataset.json';

export const LegalMatchingService = {
  /**
   * Matches applicable Indian laws, POCSO/IT Act sections and Constitutional Articles
   * based on report category, observed tactics, and environment.
   */
  getApplicableLaws({ category = '', tactics = [], age = '', environment = 'Online', limit = 3 }) {
    const cleanCat = category.trim().toLowerCase();
    const cleanTactics = tactics.map(t => t.toLowerCase());

    const scored = lawsData.map(law => {
      let score = 0;
      let reasons = [];

      // Check category match
      for (const cat of law.categories || []) {
        if (cat.toLowerCase().includes(cleanCat) || cleanCat.includes(cat.toLowerCase())) {
          score += 50;
          reasons.push(`Violates legal standards for ${cat}`);
          break;
        }
      }

      // Check tactics match
      for (const lawTactic of law.tactics || []) {
        for (const userTactic of cleanTactics) {
          if (lawTactic.toLowerCase().includes(userTactic) || userTactic.includes(lawTactic.toLowerCase())) {
            score += 30;
            reasons.push(`Covers tactic: "${lawTactic}"`);
            break;
          }
        }
      }

      // Priority booster for POCSO & IT Act 67B in sexual/photo situations
      if (law.id.includes('POCSO') && (cleanCat.includes('grooming') || cleanCat.includes('photo') || cleanCat.includes('sexual') || cleanCat.includes('abuse'))) {
        score += 40;
      }
      if (law.id.includes('67B') && (cleanCat.includes('photo') || cleanCat.includes('extortion') || cleanCat.includes('grooming'))) {
        score += 40;
      }

      // Baseline Constitutional Guarantee
      if (law.section.includes('Article 21')) {
        score += 20;
      }

      return {
        ...law,
        matchScore: score,
        citationReason: reasons.slice(0, 2).join(' • ') || 'Applicable Child Safety Statutory Provision'
      };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    return scored.slice(0, limit);
  }
};
