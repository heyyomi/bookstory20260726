export const GAS_CODE_SCRIPT = `/**
 * ======================================================
 * [우리반 전자 독서기록장] Google Apps Script (Code.gs)
 * ======================================================
 * 구글 시트를 무료 백엔드 데이터베이스로 연결해주는 스크립트입니다.
 * 
 * [배포 방법]
 * 1. 새 구글 시트(Google Sheets)를 생성합니다.
 * 2. 상단 메뉴에서 [확장 프로그램] > [Apps Script]를 클릭합니다.
 * 3. 기존 코드를 모두 삭제하고 아래 코드를 전체 복사하여 붙여넣습니다.
 * 4. 우측 상단 [배포] > [새 배포]를 클릭합니다.
 * 5. 유형 선택: [웹 앱] 선택
 * 6. 설명: '독서기록장 API' 입력
 * 7. 다음 사용자 권한으로 실행: [나]
 * 8. 액세스 권한 있는 사용자: [모든 사용자] (중요!)
 * 9. [배포] 버튼 클릭 후 요청 시 Access 승인합니다.
 * 10. 생성된 '웹 앱 URL (Web App URL)'을 복사하여 앱에 입력합니다.
 */

const SHEET_NAME = '독서기록장';

function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return responseJSON({ status: 'success', data: [] });
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    const logs = rows.map(row => {
      return {
        id: String(row[0] || ''),
        createdAt: String(row[1] || ''),
        grade: Number(row[2] || 1),
        classNum: Number(row[3] || 1),
        studentName: String(row[4] || ''),
        bookTitle: String(row[5] || ''),
        author: String(row[6] || ''),
        publisher: String(row[7] || ''),
        genre: String(row[8] || '기타'),
        readDate: String(row[9] || ''),
        rating: Number(row[10] || 5),
        summary: String(row[11] || ''),
        thoughts: String(row[12] || ''),
        isFeatured: row[13] === true || row[13] === 'true' || row[13] === 'TRUE',
        teacherComment: String(row[14] || '')
      };
    });
    
    return responseJSON({ status: 'success', data: logs });
  } catch (error) {
    return responseJSON({ status: 'error', message: error.toString() });
  }
}

function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    const contents = JSON.parse(e.postData.contents || '{}');
    const action = contents.action || 'addLog';
    
    if (action === 'syncAll' && Array.isArray(contents.data)) {
      // 전체 동기화 (기존 데이터 유지/업데이트 또는 전체 쓰기)
      clearSheetData(sheet);
      contents.data.forEach(log => {
        appendLogRow(sheet, log);
      });
      return responseJSON({ status: 'success', message: '전체 동기화 성공', count: contents.data.length });
    }
    
    if (action === 'updateLog' && contents.payload) {
      const updatedLog = contents.payload;
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(updatedLog.id)) {
          updateRowAt(sheet, i + 1, updatedLog);
          return responseJSON({ status: 'success', message: '수정 성공' });
        }
      }
      // 없으면 신규 추가
      appendLogRow(sheet, updatedLog);
      return responseJSON({ status: 'success', message: '신규 저장 성공' });
    }

    if (action === 'deleteLog' && contents.id) {
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(contents.id)) {
          sheet.deleteRow(i + 1);
          return responseJSON({ status: 'success', message: '삭제 성공' });
        }
      }
      return responseJSON({ status: 'error', message: '해당 항목을 찾을 수 없습니다.' });
    }
    
    // 기본: 단일 독서록 추가
    const log = contents.payload || contents;
    if (log.bookTitle && log.studentName) {
      appendLogRow(sheet, log);
      return responseJSON({ status: 'success', message: '독서기록 저장 완료', id: log.id });
    }
    
    return responseJSON({ status: 'error', message: '유효하지 않은 데이터 구조입니다.' });
  } catch (error) {
    return responseJSON({ status: 'error', message: error.toString() });
  }
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  
  // 헤더 검사 및 생성
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'ID',
      '생성일시',
      '학년',
      '반',
      '학생이름',
      '도서명',
      '지은이',
      '출판사',
      '장르',
      '읽은날짜',
      '별점',
      '줄거리',
      '소감 및 느낀점',
      '우수독서록여부',
      '교사피드백'
    ]);
    
    // 헤더 스타일 적용
    const headerRange = sheet.getRange(1, 1, 1, 15);
    headerRange.setBackground('#4F46E5');
    headerRange.setFontColor('#FFFFFF');
    headerRange.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  
  return sheet;
}

function appendLogRow(sheet, log) {
  sheet.appendRow([
    log.id || ('log_' + Date.now()),
    log.createdAt || new Date().toISOString(),
    log.grade || 1,
    log.classNum || 1,
    log.studentName || '',
    log.bookTitle || '',
    log.author || '',
    log.publisher || '',
    log.genre || '기타',
    log.readDate || new Date().toISOString().split('T')[0],
    log.rating || 5,
    log.summary || '',
    log.thoughts || '',
    log.isFeatured ? true : false,
    log.teacherComment || ''
  ]);
}

function updateRowAt(sheet, rowIndex, log) {
  const rowData = [
    log.id,
    log.createdAt || new Date().toISOString(),
    log.grade,
    log.classNum,
    log.studentName,
    log.bookTitle,
    log.author,
    log.publisher,
    log.genre,
    log.readDate,
    log.rating,
    log.summary,
    log.thoughts,
    log.isFeatured ? true : false,
    log.teacherComment || ''
  ];
  sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
}

function clearSheetData(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
}

function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
