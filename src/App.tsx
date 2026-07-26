import React, { useState, useEffect } from 'react';
import { 
  UserMode, StudentTab, TeacherTab, ReadingLog, GASConfig 
} from './types';
import { 
  getStoredLogs, saveStoredLogs, getGASConfig, saveGASConfig,
  fetchLogsFromGAS, saveLogToGAS, updateLogToGAS, deleteLogFromGAS
} from './utils/storage';

import { Header } from './components/Header';
import { ReadingQuotesHero } from './components/ReadingQuotesHero';
import { StudentForm } from './components/StudentForm';
import { StudentHistory } from './components/StudentHistory';
import { TeacherDashboard } from './components/TeacherDashboard';
import { HallOfFame } from './components/HallOfFame';
import { Yes24Bestsellers } from './components/Yes24Bestsellers';
import { GASSettingsModal } from './components/GASSettingsModal';
import { TeacherAuthModal } from './components/TeacherAuthModal';
import { LogDetailModal } from './components/LogDetailModal';

import { 
  PenTool, History, BarChart3, Trophy, Settings, GraduationCap, School, BookOpen, Sparkles, Database, TrendingUp, Flame
} from 'lucide-react';

export default function App() {
  const [userMode, setUserMode] = useState<UserMode>('student');
  const [studentTab, setStudentTab] = useState<StudentTab>('submit');
  const [teacherTab, setTeacherTab] = useState<TeacherTab>('dashboard');

  const [logs, setLogs] = useState<ReadingLog[]>([]);
  const [gasConfig, setGasConfig] = useState<GASConfig>({ webAppUrl: '', lastSyncedAt: null, autoSync: true });

  const [isTeacherAuthOpen, setIsTeacherAuthOpen] = useState<boolean>(false);
  const [isGASSettingsOpen, setIsGASSettingsOpen] = useState<boolean>(false);
  const [selectedLog, setSelectedLog] = useState<ReadingLog | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Selected book info for student form pre-filling from Yes24 Bestsellers
  const [selectedBookForForm, setSelectedBookForForm] = useState<{ title: string; author: string; publisher: string; category?: string } | null>(null);

  // Initial Load from localStorage & Auto-Sync
  useEffect(() => {
    const initialLogs = getStoredLogs();
    setLogs(initialLogs);

    const config = getGASConfig();
    setGasConfig(config);

    if (config.webAppUrl) {
      handleSyncWithGAS(config.webAppUrl);
    }
  }, []);

  // Save logs to localStorage on change
  const updateLogs = (newLogs: ReadingLog[]) => {
    setLogs(newLogs);
    saveStoredLogs(newLogs);
  };

  // Google Apps Script Sync
  const handleSyncWithGAS = async (targetUrl?: string) => {
    const url = targetUrl || gasConfig.webAppUrl;
    if (!url) return;

    setIsSyncing(true);
    const res = await fetchLogsFromGAS(url);
    setIsSyncing(false);

    if (res.success && res.logs) {
      updateLogs(res.logs);
      const newConfig = { ...gasConfig, lastSyncedAt: new Date().toLocaleString() };
      saveGASConfig(newConfig);
      setGasConfig(newConfig);
    }
  };

  // 1. Submit New Log
  const handleCreateLog = async (newLog: ReadingLog) => {
    const updated = [newLog, ...logs];
    updateLogs(updated);

    if (gasConfig.webAppUrl) {
      await saveLogToGAS(gasConfig.webAppUrl, newLog);
    }
  };

  // 2. Toggle Featured (이달의 우수 독서록)
  const handleToggleFeatured = async (logToToggle: ReadingLog) => {
    const updated = logs.map((l) => {
      if (l.id === logToToggle.id) {
        return { ...l, isFeatured: !l.isFeatured };
      }
      return l;
    });
    updateLogs(updated);

    const target = updated.find((l) => l.id === logToToggle.id);
    if (target && gasConfig.webAppUrl) {
      await updateLogToGAS(gasConfig.webAppUrl, target);
    }
  };

  // 3. Save Teacher Comment
  const handleSaveTeacherComment = async (logToComment: ReadingLog, comment: string) => {
    const updated = logs.map((l) => {
      if (l.id === logToComment.id) {
        return { ...l, teacherComment: comment };
      }
      return l;
    });
    updateLogs(updated);

    const target = updated.find((l) => l.id === logToComment.id);
    if (target && gasConfig.webAppUrl) {
      await updateLogToGAS(gasConfig.webAppUrl, target);
    }
  };

  // 4. Delete Log
  const handleDeleteLog = async (id: string) => {
    const updated = logs.filter((l) => l.id !== id);
    updateLogs(updated);

    if (gasConfig.webAppUrl) {
      await deleteLogFromGAS(gasConfig.webAppUrl, id);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-amber-950 font-sans antialiased selection:bg-amber-800 selection:text-amber-100 flex flex-col">
      
      {/* Top Header Navigation */}
      <Header
        userMode={userMode}
        setUserMode={setUserMode}
        gasConfig={gasConfig}
        onOpenGASSettings={() => setIsGASSettingsOpen(true)}
        onSyncData={() => handleSyncWithGAS()}
        isSyncing={isSyncing}
        onRequestTeacherAccess={() => setIsTeacherAuthOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full space-y-6">
        
        {/* Dynamic Reading Quotes Hero Showcase */}
        <ReadingQuotesHero />

        {/* Navigation Sub-Tabs Bar */}
        <div className="bg-white rounded-2xl p-2 shadow-xs border border-amber-200/80 flex items-center justify-between flex-wrap gap-2">
          
          {userMode === 'student' ? (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                id="student-tab-submit-btn"
                onClick={() => setStudentTab('submit')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  studentTab === 'submit'
                    ? 'bg-amber-900 text-amber-50 shadow-sm shadow-amber-900/20'
                    : 'text-amber-800 hover:text-amber-950 hover:bg-amber-50'
                }`}
              >
                <PenTool className="w-4 h-4" />
                <span>독서기록 리뷰 작성</span>
              </button>

              <button
                id="student-tab-history-btn"
                onClick={() => setStudentTab('history')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  studentTab === 'history'
                    ? 'bg-amber-900 text-amber-50 shadow-sm shadow-amber-900/20'
                    : 'text-amber-800 hover:text-amber-950 hover:bg-amber-50'
                }`}
              >
                <History className="w-4 h-4" />
                <span>내 온라인 서재 기록</span>
              </button>

              <button
                id="student-tab-bestsellers-btn"
                onClick={() => setStudentTab('bestsellers')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  studentTab === 'bestsellers'
                    ? 'bg-amber-700 text-amber-50 shadow-sm shadow-amber-700/20'
                    : 'text-amber-800 hover:text-amber-950 hover:bg-amber-50'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>YES24 실시간 베스트셀러</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                id="teacher-tab-dashboard-btn"
                onClick={() => setTeacherTab('dashboard')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  teacherTab === 'dashboard'
                    ? 'bg-amber-900 text-amber-50 shadow-sm shadow-amber-900/20'
                    : 'text-amber-800 hover:text-amber-950 hover:bg-amber-50'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>학급 독서 대시보드</span>
              </button>

              <button
                id="teacher-tab-hall-btn"
                onClick={() => setTeacherTab('hallOfFame')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  teacherTab === 'hallOfFame'
                    ? 'bg-amber-600 text-white shadow-sm shadow-amber-200'
                    : 'text-amber-800 hover:text-amber-950 hover:bg-amber-50'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>이달의 베스트셀러 & 우수 독서록</span>
              </button>

              <button
                id="teacher-tab-bestsellers-btn"
                onClick={() => setTeacherTab('bestsellers')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  teacherTab === 'bestsellers'
                    ? 'bg-amber-700 text-amber-50 shadow-sm shadow-amber-700/20'
                    : 'text-amber-800 hover:text-amber-950 hover:bg-amber-50'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>YES24 실시간 베스트셀러</span>
              </button>

              <button
                id="teacher-tab-settings-btn"
                onClick={() => setIsGASSettingsOpen(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-amber-800 hover:text-amber-950 hover:bg-amber-50 transition-all"
              >
                <Database className="w-4 h-4 text-emerald-700" />
                <span>구글 시트 연동 설정</span>
              </button>
            </div>
          )}

          {/* Quick Info Pill */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-amber-800 pr-2 font-serif">
            <BookOpen className="w-4 h-4 text-amber-700" />
            <span>우리반 총 누적 독서록: <strong className="text-amber-900 font-bold">{logs.length}권</strong></span>
          </div>

        </div>

        {/* View Content Rendering */}
        {userMode === 'student' ? (
          studentTab === 'submit' ? (
            <StudentForm 
              onSubmitLog={handleCreateLog} 
              initialBookInfo={selectedBookForForm}
            />
          ) : studentTab === 'history' ? (
            <StudentHistory
              logs={logs}
              onSelectLog={(log) => setSelectedLog(log)}
              onDeleteLog={handleDeleteLog}
            />
          ) : (
            <Yes24Bestsellers
              onSelectBookForLog={(book) => {
                setSelectedBookForForm(book);
                setStudentTab('submit');
                window.scrollTo({ top: 350, behavior: 'smooth' });
              }}
            />
          )
        ) : (
          teacherTab === 'dashboard' ? (
            <TeacherDashboard
              logs={logs}
              onToggleFeatured={handleToggleFeatured}
              onSaveTeacherComment={handleSaveTeacherComment}
              onDeleteLog={handleDeleteLog}
              onSelectLog={(log) => setSelectedLog(log)}
              onSyncWithGAS={() => handleSyncWithGAS()}
              isSyncing={isSyncing}
            />
          ) : teacherTab === 'hallOfFame' ? (
            <HallOfFame
              logs={logs}
              onSelectLog={(log) => setSelectedLog(log)}
            />
          ) : (
            <Yes24Bestsellers
              onSelectBookForLog={(book) => {
                setSelectedBookForForm(book);
                setUserMode('student');
                setStudentTab('submit');
                window.scrollTo({ top: 350, behavior: 'smooth' });
              }}
            />
          )
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 우리반 전자 독서기록장 • 스마트 학급 독서 교육 모듈</p>
          <p className="text-[11px] text-slate-400">
            Netlify & GitHub SPA 지원 | Google Apps Script Google Sheets DB 연동
          </p>
        </div>
      </footer>

      {/* Modals */}
      <TeacherAuthModal
        isOpen={isTeacherAuthOpen}
        onClose={() => setIsTeacherAuthOpen(false)}
        onSuccess={() => {
          setIsTeacherAuthOpen(false);
          setUserMode('teacher');
        }}
      />

      <GASSettingsModal
        isOpen={isGASSettingsOpen}
        onClose={() => setIsGASSettingsOpen(false)}
        gasConfig={gasConfig}
        setGasConfig={setGasConfig}
        logs={logs}
      />

      <LogDetailModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />

    </div>
  );
}
