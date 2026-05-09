import type { Prediction, AutocorrectResult } from '../types';

const COMMON_WORDS = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  'is', 'are', 'was', 'were', 'been', 'has', 'had', 'did', 'does', 'doing',
  'am', 'being', 'very', 'much', 'more', 'many', 'such', 'should', 'may', 'might',
  'must', 'shall', 'need', 'still', 'each', 'every', 'own', 'too', 'quite', 'rather',
];

const BIGRAMS: Record<string, string[]> = {
  'i': ['am', 'was', 'have', 'will', 'can', 'would', 'could', 'should', 'think', 'know'],
  'the': ['world', 'way', 'people', 'time', 'same', 'other', 'first', 'most', 'best', 'only'],
  'it': ['is', 'was', 'will', 'has', 'would', 'could', 'should', 'can', 'does', 'might'],
  'to': ['the', 'be', 'do', 'get', 'make', 'go', 'see', 'know', 'take', 'come'],
  'is': ['a', 'the', 'not', 'very', 'also', 'just', 'still', 'now', 'only', 'always'],
  'are': ['the', 'not', 'also', 'very', 'just', 'still', 'now', 'only', 'always', 'all'],
  'was': ['a', 'the', 'not', 'very', 'also', 'just', 'still', 'now', 'only', 'always'],
  'we': ['are', 'were', 'have', 'will', 'can', 'would', 'could', 'should', 'need', 'might'],
  'you': ['are', 'were', 'have', 'will', 'can', 'would', 'could', 'should', 'know', 'think'],
  'they': ['are', 'were', 'have', 'will', 'can', 'would', 'could', 'should', 'need', 'might'],
  'he': ['is', 'was', 'has', 'had', 'will', 'would', 'could', 'should', 'can', 'might'],
  'she': ['is', 'was', 'has', 'had', 'will', 'would', 'could', 'should', 'can', 'might'],
  'this': ['is', 'was', 'will', 'has', 'would', 'could', 'should', 'can', 'time', 'way'],
  'that': ['is', 'was', 'will', 'has', 'would', 'could', 'should', 'can', 'the', 'i'],
  'and': ['the', 'i', 'we', 'you', 'they', 'he', 'she', 'it', 'a', 'this'],
  'but': ['i', 'the', 'it', 'we', 'you', 'they', 'he', 'she', 'this', 'that'],
  'for': ['the', 'me', 'you', 'us', 'them', 'him', 'her', 'it', 'a', 'this'],
  'with': ['the', 'me', 'you', 'us', 'them', 'him', 'her', 'it', 'a', 'this'],
  'on': ['the', 'a', 'this', 'that', 'my', 'your', 'his', 'her', 'its', 'our'],
  'in': ['the', 'a', 'this', 'that', 'my', 'your', 'his', 'her', 'its', 'our'],
  'at': ['the', 'a', 'this', 'that', 'my', 'your', 'his', 'her', 'its', 'our'],
  'of': ['the', 'a', 'this', 'that', 'my', 'your', 'his', 'her', 'its', 'our'],
  'have': ['a', 'the', 'been', 'to', 'not', 'never', 'always', 'already', 'just', 'also'],
  'will': ['be', 'have', 'do', 'go', 'get', 'make', 'take', 'come', 'see', 'know'],
  'can': ['be', 'have', 'do', 'go', 'get', 'make', 'take', 'come', 'see', 'know'],
  'would': ['be', 'have', 'do', 'go', 'get', 'make', 'take', 'come', 'see', 'know'],
  'my': ['life', 'work', 'time', 'way', 'world', 'friend', 'family', 'home', 'heart', 'mind'],
  'your': ['life', 'work', 'time', 'way', 'world', 'friend', 'family', 'home', 'heart', 'mind'],
  'not': ['the', 'a', 'only', 'just', 'very', 'really', 'even', 'still', 'yet', 'always'],
  'how': ['to', 'do', 'you', 'many', 'much', 'long', 'far', 'often', 'well', 'about'],
  'what': ['is', 'was', 'are', 'were', 'do', 'does', 'did', 'will', 'would', 'could'],
  'when': ['i', 'you', 'we', 'they', 'he', 'she', 'it', 'the', 'this', 'that'],
  'where': ['is', 'was', 'are', 'were', 'do', 'does', 'did', 'will', 'would', 'could'],
  'why': ['is', 'was', 'are', 'were', 'do', 'does', 'did', 'will', 'would', 'could'],
};

const TRIGRAMS: Record<string, string[]> = {
  'i am': ['not', 'very', 'so', 'also', 'just', 'still', 'now', 'always', 'really', 'quite'],
  'i will': ['be', 'do', 'go', 'get', 'make', 'take', 'come', 'see', 'know', 'have'],
  'i have': ['been', 'a', 'the', 'not', 'never', 'always', 'already', 'just', 'also', 'to'],
  'i can': ['do', 'be', 'see', 'get', 'make', 'go', 'take', 'come', 'help', 'tell'],
  'i would': ['like', 'love', 'hate', 'say', 'think', 'hope', 'need', 'want', 'go', 'do'],
  'i think': ['that', 'i', 'we', 'you', 'they', 'he', 'she', 'it', 'this', 'the'],
  'i know': ['that', 'i', 'you', 'we', 'they', 'he', 'she', 'it', 'what', 'how'],
  'it is': ['a', 'the', 'not', 'very', 'also', 'just', 'still', 'now', 'only', 'always'],
  'it was': ['a', 'the', 'not', 'very', 'also', 'just', 'still', 'now', 'only', 'always'],
  'it will': ['be', 'have', 'do', 'go', 'get', 'make', 'take', 'come', 'see', 'know'],
  'that is': ['a', 'the', 'not', 'very', 'also', 'just', 'still', 'now', 'only', 'always'],
  'this is': ['a', 'the', 'not', 'very', 'also', 'just', 'still', 'now', 'only', 'always'],
  'we are': ['the', 'not', 'very', 'also', 'just', 'still', 'now', 'only', 'all', 'both'],
  'they are': ['the', 'not', 'very', 'also', 'just', 'still', 'now', 'only', 'all', 'both'],
  'you are': ['the', 'not', 'very', 'also', 'just', 'still', 'now', 'only', 'all', 'both'],
  'there is': ['a', 'the', 'no', 'not', 'only', 'also', 'just', 'still', 'now', 'always'],
  'there are': ['the', 'no', 'not', 'only', 'also', 'just', 'still', 'now', 'many', 'some'],
  'do not': ['know', 'think', 'want', 'need', 'have', 'go', 'get', 'make', 'take', 'come'],
  'to be': ['a', 'the', 'in', 'on', 'at', 'with', 'for', 'from', 'by', 'of'],
  'going to': ['be', 'do', 'go', 'get', 'make', 'take', 'come', 'see', 'know', 'have'],
  'want to': ['be', 'do', 'go', 'get', 'make', 'take', 'come', 'see', 'know', 'have'],
  'need to': ['be', 'do', 'go', 'get', 'make', 'take', 'come', 'see', 'know', 'have'],
  'have to': ['be', 'do', 'go', 'get', 'make', 'take', 'come', 'see', 'know', 'have'],
  'out of': ['the', 'this', 'that', 'my', 'your', 'his', 'her', 'its', 'our', 'their'],
  'one of': ['the', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'these', 'those'],
  'some of': ['the', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'these', 'those'],
};

const COMMON_MISSPELLINGS: Record<string, string> = {
  'teh': 'the', 'adn': 'and', 'taht': 'that', 'hte': 'the', 'nad': 'and',
  'thsi': 'this', 'si': 'is', 'ot': 'to', 'fo': 'of', 'wiht': 'with',
  'hten': 'then', 'jsut': 'just', 'liek': 'like', 'abuot': 'about',
  'whcih': 'which', 'hvae': 'have', 'ti': 'it', 'owrk': 'work',
  'fisrt': 'first', 'knoe': 'know', 'sefl': 'self', 'becuase': 'because',
  'recieve': 'receive', 'seperate': 'separate', 'definately': 'definitely',
  'occured': 'occurred', 'untill': 'until', 'accross': 'across', 'wierd': 'weird',
  'thier': 'their', 'freind': 'friend', 'neccessary': 'necessary',
  'occassion': 'occasion', 'accomodate': 'accommodate', 'embarass': 'embarrass',
  'goverment': 'government', 'enviroment': 'environment', 'independant': 'independent',
  'knowlege': 'knowledge', 'libary': 'library', 'mispell': 'misspell',
  'noticable': 'noticeable', 'paralel': 'parallel', 'privlege': 'privilege',
  'recomend': 'recommend', 'refered': 'referred', 'succesful': 'successful',
  'suprise': 'surprise', 'tommorow': 'tomorrow', 'truely': 'truly',
  'tyr': 'try', 'waht': 'what', 'yuo': 'you', 'yuor': 'your',
  'agian': 'again', 'alos': 'also', 'amke': 'make', 'awya': 'away',
  'bakc': 'back', 'bcak': 'back', 'beacuse': 'because', 'bve': 'be',
  'cna': 'can', 'comign': 'coming', 'coudl': 'could', 'didnt': "didn't",
  'doesnt': "doesn't", 'dont': "don't", 'eveyr': 'every', 'fial': 'fail',
  'fianlly': 'finally', 'gdo': 'do', 'goign': 'going', 'gonan': 'gonna',
  'gvie': 'give', 'hsa': 'has', 'hsould': 'should', 'idae': 'idea',
  'improtant': 'important', 'int': 'it', 'kwno': 'know', 'lgo': 'log',
  'lvoe': 'love', 'mroe': 'more', 'nwe': 'new', 'nwo': 'now',
  'ohter': 'other', 'onlny': 'only', 'porblem': 'problem',
  'realyl': 'really', 'rightt': 'right', 'sasy': 'says', 'seh': 'she',
  'smoe': 'some', 'soem': 'some', 'taek': 'take', 'tahn': 'than',
  'tehy': 'they', 'theri': 'their', 'thnig': 'thing', 'thnigs': 'things',
  'timne': 'time', 'tno': 'to', 'todasy': 'today', 'tpo': 'top',
  'tset': 'test', 'vrey': 'very', 'wacth': 'watch', 'wnat': 'want',
  'wrod': 'word', 'wroking': 'working', 'wrold': 'world', 'yera': 'year',
};

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^\w\s']/g, '').split(/\s+/).filter(Boolean);
}

export function predictNextWords(text: string, count: number = 3): Prediction[] {
  const tokens = tokenize(text);
  if (tokens.length === 0) {
    return COMMON_WORDS.slice(0, count).map((w, i) => ({
      word: w,
      confidence: 0.9 - i * 0.08,
    }));
  }

  const candidates: Map<string, number> = new Map();

  if (tokens.length >= 2) {
    const triKey = `${tokens[tokens.length - 2]} ${tokens[tokens.length - 1]}`;
    const triMatches = TRIGRAMS[triKey] || [];
    triMatches.forEach((w, i) => {
      candidates.set(w, (candidates.get(w) || 0) + 0.6 - i * 0.04);
    });
  }

  const biKey = tokens[tokens.length - 1];
  const biMatches = BIGRAMS[biKey] || [];
  biMatches.forEach((w, i) => {
    candidates.set(w, (candidates.get(w) || 0) + 0.35 - i * 0.025);
  });

  COMMON_WORDS.slice(0, 30).forEach((w, i) => {
    candidates.set(w, (candidates.get(w) || 0) + 0.05 - i * 0.001);
  });

  const sorted = [...candidates.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, count);

  const maxScore = sorted[0]?.[1] || 1;

  return sorted.map(([word, score]) => ({
    word,
    confidence: Math.min(0.99, Math.max(0.1, score / maxScore)),
  }));
}

export function autocorrect(word: string): AutocorrectResult {
  const lower = word.toLowerCase();

  if (COMMON_MISSPELLINGS[lower]) {
    return {
      original: word,
      corrected: COMMON_MISSPELLINGS[lower],
      confidence: 0.95,
      suggestions: [COMMON_MISSPELLINGS[lower]],
    };
  }

  if (COMMON_WORDS.includes(lower) || BIGRAMS[lower]) {
    return { original: word, corrected: word, confidence: 1.0, suggestions: [] };
  }

  const candidates = COMMON_WORDS
    .map((w) => ({ word: w, dist: levenshtein(lower, w) }))
    .filter((c) => c.dist <= 2 && c.dist > 0)
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 3);

  if (candidates.length === 0) {
    return { original: word, corrected: word, confidence: 1.0, suggestions: [] };
  }

  const best = candidates[0];
  const confidence = Math.max(0.3, 1 - best.dist * 0.25);

  return {
    original: word,
    corrected: best.word,
    confidence,
    suggestions: candidates.map((c) => c.word),
  };
}

export function completeSentence(text: string): string {
  const predictions = predictNextWords(text, 5);
  if (predictions.length === 0) return text;
  const words = predictions.slice(0, 3).map((p) => p.word);
  return text + ' ' + words.join(' ');
}

export function calculateWPM(charCount: number, durationMs: number): number {
  if (durationMs === 0) return 0;
  return Math.round((charCount / 5) / (durationMs / 60000));
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((correct / total) * 100);
}
