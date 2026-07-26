import { ReadingLog, GASConfig } from '../types';
import { INITIAL_SAMPLE_LOGS } from './sampleData';

const LOGS_STORAGE_KEY = 'class_reading_logs_v1';
const GAS_CONFIG_KEY = 'class_reading_gas_config_v1';
const TEACHER_PASS_KEY = 'class_reading_teacher_pass_v1';

export function getStoredLogs(): ReadingLog[] {
  try {
    const raw = localStorage.getItem(LOGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_LOGS));
      return INITIAL_SAMPLE_LOGS;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to parse stored logs:', error);
    return INITIAL_SAMPLE_LOGS;
  }
}

export function saveStoredLogs(logs: ReadingLog[]): void {
  try {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Failed to save logs to localStorage:', error);
  }
}

export function getGASConfig(): GASConfig {
  try {
    const raw = localStorage.getItem(GAS_CONFIG_KEY);
    if (!raw) {
      return { webAppUrl: '', lastSyncedAt: null, autoSync: true };
    }
    return JSON.parse(raw);
  } catch (error) {
    return { webAppUrl: '', lastSyncedAt: null, autoSync: true };
  }
}

export function saveGASConfig(config: GASConfig): void {
  try {
    localStorage.setItem(GAS_CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save GAS config:', error);
  }
}

export function getTeacherPassword(): string {
  return localStorage.getItem(TEACHER_PASS_KEY) || '1234';
}

export function saveTeacherPassword(pass: string): void {
  localStorage.setItem(TEACHER_PASS_KEY, pass);
}

// 구글 앱스 스크립트 연결 테스트
export async function testGASUrl(url: string): Promise<{ success: boolean; message: string; count?: number }> {
  if (!url || !url.startsWith('https://script.google.com/')) {
    return { success: false, message: '올바른 구글 앱스 스크립트 웹 앱 URL을 입력해 주세요. (https://script.google.com/...)' };
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) {
      return { success: false, message: `서버 응답 오류 (상태 코드: ${response.status})` };
    }

    const json = await response.json();
    if (json.status === 'success') {
      const logCount = Array.isArray(json.data) ? json.data.length : 0;
      return {
        success: true,
        message: `구글 시트 연동 성공! (현재 저장된 독서기록: ${logCount}건)`,
        count: logCount
      };
    } else {
      return { success: false, message: json.message || '구글 시트 응답 규격이 맞지 않습니다.' };
    }
  } catch (error: any) {
    console.error('GAS Test Error:', error);
    return {
      success: false,
      message: '연동 테스트 실패: 네트워크 접속 또는 CORS 권한을 확인하세요. (배포 시 [모든 사용자] 권한이 필요합니다)'
    };
  }
}

// 구글 시트에서 최신 데이터 받아오기
export async function fetchLogsFromGAS(url: string): Promise<{ success: boolean; logs?: ReadingLog[]; message: string }> {
  if (!url) return { success: false, message: '구글 시트 URL이 설정되지 않았습니다.' };

  try {
    const res = await fetch(url, { method: 'GET' });
    const json = await res.json();
    
    if (json.status === 'success' && Array.isArray(json.data)) {
      return { success: true, logs: json.data, message: '구글 시트 동기화 완료' };
    }
    return { success: false, message: json.message || '데이터 불러오기 실패' };
  } catch (err: any) {
    return { success: false, message: '구글 시트 데이터 로드 중 오류가 발생했습니다.' };
  }
}

// 단일 독서록 구글 시트에 전송
export async function saveLogToGAS(url: string, log: ReadingLog): Promise<{ success: boolean; message: string }> {
  if (!url) {
    return { success: true, message: '로컬 스토리지에 저장되었습니다.' };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'addLog', payload: log })
    });
    
    const json = await res.json();
    if (json.status === 'success') {
      return { success: true, message: '구글 시트 및 로컬 저장 성공!' };
    }
    return { success: false, message: '구글 시트 저장 오류 (로컬에는 저장됨): ' + json.message };
  } catch (err: any) {
    console.warn('Failed to sync to GAS:', err);
    return { success: false, message: '로컬에 저장되었습니다. (구글 시트 전송 실패)' };
  }
}

// 독서록 수정/업데이트 구글 시트에 전송
export async function updateLogToGAS(url: string, log: ReadingLog): Promise<{ success: boolean; message: string }> {
  if (!url) return { success: true, message: '로컬 수정 완료' };

  try {
    const res = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'updateLog', payload: log })
    });
    const json = await res.json();
    return { success: json.status === 'success', message: json.message || '시트 수정 완료' };
  } catch (err) {
    return { success: false, message: '로컬에만 반영되었습니다.' };
  }
}

// 독서록 삭제 구글 시트에 전송
export async function deleteLogFromGAS(url: string, id: string): Promise<{ success: boolean; message: string }> {
  if (!url) return { success: true, message: '로컬 삭제 완료' };

  try {
    const res = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'deleteLog', id })
    });
    const json = await res.json();
    return { success: json.status === 'success', message: json.message || '시트 삭제 완료' };
  } catch (err) {
    return { success: false, message: '로컬에서만 삭제되었습니다.' };
  }
}

// 전체 동기화 (구글 시트로 한 번에 전송)
export async function syncAllToGAS(url: string, logs: ReadingLog[]): Promise<{ success: boolean; message: string }> {
  if (!url) return { success: false, message: '구글 시트 URL을 먼저 설정해 주세요.' };

  try {
    const res = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'syncAll', data: logs })
    });
    const json = await res.json();
    if (json.status === 'success') {
      return { success: true, message: `구글 시트에 총 ${logs.length}건이 성공적으로 동기화되었습니다.` };
    }
    return { success: false, message: json.message || '전체 동기화 실패' };
  } catch (err) {
    return { success: false, message: '구글 시트 연결 오류가 발생했습니다.' };
  }
}

// CSV 다운로드 (한글 깨짐 방지 UTF-8 BOM)
export function exportLogsToCSV(logs: ReadingLog[]): void {
  if (logs.length === 0) {
    alert('다운로드할 독서 기록이 없습니다.');
    return;
  }

  const headers = ['ID', '생성일시', '학년', '반', '학생이름', '도서명', '지은이', '출판사', '장르', '읽은날짜', '별점', '줄거리', '소감', '우수독서록', '교사피드백'];
  
  const rows = logs.map(log => [
    log.id,
    log.createdAt,
    log.grade,
    log.classNum,
    `"${log.studentName.replace(/"/g, '""')}"`,
    `"${log.bookTitle.replace(/"/g, '""')}"`,
    `"${log.author.replace(/"/g, '""')}"`,
    `"${log.publisher.replace(/"/g, '""')}"`,
    `"${log.genre}"`,
    log.readDate,
    log.rating,
    `"${(log.summary || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    `"${(log.thoughts || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    log.isFeatured ? 'Y' : 'N',
    `"${(log.teacherComment || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const today = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `우리반_독서기록장_${today}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
