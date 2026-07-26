export interface ReadingLog {
  id: string;
  grade: number;          // 학년 (1~6 또는 1~3)
  classNum: number;       // 반 (1~20)
  studentName: string;    // 학생 이름
  bookTitle: string;      // 도서명
  author: string;         // 지은이
  publisher: string;      // 출판사
  genre: string;          // 장르 (문학, 비문학, 과학, 역사, 예술, 기타 등)
  readDate: string;       // 읽은 날짜 (YYYY-MM-DD)
  rating: number;         // 별점 (1~5)
  summary: string;        // 줄거리
  thoughts: string;       // 소감 및 느낀점
  isFeatured?: boolean;   // 이달의 우수 독서록 여부 (교사 지정)
  teacherComment?: string; // 교사 한마디 / 피드백
  createdAt: string;      // 생성 일시 (ISO)
}

export type UserMode = 'student' | 'teacher';
export type StudentTab = 'submit' | 'history';
export type TeacherTab = 'dashboard' | 'hallOfFame' | 'settings';

export interface GASConfig {
  webAppUrl: string;
  lastSyncedAt: string | null;
  autoSync: boolean;
}

export interface ClassStats {
  totalLogs: number;
  totalStudents: number;
  featuredCount: number;
  thisMonthCount: number;
}
