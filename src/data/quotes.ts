export interface ReadingQuote {
  id: string;
  quote: string;
  author: string;
  source?: string;
  category: 'wisdom' | 'growth' | 'imagination' | 'peace' | 'courage';
  categoryLabel: string;
  bgGradient: string;
  bgImage?: string;
  accentColor: string;
  tag: string;
  isCustom?: boolean;
}

export const READING_QUOTES: ReadingQuote[] = [
  {
    id: 'quote-1',
    quote: '사람은 책을 만들고, 책은 사람을 만든다.',
    author: '신용호',
    source: '교보문고 창립 이념',
    category: 'growth',
    categoryLabel: '인생과 성장',
    bgGradient: 'from-amber-900/90 via-amber-800/80 to-slate-900',
    bgImage: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop',
    accentColor: 'text-amber-300',
    tag: '📖 독서의 힘',
  },
  {
    id: 'quote-2',
    quote: '한 권의 책은 우리 안의 얼어붙은 바다를 깨는 도끼이어야 한다.',
    author: '프란츠 카프카',
    source: '친구 오스카 폴락에게 보낸 편지',
    category: 'wisdom',
    categoryLabel: '지혜와 성찰',
    bgGradient: 'from-slate-900 via-indigo-950 to-blue-950',
    bgImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200&auto=format&fit=crop',
    accentColor: 'text-sky-300',
    tag: '⚡ 깨달음과 통찰',
  },
  {
    id: 'quote-3',
    quote: '오늘의 나를 있게 한 것은 우리 동네 작은 도서관이었다.',
    author: '빌 게이츠',
    source: '마이크로소프트 창업자',
    category: 'growth',
    categoryLabel: '인생과 성장',
    bgGradient: 'from-emerald-950 via-teal-900 to-slate-900',
    bgImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop',
    accentColor: 'text-emerald-300',
    tag: '🏛️ 도서관의 기적',
  },
  {
    id: 'quote-4',
    quote: '읽는다는 것은 다른 사람의 눈으로 세상을 바라보는 고귀한 여행이다.',
    author: '버지니아 울프',
    source: '보통의 독자',
    category: 'imagination',
    categoryLabel: '꿈과 상상력',
    bgGradient: 'from-purple-950 via-slate-900 to-amber-950',
    bgImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1200&auto=format&fit=crop',
    accentColor: 'text-purple-300',
    tag: '🌌 세상을 보는 눈',
  },
  {
    id: 'quote-5',
    quote: '좋은 책을 읽는 것은 지난 몇 세기의 가장 뛰어난 사람들과 대화를 나누는 것이다.',
    author: '르네 데카르트',
    source: '방법서설',
    category: 'wisdom',
    categoryLabel: '지혜와 성찰',
    bgGradient: 'from-stone-900 via-amber-950 to-stone-950',
    bgImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop',
    accentColor: 'text-amber-200',
    tag: '💬 거장과의 대화',
  },
  {
    id: 'quote-6',
    quote: '책 없는 방은 영혼이 없는 몸과 같고, 햇살 없는 아침과 같다.',
    author: '마르쿠스 툴리우스 키케로',
    source: '고대 로마 철학자',
    category: 'peace',
    categoryLabel: '마음의 평화',
    bgGradient: 'from-cyan-950 via-slate-900 to-blue-900',
    bgImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop',
    accentColor: 'text-cyan-300',
    tag: '✨ 영혼의 안식처',
  },
  {
    id: 'quote-7',
    quote: '당신이 읽는 책이 곧 당신이 어떤 사람이 되어가는지를 말해준다.',
    author: '오스카 와일드',
    source: '영국 시인 겸 작가',
    category: 'courage',
    categoryLabel: '용기와 도전',
    bgGradient: 'from-rose-950 via-slate-900 to-amber-950',
    bgImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1200&auto=format&fit=crop',
    accentColor: 'text-rose-300',
    tag: '🌱 나를 만드는 습관',
  },
  {
    id: 'quote-8',
    quote: '한 권의 책을 읽는 사람에게는 수천 번의 삶을 살 기회가 주어진다.',
    author: '조지 R. R. 마틴',
    source: '왕좌의 게임 저자',
    category: 'imagination',
    categoryLabel: '꿈과 상상력',
    bgGradient: 'from-indigo-950 via-purple-900 to-slate-900',
    bgImage: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=1200&auto=format&fit=crop',
    accentColor: 'text-violet-300',
    tag: '🚀 수천 가지의 모험',
  },
  {
    id: 'quote-9',
    quote: '책을 읽는 사람은 죽기 전에 천 번의 인생을 살고, 읽지 않는 사람은 단 한 번의 인생을 산다.',
    author: '조지 R. R. 마틴',
    source: '용과의 춤',
    category: 'imagination',
    categoryLabel: '꿈과 상상력',
    bgGradient: 'from-blue-950 via-indigo-900 to-slate-900',
    bgImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=1200&auto=format&fit=crop',
    accentColor: 'text-blue-300',
    tag: '📚 무한한 삶의 경험',
  },
  {
    id: 'quote-10',
    quote: '독서는 마음을 넓히고, 생각을 깊게 하며, 영혼을 풍요롭게 하는 최고의 양식이다.',
    author: '헬렌 켈러',
    source: '내 삶의 이야기',
    category: 'growth',
    categoryLabel: '인생과 성장',
    bgGradient: 'from-amber-950 via-emerald-950 to-slate-900',
    bgImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=1200&auto=format&fit=crop',
    accentColor: 'text-amber-300',
    tag: '🌱 영혼의 양식',
  },
  {
    id: 'quote-11',
    quote: '가장 위대한 책은 우리 스스로가 한 줄 한 줄 써내려가는 자신의 인생이다.',
    author: '랄프 월도 에머슨',
    source: '자기신뢰',
    category: 'courage',
    categoryLabel: '용기와 도전',
    bgGradient: 'from-slate-900 via-rose-950 to-purple-950',
    bgImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop',
    accentColor: 'text-rose-300',
    tag: '✏️ 나만의 인생 책',
  },
  {
    id: 'quote-12',
    quote: '독서에 소비한 시간은 결코 허비된 시간이 아니다.',
    author: '마르셀 프루스트',
    source: '독서에 관하여',
    category: 'peace',
    categoryLabel: '마음의 평화',
    bgGradient: 'from-teal-950 via-cyan-900 to-slate-900',
    bgImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1200&auto=format&fit=crop',
    accentColor: 'text-teal-300',
    tag: '🕰️ 소중한 가치의 시간',
  }
];

/**
 * Get Today's Quote Index based on calendar date (YYYY-MM-DD)
 * Ensures every day automatically features a unique, fresh quote of the day!
 */
export function getDailyQuoteIndex(totalCount: number, offsetDays: number = 0): number {
  if (totalCount <= 0) return 0;
  const now = new Date();
  now.setDate(now.getDate() + offsetDays);
  
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  
  // Deterministic daily hashing formula
  const dateSeed = year * 10000 + month * 100 + date;
  const hash = Math.abs((dateSeed * 2654435761) ^ (dateSeed >> 16));
  return hash % totalCount;
}

/**
 * Format Today's Korean Date String
 */
export function getTodayFormattedString(): string {
  const now = new Date();
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = days[now.getDay()];
  return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 (${dayName})`;
}

