import React, { useState } from 'react';
import { Lock, KeyRound, X, CheckCircle2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { getTeacherPassword, saveTeacherPassword } from '../utils/storage';

interface TeacherAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export const TeacherAuthModal: React.FC<TeacherAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title,
  description,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // 비밀번호 변경 모드 State
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const currentPassword = getTeacherPassword();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === currentPassword) {
      setErrorMsg('');
      setPasswordInput('');
      onSuccess();
    } else {
      setErrorMsg('비밀번호가 올바르지 않습니다. 다시 확인해주세요.');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (oldPass !== currentPassword) {
      setErrorMsg('현재 사용 중인 비밀번호가 올바르지 않습니다.');
      return;
    }
    if (newPass.length < 4) {
      setErrorMsg('새 비밀번호는 최소 4자리 이상이어야 합니다.');
      return;
    }
    if (newPass !== confirmPass) {
      setErrorMsg('새 비밀번호와 확인용 비밀번호가 일치하지 않습니다.');
      return;
    }
    saveTeacherPassword(newPass);
    setSuccessMsg('교사 비밀번호가 성공적으로 변경되었습니다!');
    setErrorMsg('');
    setTimeout(() => {
      setIsChangingPass(false);
      setSuccessMsg('');
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
        
        {/* Header Decorator */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          id="teacher-modal-close-btn"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 border border-indigo-100 shadow-sm">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {title || "교사 전용 대시보드 진입"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {description || "학급 독서 통계 및 학생 기록 관리를 위한 교사 인증이 필요합니다."}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {!isChangingPass ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                교사 비밀번호 입력
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="teacher-password-input"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="선생님 전용 비밀번호를 입력하세요"
                  autoFocus
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-800 focus:border-amber-800 text-sm"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                <KeyRound className="w-3 h-3" />
                <span>학생 접근을 방지하기 위한 선생님 전용 보안 암호입니다.</span>
              </p>
            </div>

            <button
              type="submit"
              id="teacher-login-submit-btn"
              className="w-full py-3.5 px-4 bg-amber-900 hover:bg-amber-950 text-amber-50 font-bold rounded-xl transition-all shadow-md shadow-amber-950/20 flex items-center justify-center gap-2"
            >
              <span>교사 대시보드 입장</span>
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsChangingPass(true);
                  setErrorMsg('');
                }}
                className="text-xs text-slate-500 hover:text-amber-900 underline font-medium"
              >
                비밀번호 변경하기
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                현재 비밀번호
              </label>
              <input
                type="password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                placeholder="현재 교사 비밀번호 입력"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                새 비밀번호
              </label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="4자리 이상 입력"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                새 비밀번호 확인
              </label>
              <input
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="비밀번호 재입력"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-800 text-sm"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsChangingPass(false);
                  setErrorMsg('');
                }}
                className="w-1/2 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-all"
              >
                취소
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 px-3 bg-amber-900 hover:bg-amber-950 text-white font-bold rounded-xl text-xs transition-all shadow-sm"
              >
                비밀번호 변경 저장
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
