import React from 'react';
import { BookOpen, Star, Calendar, User, Trophy, X, MessageSquare, Printer, Tag, Building2 } from 'lucide-react';
import { ReadingLog } from '../types';

interface LogDetailModalProps {
  log: ReadingLog | null;
  onClose: () => void;
}

export const LogDetailModal: React.FC<LogDetailModalProps> = ({ log, onClose }) => {
  if (!log) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close & Print Buttons */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            독서 기록장 상세 보기
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
              title="인쇄하기"
            >
              <Printer className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Featured Banner */}
        {log.isFeatured && (
          <div className="mb-4 p-3 bg-amber-100/80 border border-amber-300 text-amber-900 rounded-2xl flex items-center gap-2 text-xs font-bold">
            <Trophy className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0" />
            <span>선생님이 직접 선정한 '이달의 우수 독서록'입니다! 🏆</span>
          </div>
        )}

        {/* Book Title & Meta */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg">
              {log.grade}학년 {log.classNum}반 {log.studentName}
            </span>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
              {log.genre}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 leading-tight">
            {log.bookTitle}
          </h2>

          <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
            <span>지은이: {log.author}</span>
            <span>•</span>
            <span>출판사: {log.publisher}</span>
            <span>•</span>
            <span>읽은 날짜: {log.readDate}</span>
          </p>
        </div>

        {/* Star Rating Display */}
        <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60 mb-6 flex items-center justify-between">
          <span className="text-xs font-bold text-amber-900">내 평가 별점</span>
          <div className="flex items-center gap-1 text-amber-500">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-5 h-5 ${
                  s <= log.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                }`}
              />
            ))}
            <span className="ml-2 font-bold text-slate-800 text-sm">{log.rating}.0점</span>
          </div>
        </div>

        {/* Summary Block */}
        <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
            <h4 className="font-bold text-indigo-700 text-sm mb-1.5">📖 줄거리 요약</h4>
            <p className="whitespace-pre-wrap">{log.summary}</p>
          </div>

          {/* Reflections Block */}
          <div className="bg-amber-50/40 p-4 rounded-2xl border border-amber-200/60">
            <h4 className="font-bold text-amber-800 text-sm mb-1.5">💭 독후 소감 및 느낀점</h4>
            <p className="whitespace-pre-wrap">{log.thoughts}</p>
          </div>

          {/* Teacher Comment Block */}
          {log.teacherComment && (
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-emerald-900">
              <h4 className="font-bold text-emerald-800 text-sm mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>선생님의 피드백</span>
              </h4>
              <p className="italic font-medium">{log.teacherComment}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-all"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
