import React, { useMemo } from 'react';
import { Crown, Trophy, Award, Sparkles, BookOpen, Star, MessageSquare, Heart, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ReadingLog } from '../types';

interface HallOfFameProps {
  logs: ReadingLog[];
  onSelectLog: (log: ReadingLog) => void;
}

export const HallOfFame: React.FC<HallOfFameProps> = ({ logs, onSelectLog }) => {
  // 이번 달 독서왕 계산 (TOP 3)
  const topStudents = useMemo(() => {
    const studentMap: Record<string, { key: string; name: string; grade: number; classNum: number; count: number; books: string[] }> = {};

    logs.forEach((log) => {
      const key = `${log.grade}-${log.classNum}-${log.studentName}`;
      if (!studentMap[key]) {
        studentMap[key] = {
          key,
          name: log.studentName,
          grade: log.grade,
          classNum: log.classNum,
          count: 0,
          books: []
        };
      }
      studentMap[key].count += 1;
      if (!studentMap[key].books.includes(log.bookTitle)) {
        studentMap[key].books.push(log.bookTitle);
      }
    });

    const sorted = Object.values(studentMap).sort((a, b) => b.count - a.count);
    return sorted.slice(0, 3);
  }, [logs]);

  // 선생님 지정 우수 독서록 목록
  const featuredLogs = useMemo(() => {
    return logs.filter((l) => l.isFeatured);
  }, [logs]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 text-amber-50 rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-amber-600/30">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 backdrop-blur-md mb-3 border border-amber-400/30">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>온라인 학급 서점 • Bestseller Showcase</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              🏆 이달의 <span className="text-amber-300">베스트셀러 독서 리뷰</span> & <span className="text-amber-300">독서왕 전당</span>
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/90 mt-1 max-w-xl font-sans">
              책을 사랑하고 깊이 있는 독서 리뷰를 남겨준 우리반 베스트셀러 작가와 독서왕을 축하해 주세요!
            </p>
          </div>

          <button
            onClick={triggerConfetti}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <Crown className="w-5 h-5 text-amber-950" />
            <span>축하 폭죽 터뜨리기 🎉</span>
          </button>
        </div>
      </div>

      {/* TOP 3 Podium Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-md">
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-slate-900 flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span>이번 달 독서왕 TOP 3</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">가장 많은 책을 읽고 독서록을 작성한 학생입니다.</p>
        </div>

        {topStudents.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            아직 독서왕 데이터가 없습니다. 독서록을 먼저 제출해보세요!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto pt-4">
            
            {/* 2nd Place (Silver) */}
            {topStudents[1] && (
              <div className="order-2 md:order-1 bg-gradient-to-b from-slate-50 to-slate-100 rounded-3xl p-6 border border-slate-200/80 shadow-sm text-center relative hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-full bg-slate-300 text-slate-700 font-extrabold text-lg flex items-center justify-center mx-auto mb-3 shadow-md border-2 border-white">
                  🥈 2등
                </div>
                <h4 className="font-bold text-lg text-slate-900">{topStudents[1].name}</h4>
                <p className="text-xs text-slate-500 mb-3">{topStudents[1].grade}학년 {topStudents[1].classNum}반</p>
                <div className="inline-block px-3 py-1 bg-slate-200 text-slate-800 text-xs font-bold rounded-full mb-3">
                  총 {topStudents[1].count}권 읽음 📚
                </div>
                <p className="text-[11px] text-slate-400 italic line-clamp-1">
                  대표 도서: {topStudents[1].books.join(', ')}
                </p>
              </div>
            )}

            {/* 1st Place (Gold) - Center & Taller */}
            {topStudents[0] && (
              <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50 via-amber-100/50 to-white rounded-3xl p-8 border-2 border-amber-300 shadow-xl text-center relative hover:-translate-y-2 transition-transform ring-4 ring-amber-400/20">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                  <Crown className="w-4 h-4 text-amber-200 fill-amber-200" />
                  <span>이번 달 1등 독서왕</span>
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 font-black text-2xl flex items-center justify-center mx-auto mb-3 mt-2 shadow-lg border-2 border-white">
                  🥇 1등
                </div>
                <h4 className="font-extrabold text-2xl text-slate-900">{topStudents[0].name}</h4>
                <p className="text-xs text-slate-600 mb-3">{topStudents[0].grade}학년 {topStudents[0].classNum}반</p>
                <div className="inline-block px-4 py-1.5 bg-amber-500 text-white text-sm font-extrabold rounded-full mb-3 shadow-sm">
                  총 {topStudents[0].count}권 독서 완료! 🎉
                </div>
                <p className="text-xs text-amber-900/80 font-medium line-clamp-2">
                  주요 읽은 책: {topStudents[0].books.join(', ')}
                </p>
              </div>
            )}

            {/* 3rd Place (Bronze) */}
            {topStudents[2] && (
              <div className="order-3 bg-gradient-to-b from-amber-50/40 to-slate-50 rounded-3xl p-6 border border-amber-200/60 shadow-sm text-center relative hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-full bg-amber-700 text-amber-100 font-extrabold text-lg flex items-center justify-center mx-auto mb-3 shadow-md border-2 border-white">
                  🥉 3등
                </div>
                <h4 className="font-bold text-lg text-slate-900">{topStudents[2].name}</h4>
                <p className="text-xs text-slate-500 mb-3">{topStudents[2].grade}학년 {topStudents[2].classNum}반</p>
                <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full mb-3">
                  총 {topStudents[2].count}권 읽음 📚
                </div>
                <p className="text-[11px] text-slate-400 italic line-clamp-1">
                  대표 도서: {topStudents[2].books.join(', ')}
                </p>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Featured Books Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-600" />
            <h3 className="text-xl font-bold text-slate-900">선생님 추천 '이달의 우수 독서록'</h3>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
            총 {featuredLogs.length}건 선정
          </span>
        </div>

        {featuredLogs.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-slate-400 border border-slate-100 text-sm">
            아직 선생님이 지정한 우수 독서록이 없습니다. 교사 대시보드에서 '우수' 버튼을 눌러 지정해 보세요!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredLogs.map((log) => (
              <div
                key={log.id}
                className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-md hover:shadow-xl transition-all relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-900 text-xs font-extrabold rounded-full border border-amber-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>우수 독서록 선정</span>
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {log.grade}학년 {log.classNum}반 {log.studentName}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">
                    {log.bookTitle}
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">
                    {log.author} 저 • {log.publisher} • 별점 ⭐️ {log.rating}.0
                  </p>

                  <div className="bg-slate-50 p-3.5 rounded-2xl text-xs text-slate-700 mb-3 space-y-2">
                    <p className="line-clamp-2">
                      <strong className="text-indigo-600">독후 소감: </strong>
                      "{log.thoughts}"
                    </p>
                  </div>

                  {log.teacherComment && (
                    <div className="bg-emerald-50 p-3.5 rounded-2xl text-xs text-emerald-900 border border-emerald-200 mb-3">
                      <strong className="text-emerald-800 flex items-center gap-1 mb-1">
                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                        <span>선생님의 칭찬 한마디:</span>
                      </strong>
                      <p className="italic">"{log.teacherComment}"</p>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => onSelectLog(log)}
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    <Eye className="w-4 h-4" />
                    <span>전체 독서록 읽기</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
