import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, BookOpen, Crown, Trophy, Filter, RefreshCw, Building2, User, 
  Tag, PenTool, ExternalLink, AlertCircle, Sparkles, ChevronDown, ChevronUp,
  Bookmark, ArrowUpDown, Check, Info, Layers
} from 'lucide-react';
import { Yes24Book } from '../types';

const YES24_GAS_URL = 'https://script.google.com/macros/s/AKfycbwrrL-qXGoZ7ZkYgR4jOSADT3Dppw8DzgGyk3JZM2k3TnAQV8TG2PPE97v1_LI_lojb/exec';

interface Yes24BestsellersProps {
  onSelectBookForLog?: (book: { title: string; author: string; publisher: string; category?: string }) => void;
}

export const Yes24Bestsellers: React.FC<Yes24BestsellersProps> = ({ onSelectBookForLog }) => {
  const [books, setBooks] = useState<Yes24Book[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rank' | 'title' | 'author'>('rank');

  // Expanded descriptions map
  const [expandedIds, setExpandedIds] = useState<Record<number, boolean>>({});

  // Fetch Bestseller Data from GAS
  const fetchBestsellers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(YES24_GAS_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`서버 응답 오류 (상태 코드: ${response.status})`);
      }

      const result = await response.json();

      if (result.status === 'success' && Array.isArray(result.data)) {
        setBooks(result.data);
        setTotalCount(result.totalCount || result.data.length);
        setLastUpdated(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
      } else {
        throw new Error('데이터 형식이 올바르지 않습니다.');
      }
    } catch (err: any) {
      console.error('YES24 베스트셀러 불러오기 실패:', err);
      setError(err.message || '베스트셀러 데이터를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBestsellers();
  }, []);

  // Extract unique categories from fetched dataset
  const categories = useMemo(() => {
    const catsSet = new Set<string>();
    books.forEach(b => {
      if (b.category && b.category.trim()) {
        catsSet.add(b.category.trim());
      }
    });
    return Array.from(catsSet).sort();
  }, [books]);

  // Filtered & Sorted books list
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter(b => b.category === selectedCategory);
    }

    // Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(b => 
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.publisher.toLowerCase().includes(q) ||
        (b.description && b.description.toLowerCase().includes(q)) ||
        (b.category && b.category.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'rank') {
      result.sort((a, b) => a.rank - b.rank);
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title, 'ko-KR'));
    } else if (sortBy === 'author') {
      result.sort((a, b) => a.author.localeCompare(b.author, 'ko-KR'));
    }

    return result;
  }, [books, selectedCategory, searchQuery, sortBy]);

  const toggleExpand = (rank: number) => {
    setExpandedIds(prev => ({ ...prev, [rank]: !prev[rank] }));
  };

  // Rank Badge Render Helper
  const renderRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 font-extrabold text-sm shadow-md shadow-amber-500/20 border border-amber-200">
          <Crown className="w-4 h-4 fill-slate-950" />
          <span>1위</span>
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 text-slate-900 font-extrabold text-sm shadow-md border border-slate-300">
          <Trophy className="w-4 h-4 text-slate-700" />
          <span>2위</span>
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 text-amber-50 font-extrabold text-sm shadow-md border border-amber-500/40">
          <Trophy className="w-4 h-4 text-amber-300" />
          <span>3위</span>
        </span>
      );
    }
    if (rank <= 10) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-indigo-100 text-indigo-900 font-bold text-xs border border-indigo-300">
          Top {rank}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200">
        {rank}위
      </span>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Banner / Header Box */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 text-blue-50 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-indigo-700/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-400/20 text-blue-300 border border-blue-400/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>YES24 구글 Apps Script 연동 데이터</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>📚 YES24 실시간 베스트셀러</span>
            </h2>
            <p className="text-xs sm:text-sm text-blue-200/80 font-sans max-w-2xl leading-relaxed">
              독서 시장에서 사랑받는 실시간 베스트셀러 도서 목록을 확인하고, 마음에 드는 책을 선택하여 독서록 리뷰를 직접 작성해보세요!
            </p>
          </div>

          {/* Refresh & Stats Badge */}
          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 shrink-0">
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200 border border-white/10 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-blue-300" />
              <span>수집된 도서: <strong className="text-white text-sm font-bold">{totalCount}권</strong></span>
            </div>
            
            <button
              onClick={fetchBestsellers}
              disabled={isLoading}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-300' : ''}`} />
              <span>새로고침</span>
              {lastUpdated && <span className="text-[10px] text-indigo-300/70">({lastUpdated})</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md shadow-indigo-900/5 border border-indigo-200/80 space-y-4">
        
        {/* Top Controls: Search Input + Sorting */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-800/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="도서명, 저자, 출판사, 줄거리 키워드 검색..."
              className="w-full pl-10 pr-4 py-2.5 bg-indigo-50/50 border border-indigo-200 rounded-2xl text-base sm:text-sm text-indigo-950 placeholder-indigo-800/40 focus:outline-none focus:ring-2 focus:ring-indigo-800/20 focus:border-indigo-800 transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-indigo-800/60 hover:text-indigo-950"
              >
                지우기
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-between sm:justify-start">
            <span className="text-xs font-bold text-indigo-900 shrink-0 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-700" />
              <span>정렬:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-indigo-50/80 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-800/20 cursor-pointer"
            >
              <option value="rank">순위순 (1위~)</option>
              <option value="title">도서명 가나다순</option>
              <option value="author">저자명 가나다순</option>
            </select>
          </div>
        </div>

        {/* Category Tab Filters */}
        <div className="pt-2 border-t border-indigo-200/60">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Filter className="w-3.5 h-3.5 text-indigo-700" />
            <span className="text-xs font-bold text-indigo-950">관리분류별 필터:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-indigo-900 text-indigo-50 shadow-sm'
                  : 'bg-indigo-100/60 text-indigo-900 hover:bg-indigo-100 border border-indigo-200/60'
              }`}
            >
              전체 도서 ({books.length})
            </button>

            {categories.map((cat) => {
              const count = books.filter(b => b.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-indigo-900 text-indigo-50 shadow-sm'
                      : 'bg-indigo-100/60 text-indigo-900 hover:bg-indigo-100 border border-indigo-200/60'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Result summary banner */}
        <div className="flex items-center justify-between text-xs text-indigo-800/80 pt-1 font-sans">
          <span>
            총 <strong className="text-indigo-950 font-bold">{filteredBooks.length}권</strong>의 베스트셀러 도서가 검색되었습니다.
          </span>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-indigo-900 font-bold underline hover:text-indigo-950"
            >
              카테고리 필터 해제
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-3xl p-12 text-center border border-indigo-200/80 shadow-md">
          <div className="w-12 h-12 border-4 border-indigo-800 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-bold text-indigo-950">구글 Apps Script에서 베스트셀러 정보를 불러오는 중...</h3>
          <p className="text-xs text-indigo-800/70 mt-1">잠시만 기다려 주세요.</p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="bg-rose-50 rounded-3xl p-8 border border-rose-200 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="text-base font-bold text-rose-900">베스트셀러 정보 불러오기 실패</h3>
          <p className="text-xs text-rose-700 max-w-md mx-auto">{error}</p>
          <button
            onClick={fetchBestsellers}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            다시 시도하기
          </button>
        </div>
      )}

      {/* Empty Filter Result */}
      {!isLoading && !error && filteredBooks.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-indigo-200/80 shadow-sm space-y-3">
          <BookOpen className="w-12 h-12 text-indigo-300 mx-auto" />
          <h3 className="text-base font-bold text-indigo-950">조건에 일치하는 베스트셀러 도서가 없습니다</h3>
          <p className="text-xs text-indigo-800/70">검색어나 카테고리 필터를 변경해 보세요.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-indigo-900 text-indigo-50 hover:bg-indigo-950 rounded-xl text-xs font-bold transition-all"
          >
            전체 목록 보기
          </button>
        </div>
      )}

      {/* Book Cards Grid */}
      {!isLoading && !error && filteredBooks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBooks.map((book) => {
            const isExpanded = !!expandedIds[book.rank];
            const hasLongDesc = book.description && book.description.length > 90;

            return (
              <div
                key={book.rank + '-' + book.title}
                className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl border border-indigo-200/80 hover:border-indigo-400 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Decorative Top Accent */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-800" />

                <div>
                  {/* Top Rank + Category Row */}
                  <div className="flex items-center justify-between gap-2 mb-3 pt-1">
                    {renderRankBadge(book.rank)}

                    {book.category && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200">
                        <Tag className="w-3 h-3 text-indigo-700" />
                        <span>{book.category}</span>
                      </span>
                    )}
                  </div>

                  {/* Book Title */}
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-snug mb-2 group-hover:text-indigo-600 transition-colors">
                    {book.title}
                  </h3>

                  {/* Author & Publisher */}
                  <div className="space-y-1 mb-3.5 text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{book.author || '저자 정보 없음'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{book.publisher || '출판사 정보 없음'}</span>
                    </div>
                  </div>

                  {/* Description Box */}
                  <div className="bg-indigo-50/50 p-3.5 rounded-2xl border border-indigo-100 mb-4">
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">
                      {isExpanded || !hasLongDesc
                        ? (book.description || '도서 소개글이 제공되지 않습니다.')
                        : `${book.description.substring(0, 90)}...`}
                    </p>

                    {hasLongDesc && (
                      <button
                        onClick={() => toggleExpand(book.rank)}
                        className="mt-2 text-[11px] font-bold text-indigo-600 hover:text-indigo-900 flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>{isExpanded ? '설명 접기' : '더보기'}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-3 border-t border-indigo-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-sans">YES24 Bestseller</span>
                  
                  {onSelectBookForLog && (
                    <button
                      onClick={() => onSelectBookForLog({
                        title: book.title,
                        author: book.author,
                        publisher: book.publisher,
                        category: book.category
                      })}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
                      title="이 책 정보를 독서록 양식에 자동으로 채우기"
                    >
                      <PenTool className="w-3.5 h-3.5 text-indigo-200" />
                      <span>이 책으로 독서록 쓰기</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
