import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Star, Trophy, Calendar, UserCheck, MessageSquare, Eye, Trash2, Edit3, Sparkles } from 'lucide-react';
import { ReadingLog } from '../types';

interface StudentHistoryProps {
  logs: ReadingLog[];
  onSelectLog: (log: ReadingLog) => void;
  onDeleteLog: (id: string) => void;
  onEditLog?: (log: ReadingLog) => void;
}

export const StudentHistory: React.FC<StudentHistoryProps> = ({
  logs,
  onSelectLog,
  onDeleteLog,
  onEditLog,
}) => {
  const [gradeFilter, setGradeFilter] = useState<number | 'all'>(5);
  const [classFilter, setClassFilter] = useState<number | 'all'>(2);
  const [nameSearch, setNameSearch] = useState<string>('김민준');

  // 학생별 필터링된 로그 목록
  const studentLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchGrade = gradeFilter === 'all' || log.grade === Number(gradeFilter);
      const matchClass = classFilter === 'all' || log.classNum === Number(classFilter);
      const matchName = !nameSearch.trim() || log.studentName.trim().toLowerCase().includes(nameSearch.trim().toLowerCase());
      return matchGrade && matchClass && matchName;
    });
  }, [logs, gradeFilter, classFilter, nameSearch]);

  // 해당 학생 요약 통계
  const totalBooks = studentLogs.length;
  const avgRating = totalBooks > 0
    ? (studentLogs.reduce((acc, curr) => acc + curr.rating, 0) / totalBooks).toFixed(1)
    : '0.0';
  const featuredCount = studentLogs.filter((l) => l.isFeatured).length;

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Header */}
      <div className="bg-white rounded-3xl p-6 shadow-md shadow-amber-900/5 border border-amber-200/80">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300">
            <UserCheck className="w-5 h-5 text-amber-800" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-amber-950">내 서재 리뷰 및 독서 기록 조회</h2>
            <p className="text-xs text-amber-800/80">학년, 반, 이름을 검색하여 학급 서점에 등록된 내 독서 리뷰를 찾아보세요.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">학년</label>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">전체 학년</option>
              {[1, 2, 3, 4, 5, 6].map((g) => (
                <option key={g} value={g}>{g}학년</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">반</label>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">전체 반</option>
              {Array.from({ length: 15 }, (_, i) => i + 1).map((c) => (
                <option key={c} value={c}>{c}반</option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1">학생 이름 검색</label>
            <div className="relative">
              <input
                type="text"
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                placeholder="학생 이름을 입력하세요 (예: 김민준)"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Student Reading Stats KPI Banner */}
      {nameSearch.trim() && (
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>개인 독서 리포트</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-bold">
                <span className="text-amber-300">{nameSearch}</span> 학생의 누적 독서록
              </h3>
              <p className="text-xs text-indigo-200 mt-1">
                책과 함께 무럭무럭 성장하고 있어요!
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
              <div className="text-center px-3 border-r border-white/10">
                <p className="text-[11px] text-indigo-200">읽은 책</p>
                <p className="text-xl font-bold text-white mt-0.5">{totalBooks}권</p>
              </div>

              <div className="text-center px-3 border-r border-white/10">
                <p className="text-[11px] text-indigo-200">평균 별점</p>
                <p className="text-xl font-bold text-amber-300 mt-0.5 flex items-center gap-1 justify-center">
                  <span>⭐️</span> {avgRating}
                </p>
              </div>

              <div className="text-center px-3">
                <p className="text-[11px] text-indigo-200">우수 독서록</p>
                <p className="text-xl font-bold text-emerald-300 mt-0.5">🏆 {featuredCount}건</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cards List Grid */}
      {studentLogs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">조회된 독서 기록이 없습니다.</h3>
          <p className="text-xs text-slate-500 mt-1">
            이름을 확인하거나 '독서기록 작성' 탭에서 첫 독서록을 제출해보세요!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studentLogs.map((log) => (
            <div
              key={log.id}
              className={`bg-white rounded-3xl p-5 border transition-all hover:shadow-lg relative flex flex-col justify-between ${
                log.isFeatured
                  ? 'border-amber-300 ring-2 ring-amber-400/20 shadow-md shadow-amber-100/50'
                  : 'border-slate-200/80 hover:border-indigo-300'
              }`}
            >
              {/* Card Header & Badge */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                      {log.grade}학년 {log.classNum}반
                    </span>
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg">
                      {log.genre}
                    </span>
                  </div>

                  {log.isFeatured && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-300">
                      <Trophy className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                      <span>우수 독서록</span>
                    </span>
                  )}
                </div>

                <h4 className="text-lg font-bold text-slate-900 leading-snug line-clamp-1 mb-1">
                  {log.bookTitle}
                </h4>

                <p className="text-xs text-slate-500 mb-3 flex items-center gap-3">
                  <span>지은이: {log.author}</span>
                  <span>•</span>
                  <span>출판사: {log.publisher}</span>
                </p>

                {/* Rating & Date */}
                <div className="flex items-center justify-between text-xs py-2 border-y border-slate-100 mb-3">
                  <div className="flex items-center gap-1 text-amber-500 font-semibold">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= log.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-slate-700 font-bold">{log.rating}.0</span>
                  </div>

                  <span className="text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{log.readDate}</span>
                  </span>
                </div>

                {/* Summary & Thoughts Snippet */}
                <div className="space-y-2 mb-4">
                  <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-700">
                    <strong className="text-indigo-600 block mb-0.5">줄거리:</strong>
                    <p className="line-clamp-2 leading-relaxed">{log.summary}</p>
                  </div>

                  <div className="bg-amber-50/50 p-3 rounded-xl text-xs text-slate-800">
                    <strong className="text-amber-700 block mb-0.5">독후 소감:</strong>
                    <p className="line-clamp-2 leading-relaxed">{log.thoughts}</p>
                  </div>

                  {log.teacherComment && (
                    <div className="bg-emerald-50 p-3 rounded-xl text-xs text-emerald-900 border border-emerald-200/60">
                      <strong className="text-emerald-700 flex items-center gap-1 mb-0.5">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>선생님 피드백:</span>
                      </strong>
                      <p className="italic">{log.teacherComment}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-400 font-medium">
                  작성자: {log.studentName}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectLog(log)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>자세히 보기</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('이 독서 기록을 삭제하시겠습니까?')) {
                        onDeleteLog(log.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
