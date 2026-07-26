import React, { useState, useEffect, useRef } from 'react';
import { 
  Quote, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, 
  Sparkles, Copy, Heart, Shuffle, BookOpen, BookmarkCheck, Grid, Layers, Check, Share2
} from 'lucide-react';
import { READING_QUOTES, ReadingQuote } from '../data/quotes';

interface ReadingQuotesHeroProps {
  onQuoteSelectForLog?: (quoteText: string, author: string) => void;
}

export const ReadingQuotesHero: React.FC<ReadingQuotesHeroProps> = ({ onQuoteSelectForLog }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [isShuffling, setIsShuffling] = useState<boolean>(false);

  // Filter quotes by category
  const filteredQuotes = React.useMemo(() => {
    if (selectedCategory === 'all') return READING_QUOTES;
    return READING_QUOTES.filter(q => q.category === selectedCategory);
  }, [selectedCategory]);

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  // Current Quote object
  const currentQuote = filteredQuotes[currentIndex] || filteredQuotes[0] || READING_QUOTES[0];

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying || filteredQuotes.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredQuotes.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPlaying, filteredQuotes.length, currentIndex]);

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

  const handleRandomQuote = () => {
    setIsShuffling(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      setCurrentIndex(randomIndex);
      setIsShuffling(false);
    }, 300);
  };

  const handleCopy = (quoteObj: ReadingQuote) => {
    const textToCopy = `"${quoteObj.quote}" - ${quoteObj.author} (${quoteObj.source || '독서 명언'})`;
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
    utterance.rate = 0.9; // 약간 여유로운 낭독 톤
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-2xl border border-amber-950/40 mb-8">
      {/* Decorative Warm Bookstore Background Mesh */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-950/80 via-slate-900/90 to-indigo-950/80 z-0 pointer-events-none" />

      {/* Top Banner Control Bar */}
      <div className="relative z-10 px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-amber-100 flex items-center gap-1.5">
              <span>온라인 책방 & 감성 독서 서재</span>
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-sans">
                Quote Lounge
              </span>
            </h2>
            <p className="text-[11px] text-amber-200/70 hidden sm:block">
              책 속의 지혜와 마음을 움직이는 명언 모음집
            </p>
          </div>
        </div>

        {/* View Mode & Shuffle Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRandomQuote}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 transition-all ${
              isShuffling ? 'rotate-180 scale-95' : ''
            }`}
            title="오늘의 즉석 명언 랜덤 뽑기"
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">랜덤 명언 뽑기</span>
          </button>

          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('carousel')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'carousel'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-amber-200/70 hover:text-white'
              }`}
              title="큰 슬라이드 뷰"
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-amber-200/70 hover:text-white'
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
        <span className="text-xs text-amber-200/60 font-medium shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>주제:</span>
        </span>
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          ✨ 전체 명언 ({READING_QUOTES.length})
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
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
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
          {/* Background Photo Image Overlay with Parallax/Blur */}
          {currentQuote.bgImage && (
            <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay">
              <img
                src={currentQuote.bgImage}
                alt={currentQuote.author}
                className="w-full h-full object-cover filter blur-[1px] scale-105 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Quote Header Tag & Actions */}
          <div className="relative z-10 flex items-center justify-between gap-4 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-300/30 backdrop-blur-md">
              <span>{currentQuote.tag}</span>
              <span className="opacity-40">•</span>
              <span className="text-[11px] font-normal text-amber-200">{currentQuote.categoryLabel}</span>
            </span>

            {/* Quote Action Toolbar */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSpeech(currentQuote)}
                className={`p-2 rounded-xl transition-all ${
                  isSpeaking
                    ? 'bg-amber-400 text-slate-950 animate-pulse'
                    : 'bg-white/10 text-amber-100 hover:bg-white/20'
                }`}
                title="명언 음성으로 듣기 (낭독)"
              >
                {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => handleCopy(currentQuote)}
                className="p-2 rounded-xl bg-white/10 text-amber-100 hover:bg-white/20 transition-all"
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
                className={`p-2 rounded-xl transition-all ${
                  likedIds.includes(currentQuote.id)
                    ? 'bg-rose-500/30 text-rose-300 border border-rose-400/40'
                    : 'bg-white/10 text-amber-100 hover:bg-white/20'
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
              <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400/40 shrink-0 rotate-180 -mt-1" />
              <div className="space-y-3">
                <blockquote className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-amber-50 leading-relaxed drop-shadow-md">
                  "{currentQuote.quote}"
                </blockquote>
                <div className="flex items-center gap-2 pt-1">
                  <span className="w-6 h-0.5 bg-amber-400/60 rounded-full" />
                  <p className="text-sm sm:text-base font-semibold text-amber-200">
                    {currentQuote.author}
                    {currentQuote.source && (
                      <span className="text-xs font-normal text-amber-200/70 ml-2">
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
                className="p-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-400/30 transition-all text-xs font-medium flex items-center gap-1.5"
                title={isPlaying ? '자동 넘김 일시정지' : '자동 넘김 시작'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isPlaying ? '일시정지' : '재생'}</span>
              </button>

              {/* Indicator Dots */}
              <div className="flex items-center gap-1.5">
                {filteredQuotes.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentIndex
                        ? 'w-6 bg-amber-400'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    title={`${idx + 1}번째 명언 보기`}
                  />
                ))}
              </div>
            </div>

            {/* Next / Prev Controls */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-amber-200/60 font-mono mr-2">
                {currentIndex + 1} / {filteredQuotes.length}
              </span>
              <button
                onClick={handlePrev}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-100 transition-all active:scale-95"
                title="이전 명언"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-100 transition-all active:scale-95"
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
                className={`p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
                  likedIds.includes(q.id) ? 'bg-amber-950/30 border-amber-400/40' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30">
                      {q.tag}
                    </span>
                    <button
                      onClick={() => handleToggleLike(q.id)}
                      className="text-amber-200/60 hover:text-rose-400 transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${likedIds.includes(q.id) ? 'fill-rose-400 text-rose-400' : ''}`} />
                    </button>
                  </div>
                  <p className="font-bold text-amber-50 text-sm leading-snug mb-3">
                    "{q.quote}"
                  </p>
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-amber-200/70">
                  <span className="font-semibold text-amber-200">{q.author}</span>
                  <button
                    onClick={() => handleCopy(q)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-amber-300 transition-colors"
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
    </div>
  );
};
