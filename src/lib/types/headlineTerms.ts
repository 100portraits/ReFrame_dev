// src/lib/data/headlineTerms.ts
export interface HeadlineTerm {
  patterns: (string | RegExp)[];
  explanation: string;
  category?: string; // For organization
}

export const headlineTerms: HeadlineTerm[] = [
  // DEATH-RELATED TERMS
  {
    patterns: [
      /\b(die|dies|died|dying|dead)\b/i,
      /\b(death|deaths)\b/i,
      /\b(fatal|fatally)\b/i,
      /\b(fatalities?)\b/i,
      /\b(life|lives)\s+(lost|claimed)\b/i,
    ],
    explanation: "Focuses on the outcome without explaining how it happened. It can make deaths seem spontaneous rather than the result of specific actions.",
    category: "outcome-focused"
  },

  // INJURY-RELATED TERMS
  {
    patterns: [
      /\b(injured?|injuries)\b/i,
      /\b(hurt)\b/i,
      /\b(wounded)\b/i,
      /\b(harmed)\b/i,
      /\b(hospitalized)\b/i,
      /\b(critical|serious)\s+(condition|injuries)\b/i
    ],
    explanation: "Describes the outcome but not the cause. Including who or what caused the injury provides clearer context.",
    category: "outcome-focused"
  },

  // PASSIVE CONSTRUCTIONS
  {
    patterns: [
      /\b(hit|struck|killed|injured|hurt)\b/i,
      /\b(was|were)\s+(hit|struck|killed|injured|hurt)\b/i,
      /\b(got|gets|getting)\s+(hit|struck|killed|injured)\b/i,
      /\b(been)\s+(hit|struck|killed|injured)\b/i,
      /\b(became|becomes)\s+victim\b/i,
      /\bfound\s+(dead|injured)\b/i
    ],
    explanation: "Passive voice removes the actor from the sentence. It can make it unclear who performed the action.",
    category: "passive-voice"
  },

  // ACTIVE VOICE VERBS
  {
    patterns: [
      /\b(strikes?)\b/i,
      /\b(hits?|hitting)\b/i,
      /\b(kills?|killing)\b/i,
      /\b(injures?|injuring)\b/i,
      /\b(crashes?|crashing)\s+into\b/i,
      /\b(ploughs?|ploughing)\s+into\b/i,
      /\b(runs?|ran|running)\s+(over|down|into)\b/i,
      /\b(collides?|collided|colliding)\s+with\b/i
    ],
    explanation: "Active voice clearly shows who performed the action. This helps readers understand the sequence of events.",
    category: "active-voice"
  },

  // VEHICLE AS SUBJECT
  {
    patterns: [
      /\b(car|truck|vehicle|van|bus|SUV|sedan|pickup|lorry|semi|motorcycle|scooter|moped)\s+(hits?|strikes?|kills?|injures?|crashes?|collides?|plou?ghs?|slams?|runs?\s+over|runs?\s+down|mows?\s+down)/i,
      /\b(car|truck|vehicle|van|bus|SUV|sedan|pickup|lorry|semi|motorcycle|scooter|moped)\s+(involved|responsible)/i
    ],
    explanation: "Treats the vehicle as if it acted on its own. Vehicles don't drive themselves. People do.",
    category: "vehicle-agency"
  },

  // HUMAN-CENTERED LANGUAGE
  {
    patterns: [
      /\b(man|woman|person|child|teenager|boy|girl|toddler|infant|adult|elderly)\b/i,
      /\b(man|woman|person|teenager)\s+(driving|operating)\s+(car|truck|vehicle|van|bus|SUV|sedan|pickup|lorry|semi|motorcycle|scooter|moped)\b/i,
      /\b(mother|father|parent|student|worker|resident)\b/i,
      /\b\d+[\s-]?year[\s-]?old\b/i
    ],
    explanation: "Human term that helps readers connect with the people affected.",
    category: "humanization"
  },

  //VEHICLE_TERMS
  {
    patterns: [
      /\b(car|truck|vehicle|van|bus|SUV|taxi|sedan|pickup|lorry|semi|motorcycle|scooter|moped)\b/i,
    ],
    explanation: "When used without human context, vehicle terms make the story feel mechanical rather than human.",
    category: "vehicle-terms"
  },

  // ROLE-BASED TERMS
  {
    patterns: [
      /\b(driver|motorist|operator)\s+(of|in)\s+(the\s+)?(car|truck|vehicle|van|bus|SUV|sedan|pickup|lorry|semi|taxi)/i,
      /\b(car|truck|bus|taxi)\s+(driver|motorist|operator)\b/i,
      /\b(cyclist|bicyclist|biker)\b/i,
      /\b(pedestrian|walker|jogger|runner)\b/i,
      /\b(motorist|driver)\b/i,
      /\b(motorcyclist)\b/i,
    ],
    explanation: "Identifes people by their specific roles and activities rather than just their vehicles.",
    category: "role-based"
  },

  // CRASH TERMINOLOGY
  {
    patterns: [
      /\b(accidents?)\b/i,
      /\b(mishaps?)\b/i
    ],
    explanation: "'Accident' suggests something unavoidable. Most crashes result from specific actions or choices, not random chance.",
    category: "crash-terminology"
  },

  {
    patterns: [
      /\b(crash|crashes|crashed|crashing)\b/i,
      /\b(collision|collisions)\b/i,
    ],
    explanation: "Describes the event without suggesting it was inevitable or unavoidable.",
    category: "crash-terminology"
  },

  // BLAME/JUDGMENT LANGUAGE
  {
    patterns: [
      /\b(jaywalking|jaywalked|jaywalker)\b/i,
      /\b(darted?|darting)\s+(out|into|across)\b/i,
      /\b(ran|runs?|running)\s+(into\s+)?(traffic|street|road)\b/i,
      /\b(failed\s+to|failure\s+to)\s+(yield|stop|signal|look)\b/i,
      /\b(reckless|careless|negligent|irresponsible)\b/i,
      /\b(at\s+fault|to\s+blame|responsible\s+for)\b/i
    ],
    explanation: "This language assigns blame and shifts focus away from the root causes that make our streets dangerous.",
    category: "blame"
  },

  // AGENCY INDICATORS
  {
    patterns: [
      /\b(caused|causing|causes)\b/i,
      /\b(resulted\s+in|resulting\s+in)\b/i,
      /\b(led\s+to|leading\s+to)\b/i,
      /\b(responsible\s+for)\b/i
    ],
    explanation: "Helps establish cause and effect, making it clear how events unfolded.",
    category: "agency"
  },

  // STATISTICAL/CLINICAL LANGUAGE
  {
    patterns: [
      /\b\d+\s+(killed|dead|died|injured|hurt)\b/i,
    ],
    explanation: "Numbers alone can make tragedies feel abstract and distance readers from the human impact of crashes.",
    category: "statistical"
  },

  // TRAFFIC DISRUPTION FOCUS
  {
    patterns: [
      /\b(traffic|commute|delays?|delayed|congestion|blocked|blocking|backs?\s+up|backed\s+up|disrupted|disruption|closed|closure)\b/gi,
      /\b(hours|minutes)\s+(of\s+)?delays?\b/gi,
      /\bmajor\s+(delays?|disruption|impact\s+on\s+traffic)\b/gi,
      /\b(avoid\s+the\s+area|seek\s+alternate\s+routes?|plan\s+extra\s+time)\b/gi
    ],
    explanation: "Treats crashes as traffic problems rather than human tragedies.",
    category: "traffic-focus"
  },
  
];

// Helper function with improved overlap handling
export function findHeadlineTerms(headline: string): Array<{
  text: string;
  explanation: string;
  startIndex: number;
  endIndex: number;
  category?: string;
}> {
  const found: Array<{
    text: string;
    explanation: string;
    startIndex: number;
    endIndex: number;
    category?: string;
    priority: number;
  }> = [];
  
  // Priority order (higher number = higher priority)
  const categoryPriority: Record<string, number> = {
    'active-voice': 5,
    'passive-voice': 5,
    'vehicle-agency': 4,
    'humanization': 3,
    'blame': 3,
    'outcome-focused': 2,
    'role-based': 2,
    'vehicle-terms': 1,
    'crash-terminology': 1,
    'statistical': 1,
    'agency': 1,
    'traffic-focus': 1,
  };
  
  for (const term of headlineTerms) {
    for (const pattern of term.patterns) {
      const regex = typeof pattern === 'string' 
        ? new RegExp(`\\b${pattern}\\b`, 'gi')
        : new RegExp(pattern.source, 'gi');
        
      const matches = headline.matchAll(regex);
      
      for (const match of matches) {
        if (match.index !== undefined && match[0]) {
          found.push({
            text: match[0],
            explanation: term.explanation,
            startIndex: match.index,
            endIndex: match.index + match[0].length,
            category: term.category,
            priority: categoryPriority[term.category || ''] || 0
          });
        }
      }
    }
  }
  
  // Sort by start index, then by priority for overlaps
  found.sort((a, b) => {
    if (a.startIndex !== b.startIndex) {
      return a.startIndex - b.startIndex;
    }
    return b.priority - a.priority;
  });
  
  // Remove overlaps, keeping higher priority terms
  const nonOverlapping: typeof found = [];
  let lastEnd = -1;
  
  for (const item of found) {
    if (item.startIndex >= lastEnd) {
      nonOverlapping.push(item);
      lastEnd = item.endIndex;
    }
  }
  
  // Remove priority from final output
  return nonOverlapping.map(({ priority, ...item }) => item);
}

// Function to test coverage on a headline
export function analyzeHeadlineCoverage(headline: string): {
  original: string;
  termsFound: number;
  coverage: string;
} {
  const terms = findHeadlineTerms(headline);
  const coverage = headline.split('').map((char, idx) => {
    const isCovered = terms.some(t => idx >= t.startIndex && idx < t.endIndex);
    return isCovered ? '█' : char;
  }).join('');
  
  return {
    original: headline,
    termsFound: terms.length,
    coverage
  };
}