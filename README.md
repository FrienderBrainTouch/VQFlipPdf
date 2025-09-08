# FlipPdf - 인터랙티브 플립북 애플리케이션

## 📖 프로젝트 개요

FlipPdf는 React와 HTML5 Canvas를 기반으로 한 인터랙티브 플립북 애플리케이션입니다. 두 개의 주요 프로젝트(Friender와 VQ)를 플립북 형태로 제공하며, 사용자가 실제 책을 넘기는 듯한 경험을 할 수 있습니다.

## ✨ 주요 기능

### 🎯 핵심 기능
- **인터랙티브 플립북**: 실제 책을 넘기는 듯한 자연스러운 페이지 전환
- **프로젝트 전환**: Friender와 VQ 프로젝트 간 자유로운 전환
- **반응형 디자인**: 데스크톱과 모바일 환경 모두 지원
- **키보드 네비게이션**: 화살표 키를 사용한 페이지 이동

### 🎨 시각적 효과
- **표지 애니메이션**: 화려한 표지 페이지 애니메이션 효과
- **3D 모델 뷰어**: 특정 이미지 클릭 시 3D 모델 표시
- **인터랙티브 이미지**: 호버 효과와 클릭 시 모달 표시
- **페이지 그림자**: 실제 책과 같은 그림자 효과

### 📱 사용자 경험
- **터치 지원**: 모바일에서 터치 제스처로 페이지 전환
- **페이지 그룹 네비게이션**: 빠른 페이지 이동을 위한 그룹별 버튼
- **PDF 다운로드/프린트**: 원본 PDF 파일 다운로드 및 프린트 기능
- **로딩 상태 표시**: 플립북 준비 상태 안내

## 🏗️ 프로젝트 구조

```
FlipPdf/
├── public/                          # 정적 파일들
│   ├── func-file/                   # PDF 파일들
│   │   ├── FrienderFile/           # Friender 프로젝트 PDF
│   │   └── VQFile/                 # VQ 프로젝트 PDF
│   ├── interacivefile/             # 인터랙티브 미디어 파일들
│   │   ├── FrienderFile/           # Friender 프로젝트 미디어
│   │   └── VQFile/                 # VQ 프로젝트 미디어
│   └── Pdf-img/                    # 플립북 페이지 이미지들
│       ├── Friender/               # Friender 프로젝트 이미지
│       └── VQ/                    # VQ 프로젝트 이미지
├── src/                            # 소스 코드
│   ├── components/                 # React 컴포넌트들
│   │   ├── App.jsx                # 메인 애플리케이션 컴포넌트
│   │   ├── Header.jsx             # 헤더 컴포넌트
│   │   ├── Book.jsx               # Friender 플립북 컴포넌트
│   │   ├── VQBook.jsx             # VQ 플립북 컴포넌트
│   │   └── Model3D.jsx            # 3D 모델 뷰어 컴포넌트
│   ├── assets/                    # 에셋 파일들
│   ├── index.css                  # 전역 스타일
│   └── main.jsx                   # 애플리케이션 진입점
├── package.json                    # 프로젝트 의존성 및 스크립트
├── tailwind.config.js             # Tailwind CSS 설정
├── vite.config.js                 # Vite 빌드 도구 설정
└── README.md                      # 프로젝트 문서
```

## 🚀 기술 스택

### Frontend
- **React 19**: 최신 React 버전을 사용한 컴포넌트 기반 아키텍처
- **Vite**: 빠른 개발 서버와 빌드 도구
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크

### 라이브러리
- **react-pageflip**: HTML5 Canvas 기반 플립북 구현
- **lucide-react**: 아이콘 라이브러리
- **video.js**: 비디오 플레이어 지원

### 개발 도구
- **ESLint**: 코드 품질 관리
- **PostCSS**: CSS 전처리
- **Autoprefixer**: CSS 벤더 프리픽스 자동 추가

## 📋 설치 및 실행

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 또는 yarn 패키지 매니저

### 설치 방법

1. **저장소 클론**
   ```bash
   git clone [repository-url]
   cd FlipPdf
   ```

2. **의존성 설치**
   ```bash
   npm install
   # 또는
   yarn install
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   # 또는
   yarn dev
   ```

4. **브라우저에서 확인**
   ```
   http://localhost:5173
   ```

### 빌드 및 배포

1. **프로덕션 빌드**
   ```bash
   npm run build
   # 또는
   yarn build
   ```

2. **빌드 결과 미리보기**
   ```bash
   npm run preview
   # 또는
   yarn preview
   ```

## 🎮 사용 방법

### 기본 네비게이션
- **마우스**: 페이지를 클릭하여 넘기기
- **키보드**: 좌우 화살표 키로 페이지 이동
- **터치**: 모바일에서 스와이프 제스처

### 프로젝트 전환
1. 헤더의 "Friender" 또는 "VQ" 버튼 클릭
2. 선택된 프로젝트의 플립북이 표시됨

### 인터랙티브 요소
- **이미지 호버**: 이미지에 마우스를 올리면 확대 효과
- **이미지 클릭**: 클릭 시 모달로 확대 표시
- **3D 모델**: 특정 이미지 클릭 시 3D 뷰어 표시

### PDF 기능
- **다운로드**: 현재 프로젝트의 PDF 파일 다운로드
- **프린트**: PDF 파일을 새 창에서 열고 프린트

## 🔧 컴포넌트 상세 설명

### App.jsx
- 애플리케이션의 루트 컴포넌트
- 프로젝트 전환 상태 관리
- 헤더와 플립북 컴포넌트 렌더링

### Header.jsx
- 프로젝트 선택 버튼들
- PDF 다운로드 및 프린트 기능
- 현재 선택된 프로젝트 정보 표시

### Book.jsx (Friender)
- Friender 프로젝트 플립북 구현
- 화려한 표지 애니메이션
- 환경 관련 GIF 및 이미지 인터랙션
- 8페이지 구성

### VQBook.jsx
- VQ 프로젝트 플립북 구현
- 24페이지 구성
- 이미지 및 비디오 인터랙션
- 페이지 그룹별 네비게이션

### Model3D.jsx
- 3D 모델 뷰어
- 마우스/터치 드래그로 회전
- 자동 회전 기능
- 반응형 3D 렌더링

## 📱 반응형 디자인

### 브레이크포인트
- **모바일**: 576px 미만
- **데스크톱**: 576px 이상

### 반응형 요소
- 플립북 크기 자동 조정
- 이미지 위치 및 크기 최적화
- 터치 제스처 지원
- 모바일 친화적 UI

## 🎨 커스터마이징

### 스타일 수정
- `src/index.css`: 전역 스타일
- `tailwind.config.js`: Tailwind CSS 설정
- 각 컴포넌트 내 인라인 스타일

### 이미지 추가
1. `public/interacivefile/`에 새 이미지 파일 추가
2. 해당 컴포넌트의 이미지 매핑 배열에 경로 추가
3. 위치 설정 배열에 좌표 정보 추가

### 페이지 추가
1. `public/Pdf-img/`에 새 페이지 이미지 추가
2. 컴포넌트의 데이터 배열에 페이지 정보 추가
3. 페이지 그룹 정보 업데이트

## 🐛 문제 해결

### 일반적인 문제들

#### 플립북이 로드되지 않는 경우
- 브라우저 콘솔에서 오류 메시지 확인
- 이미지 파일 경로가 올바른지 확인
- 네트워크 연결 상태 확인

#### 애니메이션이 작동하지 않는 경우
- 브라우저가 CSS 애니메이션을 지원하는지 확인
- JavaScript 콘솔에서 오류 메시지 확인

#### 모바일에서 터치가 작동하지 않는 경우
- 터치 이벤트가 활성화되어 있는지 확인
- 브라우저의 터치 설정 확인

### 디버깅 팁
- 브라우저 개발자 도구 사용
- React DevTools 확장 프로그램 설치
- 콘솔 로그 확인

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

## 🙏 감사의 말

- **react-pageflip**: 플립북 기능 구현
- **Tailwind CSS**: 스타일링 프레임워크
- **Vite**: 빌드 도구
- **React**: 프론트엔드 프레임워크

---

**FlipPdf** - 인터랙티브한 디지털 플립북 경험을 제공합니다 📚✨
