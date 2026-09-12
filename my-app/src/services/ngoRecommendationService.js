import ngosData from '../data/ngos_india.json';

export const NgoRecommendationService = {
  /**
   * Recommend NGOs and support organizations based on:
   * - Location (City, District, State)
   * - Threat type / Services required (Cyber, Abuse, Counseling, Legal)
   */
  getRecommendations({ city = '', district = '', state = '', category = '', limit = 4 }) {
    const cleanCity = city.trim().toLowerCase();
    const cleanDistrict = district.trim().toLowerCase();
    const cleanState = state.trim().toLowerCase();
    const cleanCategory = category.trim().toLowerCase();

    // Determine if cyber support or sexual abuse support is prioritized
    const needsCyber = cleanCategory.includes('cyber') || cleanCategory.includes('grooming') || cleanCategory.includes('photo') || cleanCategory.includes('extortion') || cleanCategory.includes('blackmail');
    const needsSexualAbuse = cleanCategory.includes('sexual') || cleanCategory.includes('abuse') || cleanCategory.includes('pocso') || cleanCategory.includes('photo');

    const scoredNgos = ngosData
      .filter(ngo => ngo.active)
      .map(ngo => {
        let score = 0;
        let matchReason = [];

        const ngoCity = (ngo.city || '').toLowerCase();
        const ngoDistrict = (ngo.district || '').toLowerCase();
        const ngoState = (ngo.state || '').toLowerCase();

        // 1. Location match
        if (cleanCity && ngoCity && (ngoCity.includes(cleanCity) || cleanCity.includes(ngoCity))) {
          score += 100;
          matchReason.push(`Located directly in ${ngo.city}`);
        } else if (cleanDistrict && ngoDistrict && (ngoDistrict.includes(cleanDistrict) || cleanDistrict.includes(ngoDistrict))) {
          score += 80;
          matchReason.push(`District support in ${ngo.district}`);
        } else if (cleanState && ngoState && (ngoState.includes(cleanState) || cleanState.includes(ngoState))) {
          score += 50;
          matchReason.push(`State organization for ${ngo.state}`);
        } else if (ngo.state === 'All India') {
          score += 30;
          matchReason.push('National Emergency & Statutory Service');
        }

        // 2. Service specialization match
        if (needsCyber && ngo.cyber_support) {
          score += 40;
          matchReason.push('Specialized in Cyber Abuse & Digital Safety');
        }
        if (needsSexualAbuse && ngo.sexual_abuse_support) {
          score += 35;
          matchReason.push('POCSO & Abuse Trauma Support');
        }
        if (ngo.counselling) {
          score += 15;
        }
        if (ngo.legal_aid) {
          score += 15;
        }

        return {
          ...ngo,
          relevanceScore: score,
          matchReason: matchReason.join(' • ') || 'Verified Child Support Provider'
        };
      });

    // Sort by relevance score descending
    scoredNgos.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Guarantee that at least 1 local/state and 1 national resource are included
    const localMatches = scoredNgos.filter(n => n.state !== 'All India');
    const nationalMatches = scoredNgos.filter(n => n.state === 'All India');

    const combined = [];
    if (localMatches.length > 0) {
      combined.push(...localMatches.slice(0, 3));
    }
    if (nationalMatches.length > 0) {
      // Add Childline 1098 or 1930
      combined.push(...nationalMatches.slice(0, 2));
    }

    // Deduplicate by organization_name
    const seen = new Set();
    const finalResult = [];
    for (const ngo of (combined.length > 0 ? combined : scoredNgos)) {
      if (!seen.has(ngo.organization_name)) {
        seen.add(ngo.organization_name);
        finalResult.push(ngo);
      }
      if (finalResult.length >= limit) break;
    }

    return finalResult;
  }
};
