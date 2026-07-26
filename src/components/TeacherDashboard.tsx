import React, { useState, useMemo } from 'react';
import { 
  BarChart2, BookOpen, Users, Trophy, Download, Search, Star, 
  MessageSquare, Trash2, Eye, Filter, RefreshCw, CheckCircle2, 
  Sparkles, Calendar, Tag, ChevronDown
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid 
} from 'recharts';
import { ReadingLog } from '../types';
import { exportLogsToCSV } from '../utils/storage';

interface TeacherDashboardProps {
  logs: ReadingLog[];
  onToggleFeatured: (log: ReadingLog) => void;
  onSaveTeacherComment: (log: ReadingLog, comment: string) => void;
  onDeleteLog: (id: string) => void;
  onSelectLog: (log: ReadingLog) => void;
  onSyncWithGAS: () => void;
  isSyncing: boolean;
}

const COLORS = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#64748B'];

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  logs,
  onToggleFeatured,
  onSaveTeacherComment,
  onDeleteLog,
  onSelectLog,
  onSyncWithGAS,
  isSyncing,
}) => {
  const [gradeFilter, setGradeFilter] = useState<number | 'all'>('all');
  const [classFilter, setClassFilter] = useState<number | 'all'>('all');
  const [nameSearch, setNameSearch] = useState<string>('');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(false);

  // Edit Comment Modal / Inline Popover State
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<string>('');

  // 필터링된 대시보드 리스트
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchGrade = gradeFilter === 'all' || log.grade === Number(gradeFilter);
      const matchClass = classFilter === 'all' || log.classNum === Number(classFilter);
      const matchName = !nameSearch.trim() || log.studentName.toLowerCase().includes(nameSearch.toLowerCase()) || log.bookTitle.toLowerCase().includes(nameSearch.toLowerCase());
      const matchGenre = genreFilter === 'all' || log.genre === genreFilter;
      const matchFeatured = !featuredOnly || log.isFeatured;
      return matchGrade && matchClass && matchName && matchGenre && matchFeatured;
    });
  }, [logs, gradeFilter, classFilter, nameSearch, genreFilter, featuredOnly]);

  // 대시보드 요약 통계
  const totalLogsCount = logs.length;
  const uniqueStudentsCount = new Set(logs.map((l) => `${l.grade}-${l.classNum}-${l.studentName}`)).size;
  const featuredCount = logs.filter((l) => l.isFeatured).length;
  const avgRating = totalLogsCount > 0
    ? (logs.reduce((sum, l) => sum + l.rating, 0) / totalLogsCount).toFixed(1)
    : '0.0';

  // 1. 학년/반별 독서 수 차트 데이터
  const classChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    logs.forEach((log) => {
      const key = `${log.grade}학년 ${log.classNum}반`;
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [logs]);

  // 2. 장르별 분포 차트 데이터
  const genreChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    logs.forEach((log) => {
      const g = log.genre || '기타';
      counts[g] = (counts[g] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [logs]);

  // 3. 월별 독서량 트렌드 차트 데이터
  const monthlyChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    logs.forEach((log) => {
      const dateStr = log.readDate || log.createdAt;
      const monthKey = dateStr.substring(0, 7); // YYYY-MM
      counts[monthKey] = (counts[monthKey] || 0) + 1;
    });
    const sortedMonths = Object.keys(counts).sort();
    return sortedMonths.map((m) => ({
      month: `${parseInt(m.split('-')[1])}월`,
      count: counts[m]
    }));
  }, [logs]);

  const handleOpenCommentEditor = (log: ReadingLog) => {
    setEditingLogId(log.id);
    setCommentInput(log.teacherComment || '');
  };

  const handleSaveComment = (log: ReadingLog) => {
    onSaveTeacherComment(log, commentInput.trim());
    setEditingLogId(null);
    setCommentInput('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-indigo-600" />
            <span>학급 독서 현황 대시보드</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            제출된 독서 기록을 실시간으로 분석하고 우수 독서록 및 피드백을 관리합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSyncWithGAS}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-indigo-600' : ''}`} />
            <span>시트 새로고침</span>
          </button>

          <button
            onClick={() => exportLogsToCSV(filteredLogs)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-indigo-100"
          >
            <Download className="w-4 h-4" />
            <span>엑셀(CSV) 다운로드</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">총 제출 독서록</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{totalLogsCount}권</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">참여 학생 수</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{uniqueStudentsCount}명</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">우수 독서록 지정</p>
            <p className="text-2xl font-bold text-amber-600 mt-0.5">{featuredCount}건</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 text-emerald-500 fill-emerald-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">학급 평균 별점</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{avgRating} / 5.0</p>
          </div>
        </div>

      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Class Reading Volume */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span>학급/반별 총 독서량 (권)</span>
            <span className="text-xs font-normal text-slate-400">학급별 독서 열기</span>
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                  formatter={(val: number) => [`${val}권`, '제출 수']}
                />
                <Bar dataKey="count" fill="#4F46E5" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Genre Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            도서 장르별 선호도
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genreChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {genreChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => [`${val}권`, '수량']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span>목록 검색 및 필터</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">학년</label>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
            >
              <option value="all">전체 학년</option>
              {[1, 2, 3, 4, 5, 6].map((g) => (
                <option key={g} value={g}>{g}학년</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">반</label>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
            >
              <option value="all">전체 반</option>
              {Array.from({ length: 15 }, (_, i) => i + 1).map((c) => (
                <option key={c} value={c}>{c}반</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">장르</label>
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
            >
              <option value="all">전체 장르</option>
              {['문학', '비문학', '과학', '역사', '사회/경제', '예술/문화', '자기계발', '기타'].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">이름 / 도서명</label>
            <div className="relative">
              <input
                type="text"
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                placeholder="검색어 입력..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                featuredOnly
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>우수 독서록만 보기</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Submissions Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            제출된 독서록 목록 ({filteredLogs.length}건)
          </h3>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            조건에 해당하는 독서 기록이 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-4">학급/학생</th>
                  <th className="p-4">도서명 / 지은이</th>
                  <th className="p-4">장르</th>
                  <th className="p-4">별점</th>
                  <th className="p-4">읽은 날짜</th>
                  <th className="p-4 text-center">이달의 우수</th>
                  <th className="p-4">교사 피드백</th>
                  <th className="p-4 text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* Student Info */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{log.studentName}</div>
                      <div className="text-[11px] text-slate-400">{log.grade}학년 {log.classNum}반</div>
                    </td>

                    {/* Book Title & Author */}
                    <td className="p-4">
                      <div className="font-bold text-indigo-900 line-clamp-1 max-w-xs">{log.bookTitle}</div>
                      <div className="text-[11px] text-slate-400">{log.author} | {log.publisher}</div>
                    </td>

                    {/* Genre */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {log.genre}
                      </span>
                    </td>

                    {/* Rating */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                        <span>{log.rating}.0</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="p-4 whitespace-nowrap text-slate-400">
                      {log.readDate}
                    </td>

                    {/* Featured Toggle */}
                    <td className="p-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => onToggleFeatured(log)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1 ${
                          log.isFeatured
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 shadow-xs'
                            : 'bg-slate-100 text-slate-400 hover:text-slate-600'
                        }`}
                        title="우수 독서록 지정 토글"
                      >
                        <Trophy className={`w-3.5 h-3.5 ${log.isFeatured ? 'text-amber-600 fill-amber-500' : ''}`} />
                        <span>{log.isFeatured ? '우수' : '지정'}</span>
                      </button>
                    </td>

                    {/* Teacher Feedback */}
                    <td className="p-4 max-w-xs">
                      {editingLogId === log.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            placeholder="선생님의 칭찬 피드백 한마디..."
                            className="w-full px-2 py-1 border border-indigo-300 rounded-lg text-xs"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveComment(log)}
                            className="px-2 py-1 bg-indigo-600 text-white font-bold rounded-lg text-[11px] shrink-0"
                          >
                            저장
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-1 group">
                          <p className="text-xs text-slate-600 italic line-clamp-1">
                            {log.teacherComment ? `"${log.teacherComment}"` : <span className="text-slate-300 font-normal">피드백 작성하기</span>}
                          </p>
                          <button
                            onClick={() => handleOpenCommentEditor(log)}
                            className="p-1 text-slate-400 hover:text-indigo-600 rounded-md shrink-0"
                            title="피드백 편집"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectLog(log)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                          title="상세보기"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`'${log.bookTitle}' 독서록을 정말 삭제하시겠습니까?`)) {
                              onDeleteLog(log.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
