import React from 'react';
import { BookOpen, GraduationCap, School, Database, RefreshCw, CheckCircle2, AlertCircle, Library, Bookmark, Lock } from 'lucide-react';
import { UserMode, GASConfig } from '../types';

interface HeaderProps {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  gasConfig: GASConfig;
  onOpenGASSettings: () => void;
  onSyncData: () => void;
  isSyncing: boolean;
  onRequestTeacherAccess: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userMode,
  setUserMode,
  gasConfig,
  onOpenGASSettings,
  onSyncData,
  isSyncing,
  onRequestTeacherAccess,
}) => {
  const isConnected = Boolean(gasConfig.webAppUrl);

  const handleModeChange = (targetMode: UserMode) => {
    if (targetMode === 'teacher' && userMode !== 'teacher') {
      onRequestTeacherAccess();
    } else {
      setUserMode(targetMode);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-amber-50/95 backdrop-blur-md border-b border-amber-200/60 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-900 via-amber-800 to-amber-600 flex items-center justify-center text-amber-100 shadow-md shadow-amber-900/20 border border-amber-500/30 shrink-0">
            <Library className="w-5 h-5 sm:w-6 sm:h-6 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-base sm:text-2xl font-extrabold tracking-tight text-amber-950">
                우리반 <span className="text-amber-700">독서 라운지 & 기록장</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-200/60 text-amber-900 border border-amber-300/80">
                <Bookmark className="w-3 h-3 text-amber-700" />
                스마트 서재
              </span>
            </div>
            <p className="text-xs text-amber-800/80 hidden sm:block font-sans">
              책을 만나고 지혜와 생각을 나누는 우리들의 감성 독서 공간
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-4">
          
          {/* Google Sheets Connection Chip */}
          <button
            onClick={onOpenGASSettings}
            id="gas-connection-chip-btn"
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isConnected
                ? 'bg-emerald-100/80 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
            }`}
            title={userMode === 'teacher' ? "구글 시트 연동 설정 열기" : "🔒 구글 시트 연동 설정 (선생님 인증 필요)"}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="flex items-center gap-1.5">
              {isConnected ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>구글 시트 연동 완료</span>
                  {userMode === 'student' && <Lock className="w-3 h-3 text-emerald-800" title="선생님 전용 설정" />}
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                  <span>구글 시트 미연동 (설정)</span>
                  {userMode === 'student' && <Lock className="w-3 h-3 text-amber-800" title="선생님 전용 설정" />}
                </>
              )}
            </span>
          </button>

          {/* Manual Refresh / Sync Button */}
          <button
            onClick={onSyncData}
            disabled={isSyncing}
            id="header-sync-btn"
            className="p-2 sm:p-2.5 text-amber-800 hover:text-amber-950 hover:bg-amber-100 rounded-xl transition-all disabled:opacity-50"
            title="서점 데이터 동기화 / 새로고침"
          >
            <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isSyncing ? 'animate-spin text-amber-800' : ''}`} />
          </button>

          {/* Desktop Mode Switcher Tabs (Hidden on mobile as bottom nav handles it) */}
          <div className="hidden sm:flex items-center p-1 bg-amber-100/80 rounded-2xl border border-amber-300/70">
            <button
              id="mode-student-btn"
              onClick={() => handleModeChange('student')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                userMode === 'student'
                  ? 'bg-amber-900 text-amber-50 shadow-sm'
                  : 'text-amber-900 hover:text-amber-950'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>학생 서재</span>
            </button>

            <button
              id="mode-teacher-btn"
              onClick={() => handleModeChange('teacher')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                userMode === 'teacher'
                  ? 'bg-amber-700 text-amber-50 shadow-sm'
                  : 'text-amber-900 hover:text-amber-950'
              }`}
            >
              <School className="w-4 h-4" />
              <span>교사 서점 관리</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
