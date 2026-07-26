import React, { useState, useEffect, useRef } from 'react';
import { 
  Quote, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, 
  Sparkles, Copy, Heart, Shuffle, BookOpen, BookmarkCheck, Grid, Layers, Check, Share2,
  Calendar, Plus, X, RotateCcw
} from 'lucide-react';
import { READING_QUOTES, ReadingQuote, getDailyQuoteIndex, getTodayFormattedString } from '../data/quotes';

interface ReadingQuotesHeroProps {
  onQuoteSelectForLog?: (quoteText: string, author: string) => void;
}

export const ReadingQuotesHero: React.FC<ReadingQuotesHeroProps> = ({ onQuoteSelectForLog }) => {
  // Load custom quotes from localStorage
  const [quotesList, setQuotesList] = useState<ReadingQuote[]>(() => {
    try {
      const saved = localStorage.getItem('custom_reading_quotes');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...READING_QUOTES, ...parsed];
      }
    } catch (e) {
      console.error(e);
    }
    return READING_QUOTES;
  });

  const todayDateString = getTodayFormattedString();
  const todayQuoteIndex = React.useMemo(() => {
    return getDailyQuoteIndex(quotesList.length);
  }, [quotesList.length]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(todayQuoteIndex);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Custom Quote Add Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newQuote, setNewQuote] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newSource, setNewSource] = useState('');
  const [newTag, setNewTag] = useState('📖 오늘의 명언');

  // Filter quotes by category
  const filteredQuotes = React.useMemo(() => {
    if (selectedCategory === 'all') return quotesList;
    return quotesList.filter(q => q.category === selectedCategory);
  }, [selectedCategory, quotesList]);

  // Current Quote object
  const currentQuote = filteredQuotes[currentIndex] || filteredQuotes[0] || quotesList[0];
  const isTodayQuote = currentQuote?.id === quotesList[todayQuoteIndex]?.id;

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying || filteredQuotes.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredQuotes.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [isPlaying, filteredQuotes.length]);

  // Stop TTS when quote changes
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredQuotes.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredQuotes.length) % filteredQuotes.length);
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleGoToTodayQuote = () => {
    setSelectedCategory('all');
    setCurrentIndex(todayQuoteIndex);
  };

  const handleRandomQuote = () => {
    setIsShuffling(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      setCurrentIndex(randomIndex);
      setIsShuffling(false);
    }, 300);
  };

  const handleCopy = (quoteObj: ReadingQuote) => {
    const textToCopy = `"${quoteObj.quote}" - ${quoteObj.author}${quoteObj.source ? ` (${quoteObj.source})` : ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(quoteObj.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleLike = (id: string) => {
    setLikedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSpeech = (quoteObj: ReadingQuote) => {
    if (!('speechSynthesis' in window)) {
      alert('사용 중인 브라우저가 음성 재생(TTS)을 지원하지 않습니다.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = `${quoteObj.quote}. 작가 ${quoteObj.author}.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.9;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Add custom quote
  const handleAddCustomQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuote.trim() || !newAuthor.trim()) return;

    const created: ReadingQuote = {
      id: `custom-${Date.now()}`,
      quote: newQuote.trim(),
      author: newAuthor.trim(),
      source: newSource.trim() || '내가 직접 등록한 명언',
      category: 'growth',
      categoryLabel: '인생과 성장',
      bgGradient: 'from-amber-900 via-indigo-950 to-slate-900',
      accentColor: 'text-amber-300',
      tag: newTag.trim() || '✨ 커스텀 명언',
      isCustom: true,
    };

    const updated = [created, ...quotesList];
    setQuotesList(updated);

    try {
      const customOnly = updated.filter(q => q.isCustom);
      localStorage.setItem('custom_reading_quotes', JSON.stringify(customOnly));
    } catch (err) {
      console.error(err);
    }

    setNewQuote('');
    setNewAuthor('');
    setNewSource('');
    setIsAddModalOpen(false);
    setSelectedCategory('all');
    setCurrentIndex(0); // Show newly added quote immediately
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-2xl border border-indigo-950/40 mb-8">
      {/* Decorative Dark Canvas Background Mesh */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-indigo-950/90 to-slate-950 z-0 pointer-events-none" />

      {/* Top Banner Control Bar */}
      <div className="relative z-10 px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-2">
              <span>오늘의 독서 명언 서재</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-sans">
                Daily Quote
              </span>
            </h2>
            <p className="text-xs text-indigo-200/80 flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-300" />
              <span>{todayDateString}</span>
            </p>
          </div>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Return to Today's Quote Button */}
          {!isTodayQuote && (
            <button
              onClick={handleGoToTodayQuote}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-300/40 transition-all cursor-pointer animate-pulse"
              title="오늘 날짜의 명언으로 바로 이동"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
              <span>오늘의 명언 보기</span>
            </button>
          )}

          {/* Add Custom Quote Modal Trigger */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-500/30 hover:bg-indigo-500/40 text-indigo-100 border border-indigo-400/40 transition-all cursor-pointer"
            title="나만의 독서 명언 등록하기"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-200" />
            <span className="hidden sm:inline">명언 추가</span>
          </button>

          <button
            onClick={handleRandomQuote}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-all cursor-pointer ${
              isShuffling ? 'rotate-180 scale-95' : ''
            }`}
            title="랜덤 명언 뽑기"
          >
            <Shuffle className="w-3.5 h-3.5 text-indigo-300" />
            <span className="hidden sm:inline">랜덤 뽑기</span>
          </button>

          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('carousel')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'carousel'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-indigo-200/70 hover:text-white'
              }`}
              title="큰 슬라이드 뷰"
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-indigo-200/70 hover:text-white'
              }`}
              title="명언 카드 카탈로그 뷰"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="relative z-10 px-6 py-3 bg-black/30 backdrop-blur-xs flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-white/5">
        <span className="text-xs text-indigo-200/70 font-medium shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>주제:</span>
        </span>
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          ✨ 전체 명언 ({quotesList.length})
        </button>
        {[
          { id: 'growth', label: '🌱 인생과 성장' },
          { id: 'wisdom', label: '💡 지혜와 성찰' },
          { id: 'imagination', label: '🚀 꿈과 상상력' },
          { id: 'peace', label: '🕊️ 마음의 평화' },
          { id: 'courage', label: '⚡ 용기와 도전' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Showcase Area */}
      {viewMode === 'carousel' ? (
        <div className="relative z-10 p-6 sm:p-10 min-h-[280px] sm:min-h-[320px] flex flex-col justify-between overflow-hidden">
          {/* Background Photo Image Overlay */}
          {currentQuote.bgImage && !imageErrors[currentQuote.id] && (
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <img
                src={currentQuote.bgImage}
                alt={currentQuote.author}
                onError={() => setImageErrors(prev => ({ ...prev, [currentQuote.id]: true }))}
                className="w-full h-full object-cover opacity-65 filter contrast-105 brightness-105 transition-all duration-700 scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-slate-950/50" />
            </div>
          )}

          {/* Quote Header Tag & Actions */}
          <div className="relative z-10 flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/25 text-indigo-200 border border-indigo-400/30 backdrop-blur-md">
                <span>{currentQuote.tag}</span>
                <span className="opacity-40">•</span>
                <span className="text-[11px] font-normal text-indigo-200">{currentQuote.categoryLabel}</span>
              </span>

              {isTodayQuote && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-400 text-slate-950 shadow-md">
                  🌟 오늘의 추천 명언
                </span>
              )}
            </div>

            {/* Quote Action Toolbar */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSpeech(currentQuote)}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isSpeaking
                    ? 'bg-indigo-500 text-white animate-pulse'
                    : 'bg-white/10 text-indigo-100 hover:bg-white/20'
                }`}
                title="명언 음성으로 듣기 (낭독)"
              >
                {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => handleCopy(currentQuote)}
                className="p-2 rounded-xl bg-white/10 text-indigo-100 hover:bg-white/20 transition-all cursor-pointer"
                title="명언 복사하기"
              >
                {copiedId === currentQuote.id ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={() => handleToggleLike(currentQuote.id)}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  likedIds.includes(currentQuote.id)
                    ? 'bg-rose-500/30 text-rose-300 border border-rose-400/40'
                    : 'bg-white/10 text-indigo-100 hover:bg-white/20'
                }`}
                title="마음에 드는 명언 보관"
              >
                <Heart className={`w-4 h-4 ${likedIds.includes(currentQuote.id) ? 'fill-rose-400 text-rose-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Large Emotional Quote Display */}
          <div className="relative z-10 my-auto py-2">
            <div className="flex items-start gap-3">
              <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-300/60 shrink-0 rotate-180 -mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
              <div className="space-y-3">
                <blockquote className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  "{currentQuote.quote}"
                </blockquote>
                <div className="flex items-center gap-2 pt-1">
                  <span className="w-6 h-0.5 bg-indigo-400/80 rounded-full shadow-xs" />
                  <p className="text-sm sm:text-base font-bold text-amber-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                    {currentQuote.author}
                    {currentQuote.source && (
                      <span className="text-xs font-normal text-indigo-100 ml-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                        ({currentQuote.source})
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Carousel Navigation Bar */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between gap-4 mt-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleTogglePlay}
                className="p-2 rounded-xl bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30 border border-indigo-400/30 transition-all text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                title={isPlaying ? '자동 넘김 일시정지' : '자동 넘김 시작'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isPlaying ? '일시정지' : '재생'}</span>
              </button>

              {/* Indicator Dots */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-[200px] sm:max-w-none">
                {filteredQuotes.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex
                        ? 'w-6 bg-indigo-400'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    title={`${idx + 1}번째 명언 보기`}
                  />
                ))}
              </div>
            </div>

            {/* Next / Prev Controls */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-indigo-200/60 font-mono mr-2">
                {currentIndex + 1} / {filteredQuotes.length}
              </span>
              <button
                onClick={handlePrev}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-100 transition-all active:scale-95 cursor-pointer"
                title="이전 명언"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-100 transition-all active:scale-95 cursor-pointer"
                title="다음 명언"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Grid Catalog View */
        <div className="relative z-10 p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuotes.map((q) => (
              <div
                key={q.id}
                className={`p-5 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-indigo-400/50 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
                  likedIds.includes(q.id) ? 'border-indigo-400/60 ring-1 ring-indigo-400/30' : ''
                }`}
              >
                {/* Card Background Image */}
                {q.bgImage && !imageErrors[q.id] && (
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img
                      src={q.bgImage}
                      alt={q.author}
                      onError={() => setImageErrors(prev => ({ ...prev, [q.id]: true }))}
                      className="w-full h-full object-cover opacity-35 group-hover:opacity-55 filter contrast-105 brightness-105 transition-all duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/60" />
                  </div>
                )}

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-300/40 backdrop-blur-xs">
                      {q.tag}
                    </span>
                    <button
                      onClick={() => handleToggleLike(q.id)}
                      className="text-indigo-200/80 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Heart className={`w-4 h-4 ${likedIds.includes(q.id) ? 'fill-rose-400 text-rose-400' : ''}`} />
                    </button>
                  </div>
                  <p className="font-bold text-white text-sm leading-snug mb-3 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    "{q.quote}"
                  </p>
                </div>
                <div className="relative z-10 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-indigo-200/80">
                  <span className="font-bold text-amber-200 drop-shadow-xs">{q.author}</span>
                  <button
                    onClick={() => handleCopy(q)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-indigo-200 transition-colors cursor-pointer"
                    title="명언 복사"
                  >
                    {copiedId === q.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Quote Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-white space-y-5 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold flex items-center gap-2 text-indigo-300">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>나만의 독서 명언 추가하기</span>
              </h3>
              <p className="text-xs text-slate-400">
                좋아하는 구절이나 학급에 전하고 싶은 감명 깊은 명언을 등록해보세요.
              </p>
            </div>

            <form onSubmit={handleAddCustomQuote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-indigo-200 mb-1.5">
                  명언 / 독서 구절 내용 <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={newQuote}
                  onChange={(e) => setNewQuote(e.target.value)}
                  placeholder="예: 책을 펼치면 새로운 세계의 문이 열린다."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-indigo-200 mb-1.5">
                    작가 / 인물 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="예: 김독서 선생님"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-indigo-200 mb-1.5">
                    태그 / 주제
                  </label>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="예: 📖 학급 명언"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-indigo-200 mb-1.5">
                  출처 / 도서명 (선택)
                </label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="예: 독서록 노하우 3장"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  명언 등록 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

