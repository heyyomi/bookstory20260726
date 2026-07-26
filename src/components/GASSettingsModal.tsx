import React, { useState } from 'react';
import { Database, Copy, Check, X, AlertTriangle, ExternalLink, RefreshCw, CheckCircle2 } from 'lucide-react';
import { GASConfig, ReadingLog } from '../types';
import { GAS_CODE_SCRIPT } from '../utils/gasScript';
import { testGASUrl, saveGASConfig, syncAllToGAS } from '../utils/storage';

interface GASSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gasConfig: GASConfig;
  setGasConfig: (config: GASConfig) => void;
  logs: ReadingLog[];
}

export const GASSettingsModal: React.FC<GASSettingsModalProps> = ({
  isOpen,
  onClose,
  gasConfig,
  setGasConfig,
  logs,
}) => {
  const [urlInput, setUrlInput] = useState<string>(gasConfig.webAppUrl || '');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(GAS_CODE_SCRIPT);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      alert('클립보드 복사 실패: 코드 영역을 직접 전체 선택 후 복사해 주세요.');
    }
  };

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestResult(null);

    const trimmedUrl = urlInput.trim();

    if (!trimmedUrl) {
      // 빈 URL 입력 시 연동 해제 (로컬 모드 전환)
      const newConfig: GASConfig = { webAppUrl: '', lastSyncedAt: null, autoSync: false };
      saveGASConfig(newConfig);
      setGasConfig(newConfig);
      setTestResult({ success: true, message: '로컬 단독 사용 모드로 변경되었습니다.' });
      return;
    }

    setIsTesting(true);
    const result = await testGASUrl(trimmedUrl);
    setIsTesting(false);

    setTestResult(result);

    if (result.success) {
      const newConfig: GASConfig = {
        webAppUrl: trimmedUrl,
        lastSyncedAt: new Date().toLocaleString(),
        autoSync: true
      };
      saveGASConfig(newConfig);
      setGasConfig(newConfig);
    }
  };

  const handlePushLocalDataToGAS = async () => {
    if (!gasConfig.webAppUrl) {
      alert('먼저 구글 시트 웹 앱 URL을 등록해 주세요.');
      return;
    }
    if (confirm(`현재 저장된 총 ${logs.length}건의 독서기록을 구글 시트로 한 번에 전송하시겠습니까?`)) {
      setIsTesting(true);
      const res = await syncAllToGAS(gasConfig.webAppUrl, logs);
      setIsTesting(false);
      alert(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">구글 시트 연동 설정 (GAS API)</h2>
              <p className="text-xs text-slate-500">별도 서버 없이 구글 시트를 데이터베이스로 활용합니다.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-6 text-xs text-slate-700">
          
          <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 space-y-2">
            <h3 className="font-bold text-indigo-900 text-sm flex items-center gap-2">
              <span>📌 구글 시트 연동 순서 (5분 소요)</span>
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-indigo-950 font-medium leading-relaxed">
              <li>새 구글 시트(Google Sheets)를 하나 만듭니다.</li>
              <li>상단 메뉴에서 <strong>[확장 프로그램] &gt; [Apps Script]</strong>를 클릭합니다.</li>
              <li>아래 [Code.gs 복사] 버튼을 눌러 스크립트 코드를 복사하고 Apps Script 편집기에 붙여넣습니다.</li>
              <li>우측 상단 <strong>[배포] &gt; [새 배포]</strong> 선택 후 유형: <strong>[웹 앱]</strong>, 액세스 권한: <strong>[모든 사용자]</strong>로 설정 후 배포합니다.</li>
              <li>발급된 <strong>웹 앱 URL (Web App URL)</strong>을 복사하여 아래 입력창에 넣고 [연동 테스트 및 저장]을 누릅니다.</li>
            </ol>
          </div>

          {/* Code Copy Box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-900 text-sm">구글 앱스 스크립트 코드 (Code.gs)</span>
              <button
                onClick={handleCopyCode}
                id="copy-code-gs-btn"
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  isCopied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? '복사 완료! (Click to Copy)' : 'Code.gs 전체 복사'}</span>
              </button>
            </div>

            <div className="relative bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-[11px] leading-relaxed max-h-52 overflow-y-auto border border-slate-800">
              <pre>{GAS_CODE_SCRIPT}</pre>
            </div>
          </div>

          {/* URL Input & Test Form */}
          <form onSubmit={handleTestAndSave} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
            <label className="block font-bold text-slate-900 text-sm">
              웹 앱 URL (Web App URL) 입력
            </label>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                id="gas-url-input-field"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="submit"
                disabled={isTesting}
                id="gas-test-save-btn"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
              >
                {isTesting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>연동 테스트 및 저장</span>
              </button>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  testResult.success
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-rose-100 text-rose-900 border border-rose-300'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
          </form>

          {/* Additional Sync Options */}
          {gasConfig.webAppUrl && (
            <div className="flex items-center justify-between p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200">
              <div>
                <p className="font-bold text-emerald-900">현재 구글 시트 연동 중</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  마지막 동기화 시각: {gasConfig.lastSyncedAt || '최근'}
                </p>
              </div>

              <button
                onClick={handlePushLocalDataToGAS}
                disabled={isTesting}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl"
              >
                로컬 전체 데이터 시트에 업로드
              </button>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
