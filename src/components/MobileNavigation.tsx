import React from 'react';
import { PenTool, History, TrendingUp, Trophy, School, GraduationCap, BarChart3, Settings } from 'lucide-react';
import { UserMode, StudentTab, TeacherTab } from '../types';

interface MobileNavigationProps {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  studentTab: StudentTab;
  setStudentTab: (tab: StudentTab) => void;
  teacherTab: TeacherTab;
  setTeacherTab: (tab: TeacherTab) => void;
  onRequestTeacherAccess: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  userMode,
  setUserMode,
  studentTab,
  setStudentTab,
  teacherTab,
  setTeacherTab,
  onRequestTeacherAccess,
}) => {
  const handleTeacherSwitch = () => {
    if (userMode !== 'teacher') {
      onRequestTeacherAccess();
    } else {
      setUserMode('student');
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-amber-50/95 backdrop-blur-md border-t border-amber-200/80 md:hidden px-2 py-1.5 shadow-lg shadow-amber-950/10">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {userMode === 'student' ? (
          <>
            {/* 독서록 작성 */}
            <button
              onClick={() => setStudentTab('submit')}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl min-w-[64px] min-h-[48px] transition-all active:scale-95 ${
                studentTab === 'submit'
                  ? 'bg-amber-900 text-amber-50 font-bold shadow-xs'
                  : 'text-amber-900/70 hover:text-amber-950'
              }`}
            >
              <PenTool className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] leading-none font-sans">독서록 작성</span>
            </button>

            {/* 내 서재 기록 */}
            <button
              onClick={() => setStudentTab('history')}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl min-w-[64px] min-h-[48px] transition-all active:scale-95 ${
                studentTab === 'history'
                  ? 'bg-amber-900 text-amber-50 font-bold shadow-xs'
                  : 'text-amber-900/70 hover:text-amber-950'
              }`}
            >
              <History className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] leading-none font-sans">내 서재</span>
            </button>

            {/* 베스트셀러 */}
            <button
              onClick={() => setStudentTab('bestsellers')}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl min-w-[64px] min-h-[48px] transition-all active:scale-95 ${
                studentTab === 'bestsellers'
                  ? 'bg-amber-900 text-amber-50 font-bold shadow-xs'
                  : 'text-amber-900/70 hover:text-amber-950'
              }`}
            >
              <TrendingUp className="w-5 h-5 mb-0.5 text-amber-400" />
              <span className="text-[10px] leading-none font-sans">베스트셀러</span>
            </button>

            {/* 교사 모드 전환 */}
            <button
              onClick={handleTeacherSwitch}
              className="flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl min-w-[64px] min-h-[48px] text-amber-800 hover:text-amber-950 active:scale-95 transition-all"
            >
              <School className="w-5 h-5 mb-0.5 text-amber-700" />
              <span className="text-[10px] leading-none font-sans font-bold">교사 모드</span>
            </button>
          </>
        ) : (
          <>
            {/* 선생님 대시보드 */}
            <button
              onClick={() => setTeacherTab('dashboard')}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl min-w-[64px] min-h-[48px] transition-all active:scale-95 ${
                teacherTab === 'dashboard'
                  ? 'bg-amber-900 text-amber-50 font-bold shadow-xs'
                  : 'text-amber-900/70 hover:text-amber-950'
              }`}
            >
              <BarChart3 className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] leading-none font-sans">대시보드</span>
            </button>

            {/* 베스트 리뷰 & 독서왕 */}
            <button
              onClick={() => setTeacherTab('hallOfFame')}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl min-w-[64px] min-h-[48px] transition-all active:scale-95 ${
                teacherTab === 'hallOfFame'
                  ? 'bg-amber-900 text-amber-50 font-bold shadow-xs'
                  : 'text-amber-900/70 hover:text-amber-950'
              }`}
            >
              <Trophy className="w-5 h-5 mb-0.5 text-amber-400" />
              <span className="text-[10px] leading-none font-sans">명예의전당</span>
            </button>

            {/* 베스트셀러 */}
            <button
              onClick={() => setTeacherTab('bestsellers')}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl min-w-[64px] min-h-[48px] transition-all active:scale-95 ${
                teacherTab === 'bestsellers'
                  ? 'bg-amber-900 text-amber-50 font-bold shadow-xs'
                  : 'text-amber-900/70 hover:text-amber-950'
              }`}
            >
              <TrendingUp className="w-5 h-5 mb-0.5 text-amber-400" />
              <span className="text-[10px] leading-none font-sans">베스트셀러</span>
            </button>

            {/* 학생 모드로 돌아가기 */}
            <button
              onClick={() => setUserMode('student')}
              className="flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl min-w-[64px] min-h-[48px] text-amber-800 hover:text-amber-950 active:scale-95 transition-all"
            >
              <GraduationCap className="w-5 h-5 mb-0.5 text-amber-800" />
              <span className="text-[10px] leading-none font-sans font-bold">학생 서재</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
