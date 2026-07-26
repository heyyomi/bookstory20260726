import React, { useState } from 'react';
import { BookPlus, Star, Sparkles, Send, CheckCircle2, User, BookOpen, PenTool, Tag, Calendar, Building2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ReadingLog } from '../types';

interface StudentFormProps {
  onSubmitLog: (log: ReadingLog) => Promise<void>;
  defaultGrade?: number;
  defaultClass?: number;
  defaultName?: string;
  initialBookInfo?: { title: string; author: string; publisher: string; category?: string } | null;
}

const GENRES = ['문학', '비문학', '과학', '역사', '사회/경제', '예술/문화', '자기계발', '기타'];

export const StudentForm: React.FC<StudentFormProps> = ({
  onSubmitLog,
  defaultGrade = 5,
  defaultClass = 2,
  defaultName = '',
  initialBookInfo,
}) => {
  const [grade, setGrade] = useState<number>(defaultGrade);
  const [classNum, setClassNum] = useState<number>(defaultClass);
  const [studentName, setStudentName] = useState<string>(defaultName);
  
  const [bookTitle, setBookTitle] = useState<string>(initialBookInfo?.title || '');
  const [author, setAuthor] = useState<string>(initialBookInfo?.author || '');
  const [publisher, setPublisher] = useState<string>(initialBookInfo?.publisher || '');
  const [genre, setGenre] = useState<string>('문학');
  const [readDate, setReadDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [rating, setRating] = useState<number>(5);
  const [summary, setSummary] = useState<string>('');
  const [thoughts, setThoughts] = useState<string>('');

  // Update form fields if initialBookInfo changes
  React.useEffect(() => {
    if (initialBookInfo) {
      if (initialBookInfo.title) setBookTitle(initialBookInfo.title);
      if (initialBookInfo.author) setAuthor(initialBookInfo.author);
      if (initialBookInfo.publisher) setPublisher(initialBookInfo.publisher);
      if (initialBookInfo.category) {
        if (GENRES.includes(initialBookInfo.category)) {
          setGenre(initialBookInfo.category);
        } else if (initialBookInfo.category.includes('소설') || initialBookInfo.category.includes('시') || initialBookInfo.category.includes('문학')) {
          setGenre('문학');
        } else if (initialBookInfo.category.includes('과학') || initialBookInfo.category.includes('IT')) {
          setGenre('과학');
        } else if (initialBookInfo.category.includes('역사') || initialBookInfo.category.includes('인문')) {
          setGenre('역사');
        } else if (initialBookInfo.category.includes('자기계발')) {
          setGenre('자기계발');
        }
      }
    }
  }, [initialBookInfo]);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName.trim()) {
      alert('학생 이름을 입력해 주세요.');
      return;
    }
    if (!bookTitle.trim()) {
      alert('도서명을 입력해 주세요.');
      return;
    }
    if (!summary.trim() || summary.length < 10) {
      alert('줄거리를 최소 10자 이상 작성해 주세요.');
      return;
    }
    if (!thoughts.trim() || thoughts.length < 10) {
      alert('소감 및 느낀점을 최소 10자 이상 작성해 주세요.');
      return;
    }

    const newLog: ReadingLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      grade,
      classNum,
      studentName: studentName.trim(),
      bookTitle: bookTitle.trim(),
      author: author.trim() || '미상',
      publisher: publisher.trim() || '미상',
      genre,
      readDate,
      rating,
      summary: summary.trim(),
      thoughts: thoughts.trim(),
      isFeatured: false,
      teacherComment: '',
      createdAt: new Date().toISOString()
    };

    setIsSubmitting(true);
    try {
      await onSubmitLog(newLog);
      
      // 폭죽 효과 (Celebration Confetti)
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setIsSubmittedSuccess(true);

      // 책 정보 초기화 (학생 학년/반/이름은 유지하여 연속 작성 용이)
      setBookTitle('');
      setAuthor('');
      setPublisher('');
      setSummary('');
      setThoughts('');
      setRating(5);

      setTimeout(() => {
        setIsSubmittedSuccess(false);
      }, 4000);

    } catch (err) {
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-amber-900/5 border border-amber-200/80">
      
      {/* Form Header */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-amber-200/60">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center border border-amber-300">
            <BookPlus className="w-6 h-6 text-amber-800" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-950">온라인 서점 독서 리뷰 작성</h2>
            <p className="text-xs sm:text-sm text-amber-800/80 mt-0.5 font-sans">
              내가 읽은 책의 감동과 별점, 마음을 울린 한 줄 소감을 학급 서점에 남겨보세요! 📖
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-amber-100/80 text-amber-900 rounded-full border border-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>우수 독서 리뷰는 '이달의 베스트셀러 서재'에 등재됩니다</span>
        </div>
      </div>

      {/* Success Notification Banner */}
      {isSubmittedSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 animate-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold text-sm">독서기록이 성공적으로 제출되었습니다! 🎉</p>
            <p className="text-xs text-emerald-600 mt-0.5">
              '내 독서 기록' 탭에서 내가 쓴 기록을 언제든지 확인할 수 있습니다.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Student Information */}
        <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-200/70">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-indigo-700 uppercase tracking-wider">
            <User className="w-4 h-4" />
            <span>1. 작성자 학생 정보</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">학년</label>
              <select
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-indigo-500"
              >
                {[1, 2, 3, 4, 5, 6].map((g) => (
                  <option key={g} value={g}>{g}학년</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">반</label>
              <select
                value={classNum}
                onChange={(e) => setClassNum(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-indigo-500"
              >
                {Array.from({ length: 15 }, (_, i) => i + 1).map((c) => (
                  <option key={c} value={c}>{c}반</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">학생 이름 *</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="예: 김민준"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Book Details */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-indigo-700 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>2. 읽은 도서 정보</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                도서명 (책 제목) *
              </label>
              <input
                type="text"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                placeholder="예: 어린 왕자, 마당을 나온 암탉"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                지은이 (저자)
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="예: 생텍쥐페리"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>출판사</span>
              </label>
              <input
                type="text"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="예: 열린책들"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>읽은 날짜</span>
              </label>
              <input
                type="date"
                value={readDate}
                onChange={(e) => setReadDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Genre & Star Rating */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          {/* Genre Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-indigo-500" />
              <span>도서 장르 / 분류</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {GENRES.map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGenre(g)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    genre === g
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              이 책에 대한 내 평가 (별점)
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-amber-50/80 px-3.5 py-2 rounded-xl border border-amber-200/70">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-0.5 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-sm font-bold text-amber-700">
                {rating}점 / 5점
              </span>
            </div>
          </div>

        </div>

        {/* Section 4: Summary */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <PenTool className="w-3.5 h-3.5 text-indigo-500" />
              <span>줄거리 요약 *</span>
            </label>
            <span className="text-[11px] text-slate-400">{summary.length}자 입력됨</span>
          </div>
          <div className="mb-2 p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-900">
            💡 <strong>작성 팁:</strong> 책의 주요 인물과 핵심 사건이 어떻게 전개되고 결말을 맺는지 간단히 정리해 보세요.
          </div>
          <textarea
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="주요 내용을 핵심만 3~4줄로 정리해 보세요."
            required
            className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        {/* Section 5: Impressions & Thoughts */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>독후 소감 및 느낀점 *</span>
            </label>
            <span className="text-[11px] text-slate-400">{thoughts.length}자 입력됨</span>
          </div>
          <div className="mb-2 p-2.5 bg-amber-50/70 rounded-xl border border-amber-200/60 text-xs text-amber-900">
            💡 <strong>작성 팁:</strong> 가장 기억에 남는 장면이나 문장, 이 책을 읽고 새롭게 깨달은 점, 나의 다짐을 적어보세요!
          </div>
          <textarea
            rows={4}
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
            placeholder="이 책을 읽고 느껴진 솔직한 내 생각과 다짐을 자유롭게 적어보세요."
            required
            className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            id="student-submit-log-btn"
            className="w-full py-4 px-6 bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 hover:from-amber-950 hover:to-stone-950 text-amber-100 font-serif font-bold text-base rounded-2xl transition-all shadow-lg shadow-amber-950/20 flex items-center justify-center gap-2.5 disabled:opacity-50 border border-amber-600/30"
          >
            {isSubmitting ? (
              <span>서점에 리뷰 등록 중...</span>
            ) : (
              <>
                <Send className="w-5 h-5 text-amber-300" />
                <span>서점 서재에 독서 리뷰 제출하기</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
