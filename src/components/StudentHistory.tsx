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
  const [gradeFilter, setGradeFilter] = useState<number | 'all'>('all');
  const [classFilter, setClassFilter] = useState<number | 'all'>('all');
  const [nameSearch, setNameSearch] = useState<string>('');

  // 전체 학급 누적 통계
  const overallTotal = logs.length;
  const overallAvgRating = overallTotal > 0
    ? (logs.reduce((acc, curr) => acc + curr.rating, 0) / overallTotal).toFixed(1)
    : '0.0';
  const overallFeatured = logs.filter(l => l.isFeatured).length;
  const uniqueStudents = useMemo(() => {
    return new Set(logs.map(l => l.studentName.trim()).filter(Boolean)).size;
  }, [logs]);

  // 검색어 입력 시 해당 학생 필터링
  const isSearching = nameSearch.trim().length > 0;

  const studentLogs = useMemo(() => {
    if (!isSearching) return [];
    return logs.filter((log) => {
      const matchGrade = gradeFilter === 'all' || log.grade === Number(gradeFilter);
      const matchClass = classFilter === 'all' || log.classNum === Number(classFilter);
      const matchName = log.studentName.trim().toLowerCase().includes(nameSearch.trim().toLowerCase());
      return matchGrade && matchClass && matchName;
    });
  }, [logs, gradeFilter, classFilter, nameSearch, isSearching]);

  // 검색된 학생 통계
  const studentTotal = studentLogs.length;
  const studentAvgRating = studentTotal > 0
    ? (studentLogs.reduce((acc, curr) => acc + curr.rating, 0) / studentTotal).toFixed(1)
    : '0.0';
  const studentFeatured = studentLogs.filter((l) => l.isFeatured).length;

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md shadow-indigo-950/5 border border-indigo-100">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
            <UserCheck className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">내 서재 독서 기록 조회</h2>
            <p className="text-xs text-slate-500">이름을 검색하여 학급 서점에 등록된 나만의 독서 리뷰와 기록을 확인하세요.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">학년</label>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/30 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none transition-all font-medium text-slate-900 placeholder-slate-400"
              />
              <Search className="w-4 h-4 text-indigo-500 absolute left-3 top-3" />
              {nameSearch && (
                <button
                  onClick={() => setNameSearch('')}
                  className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-4 h-4 flex items-center justify-center font-bold"
                  title="검색어 지우기"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overall Class Reading Accumulation Summary Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-indigo-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>학급 누적 독서 현황</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              우리반 전체 누적 독서량 <span className="text-amber-300">{overallTotal}권</span>
            </h3>
            <p className="text-xs text-indigo-200/80 mt-1 font-sans">
              서점에 모인 소중한 독서 소감과 리뷰가 모여 풍성한 서재가 되고 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
            <div className="text-center px-3 py-1 border-r border-white/10">
              <p className="text-[11px] text-indigo-200">전체 누적</p>
              <p className="text-lg sm:text-xl font-bold text-white mt-0.5">{overallTotal}권</p>
            </div>

            <div className="text-center px-3 py-1 border-r border-white/10">
              <p className="text-[11px] text-indigo-200">참여 학생</p>
              <p className="text-lg sm:text-xl font-bold text-indigo-200 mt-0.5">{uniqueStudents}명</p>
            </div>

            <div className="text-center px-3 py-1 border-r border-white/10">
              <p className="text-[11px] text-indigo-200">평균 별점</p>
              <p className="text-lg sm:text-xl font-bold text-amber-300 mt-0.5 flex items-center justify-center gap-0.5">
                <span>⭐️</span> {overallAvgRating}
              </p>
            </div>

            <div className="text-center px-3 py-1">
              <p className="text-[11px] text-indigo-200">우수 독서록</p>
              <p className="text-lg sm:text-xl font-bold text-emerald-300 mt-0.5">🏆 {overallFeatured}건</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {!isSearching ? (
        /* Prompt when no student name is entered */
        <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-indigo-100 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-200 shadow-xs">
            <Search className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-slate-900">개인 독서 기록 검색하기</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              상단 검색창에 <strong className="text-indigo-600 font-bold">학생 이름</strong>을 입력하시면 개인 독서 리포트와 함께 등록한 모든 독서록 및 선생님 피드백을 확인하실 수 있습니다.
            </p>
          </div>
        </div>
      ) : (
        /* Student Specific Results */
        <div className="space-y-6">
          {/* Individual Student Report KPI Card */}
          <div className="bg-indigo-50/80 rounded-2xl p-4 sm:p-5 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  '<span className="text-indigo-600">{nameSearch}</span>' 학생의 독서 리포트
                </h4>
                <p className="text-xs text-slate-500">
                  {studentTotal > 0
                    ? `총 ${studentTotal}권의 책을 읽고 독서록을 작성했습니다.`
                    : '검색된 독서 기록이 없습니다.'}
                </p>
              </div>
            </div>

            {studentTotal > 0 && (
              <div className="flex items-center gap-2 bg-white/90 px-3.5 py-2 rounded-xl border border-indigo-200 self-start sm:self-auto text-xs font-semibold text-slate-700">
                <span>누적: <strong className="text-indigo-600 font-bold">{studentTotal}권</strong></span>
                <span>•</span>
                <span>평균: <strong className="text-amber-500 font-bold">⭐️ {studentAvgRating}</strong></span>
                {studentFeatured > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-600 font-bold">🏆 우수 {studentFeatured}건</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Student Cards List Grid */}
          {studentLogs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-indigo-100 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">'{nameSearch}' 학생의 등록된 독서 기록이 없습니다.</h3>
              <p className="text-xs text-slate-500">
                이름을 오타 없이 정확히 입력하셨는지 확인하시거나, '독서록 작성' 탭에서 첫 독서록을 남겨보세요!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentLogs.map((log) => (
                <div
                  key={log.id}
                  className={`bg-white rounded-3xl p-5 border transition-all hover:shadow-md relative flex flex-col justify-between ${
                    log.isFeatured
                      ? 'border-amber-300 ring-2 ring-amber-400/20 shadow-sm shadow-amber-100/50'
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

                    <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-1 mb-1">
                      {log.bookTitle}
                    </h4>

                    <p className="text-xs text-slate-500 mb-3 flex items-center gap-2.5 flex-wrap">
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
                        <span className="ml-1 text-slate-800 font-bold">{log.rating}.0</span>
                      </div>

                      <span className="text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{log.readDate}</span>
                      </span>
                    </div>

                    {/* Summary & Thoughts Snippet */}
                    <div className="space-y-2 mb-4">
                      <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-700 border border-slate-100">
                        <strong className="text-indigo-600 block mb-0.5 font-bold">줄거리:</strong>
                        <p className="line-clamp-2 leading-relaxed">{log.summary}</p>
                      </div>

                      <div className="bg-amber-50/50 p-3 rounded-xl text-xs text-slate-800 border border-amber-100/50">
                        <strong className="text-amber-800 block mb-0.5 font-bold">독후 소감:</strong>
                        <p className="line-clamp-2 leading-relaxed">{log.thoughts}</p>
                      </div>

                      {log.teacherComment && (
                        <div className="bg-emerald-50 p-3 rounded-xl text-xs text-emerald-900 border border-emerald-200/70">
                          <strong className="text-emerald-700 flex items-center gap-1 mb-0.5 font-bold">
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                            <span>선생님 피드백:</span>
                          </strong>
                          <p className="italic">{log.teacherComment}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                    <span className="text-xs text-slate-400 font-medium">
                      작성자: {log.studentName}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectLog(log)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
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
      )}

    </div>
  );
};
