# PDF FlipBook Viewer 프로젝트 기획서

## 📋 프로젝트 개요
- **프로젝트명**: Interactive PDF FlipBook Viewer
- **개발환경**: Cursor AI + React
- **주요기술**: React, PDF.js, react-pageflip, Canvas API
- **개발기간**: 5주 (Phase별 1주씩)
- **목표**: PDF 문서를 3D 플립북 형태로 시각화하고 다양한 인터랙티브 기능을 제공하는 웹 애플리케이션

## 🎯 핵심 목표
> PDF를 업로드하면 페이지별 이미지로 변환하여 3D 플립북 효과로 보여주며, 메모/다운로드/프린트 등 실용적 기능과 인터랙티브 요소를 제공하는 차세대 PDF 뷰어

---

---

## ⚡ 주요 기능 명세

### 1. 핵심 기능 (Core Features)

#### 1.1 PDF 업로드 & 변환 시스템
- **업로드 방식**
  - [ ] 드래그 앤 드롭 영역
  - [ ] 파일 선택 버튼
  - [ ] URL로 PDF 로드 (선택사항)

- **파일 처리**
  - [ ] 파일 형식 검증 (PDF만 허용)
  - [ ] 파일 크기 제한 (최대 50MB)
  - [ ] 페이지 수 제한 (최대 500페이지)
  - [ ] 프로그레스 바 표시

- **PDF → 이미지 변환**
```javascript
// 변환 프로세스
const convertPDFToImages = async (pdfFile) => {
  // 1. PDF.js로 문서 로드
  // 2. 각 페이지를 Canvas로 렌더링
  // 3. Canvas를 이미지 데이터로 변환
  // 4. 이미지 배열 반환
}
```

#### 1.2 3D 플립북 뷰어
- **react-pageflip 설정**
  - [ ] 부드러운 페이지 넘김 애니메이션
  - [ ] 물리적 페이지 넘김 효과
  - [ ] 반응형 크기 조절

- **조작 방식**
  - [ ] 마우스 드래그로 페이지 넘기기
  - [ ] 터치 제스처 지원 (모바일)
  - [ ] 키보드 네비게이션 (←, → 방향키)
  - [ ] 페이지 모서리 클릭으로 넘기기

### 2. 하단 컨트롤 패널

#### 2.1 다운로드 기능
- **다운로드 옵션**
  - [ ] 원본 PDF 다운로드
  - [ ] 현재 페이지 이미지 다운로드 (PNG/JPEG)
  - [ ] 전체 페이지 ZIP 파일 다운로드
  - [ ] 선택된 페이지들만 다운로드

```javascript
// 다운로드 기능 구현
const downloadOptions = {
  originalPDF: () => downloadFile(originalPDFBlob, 'document.pdf'),
  currentPageImage: (pageNum, format) => downloadPageAsImage(pageNum, format),
  allPagesZip: () => downloadAllPagesAsZip(),
  selectedPages: (pageNumbers) => downloadSelectedPages(pageNumbers)
}
```

#### 2.2 페이지별 메모 시스템
- **메모 기능**
  - [ ] 각 페이지별 텍스트 메모 추가/수정/삭제
  - [ ] 메모 자동 저장 (IndexedDB)
  - [ ] 메모 검색 기능
  - [ ] 메모가 있는 페이지 하이라이트 표시

- **데이터 구조**
```javascript
const memoStructure = {
  pdfId: "unique-pdf-id",
  pdfName: "document.pdf",
  pages: [
    {
      pageNumber: 1,
      memos: [
        {
          id: "memo-uuid",
          text: "중요한 내용 메모",
          timestamp: "2024-01-01T00:00:00Z",
          color: "#ffeb3b" // 메모 색상
        }
      ]
    }
  ]
}
```

- **메모 내보내기**
  - [ ] 텍스트 파일로 내보내기
  - [ ] JSON 파일로 내보내기
  - [ ] 페이지별 메모 요약 생성

#### 2.3 프린터 기능
- **프린트 옵션**
  - [ ] 전체 페이지 프린트
  - [ ] 현재 페이지만 프린트
  - [ ] 페이지 범위 선택 프린트
  - [ ] 메모 포함/제외 옵션

- **프린트 설정**
  - [ ] 용지 크기 선택 (A4, Letter, 맞춤)
  - [ ] 여백 설정
  - [ ] 페이지당 페이지 수 (1, 2, 4페이지)
  - [ ] 프린트 미리보기

### 3. 인터랙티브 요소

#### 3.1 페이지 내 상호작용
- **기본 인터랙션**
  - [ ] 더블클릭으로 페이지 확대/축소
  - [ ] 핀치 제스처 지원 (모바일)
  - [ ] 페이지 내 특정 영역 하이라이트
  - [ ] 중요 페이지 북마크 기능

#### 3.2 중간 인터랙티브 페이지 삽입
- **커스텀 페이지 추가**
  - [ ] 특정 페이지 사이에 인터랙티브 요소 삽입
  - [ ] 퀴즈/설문 페이지 생성
  - [ ] 비디오 임베드 페이지
  - [ ] 외부 링크 연결 페이지

```javascript
// 인터랙티브 요소 구조
const interactiveElements = [
  {
    type: "quiz",
    position: "after-page-5",
    content: {
      question: "이 장의 핵심 내용은?",
      options: ["A", "B", "C", "D"],
      correct: 1
    }
  },
  {
    type: "video",
    position: "after-page-10", 
    content: {
      url: "https://youtube.com/watch?v=...",
      title: "참고 영상"
    }
  }
]
```

#### 3.3 고급 인터랙션
- **핫스팟 기능**
  - [ ] 페이지 내 특정 영역 클릭 시 팝업
  - [ ] 용어 설명 툴팁
  - [ ] 관련 페이지로 이동 링크
  - [ ] 추가 자료 모달 창

---

## 🏗️ 컴포넌트 구조

### 폴더 구조
```
src/
├── components/
│   ├── PDFUploader/
│   │   ├── PDFUploader.jsx
│   │   ├── DragDropZone.jsx
│   │   └── UploadProgress.jsx
│   │
│   ├── FlipBook/
│   │   ├── FlipBookViewer.jsx
│   │   ├── PageRenderer.jsx
│   │   └── InteractivePage.jsx
│   │
│   ├── ControlPanel/
│   │   ├── ControlPanel.jsx
│   │   ├── NavigationButtons.jsx
│   │   ├── DownloadButton.jsx
│   │   └── PrintButton.jsx
│   │
│   ├── MemoSystem/
│   │   ├── MemoPanel.jsx
│   │   ├── MemoEditor.jsx
│   │   ├── MemoList.jsx
│   │   └── MemoSearch.jsx
│   │
│   ├── InteractiveElements/
│   │   ├── Hotspot.jsx
│   │   ├── QuizPage.jsx
│   │   ├── VideoPage.jsx
│   │   └── LinkPage.jsx
│   │
│   └── UI/
│       ├── Modal.jsx
│       ├── Tooltip.jsx
│       ├── ProgressBar.jsx
│       └── Button.jsx
│
├── hooks/
│   ├── usePDFParser.js      // PDF 파싱 로직
│   ├── useMemo.js           // 메모 CRUD 로직
│   ├── useFlipBook.js       // 플립북 상태 관리
│   ├── useDownload.js       // 다운로드 기능
│   └── usePrint.js          // 프린트 기능
│
├── utils/
│   ├── pdfConverter.js      // PDF → 이미지 변환
│   ├── downloadHelper.js    // 파일 다운로드 헬퍼
│   ├── printHelper.js       // 프린트 헬퍼
│   ├── memoStorage.js       // IndexedDB 메모 저장
│   └── fileValidator.js     // 파일 검증
│
├── context/
│   ├── AppContext.js        // 전역 상태 관리
│   ├── PDFContext.js        // PDF 관련 상태
│   └── MemoContext.js       // 메모 관련 상태
│
└── styles/
    ├── globals.css
    ├── components.css
    └── animations.css
```

### 주요 컴포넌트 명세

#### PDFUploader 컴포넌트
```javascript
const PDFUploader = () => {
  // Props: onFileUpload, isLoading
  // State: dragActive, uploadProgress
  // Features: 드래그앤드롭, 파일검증, 프로그레스
}
```

#### FlipBookViewer 컴포넌트
```javascript
const FlipBookViewer = () => {
  // Props: pages, onPageChange, interactiveElements
  // State: currentPage, isFlipping, zoomLevel
  // Features: 3D 플립 애니메이션, 페이지 네비게이션
}
```

#### MemoSystem 컴포넌트
```javascript
const MemoSystem = () => {
  // Props: currentPage, pdfId
  // State: memos, editingMemo, searchQuery
  // Features: CRUD 메모, 검색, 저장
}
```

---

## 🎨 UI/UX 디자인

### 레이아웃 구성
```
┌─────────────────────────────────────────────────────┐
│  Header: 📖 PDF FlipBook Viewer | document.pdf      │
├─────────────────────────────────────────────────────┤
│  Sidebar   │                                        │
│  📑 썸네일   │        FlipBook Viewer                 │
│  📝 메모     │         (Main Area)                   │
│  🔖 북마크   │                                        │
│  [토글버튼]  │                                        │
├─────────────────────────────────────────────────────┤
│  Control Panel                                      │
│  [◀] [▶] | 1/25 | [🔍] [📝] [⬇] [🖨] [⚙] [전체화면]   │
└─────────────────────────────────────────────────────┘
```

### 컨트롤 패널 버튼
```javascript
const controlButtons = [
  { icon: "◀", label: "이전 페이지", action: "prevPage" },
  { icon: "▶", label: "다음 페이지", action: "nextPage" },
  { icon: "🔍", label: "확대/축소", action: "toggleZoom" },
  { icon: "📑", label: "썸네일", action: "toggleThumbnail" },
  { icon: "📝", label: "메모", action: "toggleMemo" },
  { icon: "⬇", label: "다운로드", action: "showDownloadMenu" },
  { icon: "🖨", label: "프린트", action: "openPrintDialog" },
  { icon: "⚙", label: "설정", action: "openSettings" }
]
```

### 반응형 브레이크포인트
```css
/* Tailwind CSS 브레이크포인트 */
.responsive-design {
  /* Mobile: < 768px */
  @apply w-full p-2;
  
  /* Tablet: 768px ~ 1024px */
  @media (min-width: 768px) {
    @apply w-3/4 p-4;
  }
  
  /* Desktop: > 1024px */
  @media (min-width: 1024px) {
    @apply w-full max-w-6xl p-6;
  }
}
```

---

## 🚀 개발 단계별 로드맵

### Phase 1: 기본 플립북 구현 (1주)
**목표**: PDF 업로드 후 3D 플립북으로 볼 수 있는 기본 기능

#### Week 1 Tasks
- [ ] **Day 1-2**: 프로젝트 초기 설정
  - [ ] React 프로젝트 생성 및 라이브러리 설치
  - [ ] 폴더 구조 설정
  - [ ] Tailwind CSS 설정
  
- [ ] **Day 3-4**: PDF 업로드 & 변환 기능
  - [ ] PDFUploader 컴포넌트 구현
  - [ ] PDF.js를 이용한 이미지 변환 로직
  - [ ] 파일 검증 및 에러 처리
  
- [ ] **Day 5-7**: react-pageflip 기본 구현
  - [ ] FlipBookViewer 컴포넌트 구현
  - [ ] 페이지 네비게이션 (이전/다음 버튼)
  - [ ] 기본 스타일링

#### 완료 기준
```javascript
// Phase 1 완료 체크리스트
const phase1Complete = {
  pdfUpload: true,          // PDF 파일 업로드 가능
  imageConversion: true,    // PDF → 이미지 변환 완료
  basicFlipbook: true,      // 3D 플립북 효과 작동
  pageNavigation: true      // 페이지 이동 가능
}
```

### Phase 2: 컨트롤 패널 구현 (1주)
**목표**: 다운로드, 프린트 등 실용적 기능 추가

#### Week 2 Tasks
- [ ] **Day 1-2**: 다운로드 기능
  - [ ] 원본 PDF 다운로드
  - [ ] 개별 페이지 이미지 다운로드
  - [ ] ZIP 파일 생성 및 다운로드
  
- [ ] **Day 3-4**: 프린트 기능
  - [ ] 브라우저 프린트 API 연동
  - [ ] 프린트 옵션 설정 UI
  - [ ] 프린트 미리보기
  
- [ ] **Day 5-7**: UI 개선 및 최적화
  - [ ] 썸네일 뷰 구현
  - [ ] 반응형 디자인 적용
  - [ ] 로딩 상태 및 에러 처리 개선

### Phase 3: 메모 시스템 구현 (1주)  
**목표**: 페이지별 메모 작성, 저장, 관리 기능

#### Week 3 Tasks
- [ ] **Day 1-2**: 메모 CRUD 기능
  - [ ] MemoEditor 컴포넌트 구현
  - [ ] 페이지별 메모 추가/수정/삭제
  - [ ] 메모 UI 디자인
  
- [ ] **Day 3-4**: 메모 저장 및 검색
  - [ ] IndexedDB를 이용한 로컬 저장
  - [ ] 메모 검색 기능
  - [ ] 메모가 있는 페이지 하이라이트
  
- [ ] **Day 5-7**: 메모 고급 기능
  - [ ] 메모 내보내기 (TXT, JSON)
  - [ ] 메모 색상 및 카테고리
  - [ ] 메모 히스토리 관리

### Phase 4: 인터랙티브 요소 구현 (1주)
**목표**: 핫스팟, 퀴즈 등 상호작용 요소 추가

#### Week 4 Tasks
- [ ] **Day 1-2**: 기본 인터랙션
  - [ ] 페이지 확대/축소 기능
  - [ ] 북마크 시스템
  - [ ] 핫스팟 기능 구현
  
- [ ] **Day 3-4**: 커스텀 인터랙티브 페이지
  - [ ] 퀴즈 페이지 컴포넌트
  - [ ] 비디오 임베드 페이지
  - [ ] 링크 연결 페이지
  
- [ ] **Day 5-7**: 인터랙션 통합
  - [ ] 인터랙티브 요소 관리 시스템
  - [ ] 애니메이션 효과 추가
  - [ ] 사용자 상호작용 데이터 저장

### Phase 5: 최적화 & 마무리 (1주)
**목표**: 성능 최적화, 버그 수정, 완성도 향상

#### Week 5 Tasks
- [ ] **Day 1-2**: 성능 최적화
  - [ ] 이미지 레이지 로딩
  - [ ] 메모리 사용량 최적화
  - [ ] 렌더링 성능 개선
  
- [ ] **Day 3-4**: 접근성 및 사용성
  - [ ] 키보드 네비게이션 개선
  - [ ] 스크린 리더 지원
  - [ ] 다크모드 지원
  
- [ ] **Day 5-7**: 테스트 & 배포
  - [ ] 크로스 브라우저 테스트
  - [ ] 모바일 디바이스 테스트
  - [ ] 최종 버그 수정 및 배포 준비

---

## 🔧 개발 환경 설정

### 초기 설정 명령어
```bash
# 프로젝트 생성
npx create-react-app pdf-flipbook-viewer
cd pdf-flipbook-viewer

# 필수 라이브러리 설치
npm install react-pageflip pdfjs-dist dexie framer-motion html2canvas

# 개발 도구 설치
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 프로젝트 시작
npm start
```

### Cursor AI 설정파일 (.cursorrules)
```
# PDF FlipBook Viewer 프로젝트 규칙

## 코딩 스타일
- React 함수형 컴포넌트 사용
- Hooks를 활용한 상태 관리
- Tailwind CSS로 스타일링
- ES6+ 문법 사용

## 컴포넌트 네이밍
- PascalCase로 컴포넌트명 작성
- 파일명과 컴포넌트명 일치
- 의미있는 이름 사용

## 폴더 구조 준수
- components/기능별/컴포넌트.jsx
- hooks/use기능명.js
- utils/기능Helper.js

## 주석 및 문서화
- 복잡한 로직에는 주석 추가
- 컴포넌트 상단에 기능 설명 주석
- PropTypes 또는 TypeScript 활용 권장
```

---

## 📊 성능 및 품질 목표

### 성능 지표
- **PDF 로딩 속도**: 10MB 파일 기준 3-5초 이내
- **페이지 전환**: 60fps 부드러운 애니메이션
- **메모리 사용량**: 페이지당 평균 500KB 이하
- **번들 크기**: 전체 애플리케이션 5MB 이하

### 브라우저 지원
- **데스크톱**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **모바일**: iOS Safari 14+, Chrome Mobile 90+
- **태블릿**: iPad Safari, Android Chrome

### 사용성 목표
- **로딩 시간**: 첫 화면 표시 2초 이내
- **반응성**: 사용자 액션 후 0.1초 이내 반응
- **접근성**: WCAG 2.1 AA 수준 준수

---

## 🎉 확장 가능성 및 향후 계획

### Phase 6: 고급 기능 (추후 개발)
- [ ] **협업 기능**: 실시간 메모 공유 및 댓글
- [ ] **클라우드 저장**: Google Drive, Dropbox 연동
- [ ] **OCR 기능**: PDF 텍스트 인식 및 검색
- [ ] **AI 요약**: 페이지별 자동 요약 생성
- [ ] **다국어 지원**: i18n 국제화 구현

### 기술 부채 관리
- [ ] TypeScript 도입 검토
- [ ] 테스트 코드 작성 (Jest, React Testing Library)
- [ ] 상태 관리 라이브러리 검토 (Redux Toolkit, Zustand)
- [ ] PWA 기능 추가 검토

### 사용자 피드백 반영
- [ ] 사용자 행동 분석 도구 도입
- [ ] A/B 테스트를 통한 UX 개선
- [ ] 사용자 요청 기능 우선순위 관리

---

## 🛠️ 개발 시 주의사항

### 성능 최적화
- PDF 파일이 클 경우 청크 단위로 처리
- 이미지 변환 시 Web Worker 사용 검토
- Virtual Scrolling으로 많은 페이지 처리
- 메모리 누수 방지를 위한 cleanup 코드 작성

### 보안 고려사항
- 업로드 파일 타입 검증 강화
- XSS 방지를 위한 사용자 입력 검증
- 민감한 PDF 내용 처리 시 주의
- 로컬 저장 데이터 암호화 검토

### 접근성 (a11y)
- 키보드만으로 모든 기능 조작 가능
- 스크린 리더 친화적 마크업
- 색상 대비비 WCAG 기준 준수
- 포커스 표시 명확하게 구현

---

## 📞 개발 지원 및 참고자료

### 공식 문서
- [React 공식 문서](https://react.dev)
- [PDF.js 문서](https://mozilla.github.io/pdf.js/)
- [react-pageflip 문서](https://github.com/Flipbook-Animation/react-pageflip)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

### 예제 및 튜토리얼
- PDF.js 기본 사용법
- react-pageflip 고급 설정
- IndexedDB 데이터 관리
- Canvas 이미지 처리 기법

### 개발 도구
- React Developer Tools
- PDF.js 온라인 테스터
- Canvas 디버깅 도구
- 성능 모니터링 도구

이 기획서를 바탕으로 단계적으로 개발을 진행하여 완성도 높은 PDF 플립북 뷰어를 만들어보세요! 🚀